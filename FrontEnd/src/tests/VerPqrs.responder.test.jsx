/**
 * PARTE 2 — APROBAR / RESPONDER
 * Abrir el modal, validar la respuesta, enviarla (PATCH con estado "resuelta")
 * y manejar éxito / error.
 */
import React from 'react';
import { screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { renderVerPqrs, abrirModal } from './pqrsHelpers.jsx';

jest.mock('axios');
jest.mock('../config.js', () => ({ API_URL: 'http://localhost:3000' }));

const PLACEHOLDER = /Escribe aquí tu respuesta/;

beforeEach(() => {
  axios.get.mockReset();
  axios.patch.mockReset();
  localStorage.setItem('token', 'token-falso');
});

afterEach(() => {
  jest.useRealTimers();
});

describe('VerPqrs - responder / aprobar', () => {
  describe('modal', () => {
    test('al hacer clic en una tarjeta abre el modal con el detalle', async () => {
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      const modal = within(document.querySelector('.modal-content'));
      expect(modal.getByText('Gestionar PQRS')).toBeInTheDocument();
      expect(modal.getByText('valeria@correo.com', { exact: false })).toBeInTheDocument();
      expect(modal.getByText('3001234567', { exact: false })).toBeInTheDocument();
      expect(modal.getByText(/revisen el caso por favor/)).toBeInTheDocument();
    });

    test('muestra "No especificado" si la PQRS no tiene teléfono', async () => {
      await renderVerPqrs();
      await abrirModal('PQRS-002');
      expect(screen.getByText('No especificado', { exact: false })).toBeInTheDocument();
    });

    test('precarga la respuesta existente en el textarea', async () => {
      await renderVerPqrs();
      await abrirModal('PQRS-002');
      expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveValue('Estamos revisando el inventario.');
    });

    test('el textarea queda vacío si la PQRS no tiene respuesta', async () => {
      await renderVerPqrs();
      await abrirModal('PQRS-001');
      expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveValue('');
    });

    test('"Cancelar" cierra el modal', async () => {
      await renderVerPqrs();
      await abrirModal();
      fireEvent.click(screen.getByText('Cancelar'));
      expect(screen.queryByText('Gestionar PQRS')).not.toBeInTheDocument();
    });

    test('el botón × cierra el modal', async () => {
      await renderVerPqrs();
      await abrirModal();
      fireEvent.click(screen.getByText('×'));
      expect(screen.queryByText('Gestionar PQRS')).not.toBeInTheDocument();
    });
  });

  describe('enviar respuesta', () => {
    test('no envía si la respuesta está vacía y muestra error', async () => {
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      fireEvent.click(screen.getByText(/Enviar Respuesta/));

      expect(screen.getByText('Por favor escribe una respuesta antes de enviar')).toBeInTheDocument();
      expect(axios.patch).not.toHaveBeenCalled();
    });

    test('no envía si la respuesta son solo espacios', async () => {
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: '    ' } });
      fireEvent.click(screen.getByText(/Enviar Respuesta/));

      expect(axios.patch).not.toHaveBeenCalled();
    });

    test('envía PATCH con estado "resuelta", la respuesta y el token', async () => {
      axios.patch.mockResolvedValue({ data: {} });
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), {
        target: { value: 'Lamentamos lo ocurrido, enviaremos un nuevo pedido.' }
      });
      fireEvent.click(screen.getByText(/Enviar Respuesta/));

      await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:3000/api/pqrs/admin/1',
        { estado: 'resuelta', respuesta: 'Lamentamos lo ocurrido, enviaremos un nuevo pedido.' },
        { headers: { Authorization: 'Bearer token-falso' } }
      );
    });

    test('al enviar: muestra éxito, cierra el modal y recarga la lista', async () => {
      axios.patch.mockResolvedValue({ data: {} });
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: 'Listo' } });
      fireEvent.click(screen.getByText(/Enviar Respuesta/));

      expect(await screen.findByText('Respuesta enviada correctamente')).toBeInTheDocument();
      expect(screen.queryByText('Gestionar PQRS')).not.toBeInTheDocument();
      // 1 carga inicial + 1 recarga después de responder
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    test('el mensaje de éxito desaparece a los 3 segundos', async () => {
      jest.useFakeTimers();
      axios.patch.mockResolvedValue({ data: {} });
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: 'Listo' } });
      fireEvent.click(screen.getByText(/Enviar Respuesta/));
      await screen.findByText('Respuesta enviada correctamente');

      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(screen.queryByText('Respuesta enviada correctamente')).not.toBeInTheDocument();
    });

    test('si el PATCH falla muestra error y mantiene el modal abierto', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.patch.mockRejectedValue(new Error('500'));
      await renderVerPqrs();
      await abrirModal('PQRS-001');

      fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: 'Listo' } });
      fireEvent.click(screen.getByText(/Enviar Respuesta/));

      expect(await screen.findByText('Error al enviar la respuesta')).toBeInTheDocument();
      expect(screen.getByText('Gestionar PQRS')).toBeInTheDocument();
      spy.mockRestore();
    });
  });
});