/**
 * PARTE 3 — ACTUALIZAR ESTADO
 * Select de estado + botón "Actualizar solo estado" (PATCH sin forzar "resuelta").
 */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { renderVerPqrs, abrirModal } from './pqrsHelpers.jsx';

jest.mock('axios');
jest.mock('../config.js', () => ({ API_URL: 'http://localhost:3000' }));

beforeEach(() => {
  axios.get.mockReset();
  axios.patch.mockReset();
  localStorage.setItem('token', 'token-falso');
});

describe('VerPqrs - actualizar estado', () => {
  test('el select muestra el estado actual de la PQRS', async () => {
    await renderVerPqrs();
    await abrirModal('PQRS-002');
    expect(screen.getByRole('combobox')).toHaveValue('en_proceso');
  });

  test('el select ofrece los 4 estados', async () => {
    await renderVerPqrs();
    await abrirModal('PQRS-001');
    const valores = screen.getAllByRole('option').map((o) => o.value);
    expect(valores).toEqual(['pendiente', 'en_proceso', 'resuelta', 'cerrada']);
  });

  test('cambiar el select actualiza el valor seleccionado', async () => {
    await renderVerPqrs();
    await abrirModal('PQRS-001');
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'cerrada' } });
    expect(select).toHaveValue('cerrada');
  });

  test('cambiar el select NO llama a la API hasta pulsar el botón', async () => {
    await renderVerPqrs();
    await abrirModal('PQRS-001');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en_proceso' } });
    expect(axios.patch).not.toHaveBeenCalled();
  });

  test('envía PATCH con el nuevo estado y respuesta null si no hay respuesta', async () => {
    axios.patch.mockResolvedValue({ data: {} });
    await renderVerPqrs();
    await abrirModal('PQRS-001'); // no tiene respuesta

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en_proceso' } });
    fireEvent.click(screen.getByText('Actualizar solo estado'));

    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    expect(axios.patch).toHaveBeenCalledWith(
      'http://localhost:3000/api/pqrs/admin/1',
      { estado: 'en_proceso', respuesta: null },
      { headers: { Authorization: 'Bearer token-falso' } }
    );
  });

  test('conserva la respuesta existente al cambiar solo el estado', async () => {
    axios.patch.mockResolvedValue({ data: {} });
    await renderVerPqrs();
    await abrirModal('PQRS-002'); // respuesta: "Estamos revisando el inventario."

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cerrada' } });
    fireEvent.click(screen.getByText('Actualizar solo estado'));

    await waitFor(() => expect(axios.patch).toHaveBeenCalled());
    expect(axios.patch).toHaveBeenCalledWith(
      'http://localhost:3000/api/pqrs/admin/2',
      { estado: 'cerrada', respuesta: 'Estamos revisando el inventario.' },
      { headers: { Authorization: 'Bearer token-falso' } }
    );
  });

  test('si no se cambia el select, envía el estado que ya tenía', async () => {
    axios.patch.mockResolvedValue({ data: {} });
    await renderVerPqrs();
    await abrirModal('PQRS-001');

    fireEvent.click(screen.getByText('Actualizar solo estado'));

    await waitFor(() => expect(axios.patch).toHaveBeenCalled());
    expect(axios.patch.mock.calls[0][1].estado).toBe('pendiente');
  });

  test('muestra el mensaje de éxito con el estado en español y cierra el modal', async () => {
    axios.patch.mockResolvedValue({ data: {} });
    await renderVerPqrs();
    await abrirModal('PQRS-001');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en_proceso' } });
    fireEvent.click(screen.getByText('Actualizar solo estado'));

    expect(await screen.findByText('Estado actualizado a En proceso')).toBeInTheDocument();
    expect(screen.queryByText('Gestionar PQRS')).not.toBeInTheDocument();
  });

  test('recarga la lista después de actualizar', async () => {
    axios.patch.mockResolvedValue({ data: {} });
    await renderVerPqrs();
    await abrirModal('PQRS-001');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cerrada' } });
    fireEvent.click(screen.getByText('Actualizar solo estado'));

    await screen.findByText('Estado actualizado a Cerrada');
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  test('si el PATCH falla muestra error y no cierra el modal', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.patch.mockRejectedValue(new Error('500'));
    await renderVerPqrs();
    await abrirModal('PQRS-001');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cerrada' } });
    fireEvent.click(screen.getByText('Actualizar solo estado'));

    expect(await screen.findByText('Error al actualizar el estado')).toBeInTheDocument();
    expect(screen.getByText('Gestionar PQRS')).toBeInTheDocument();
    spy.mockRestore();
  });
});