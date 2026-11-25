/**
 * PARTE 1 — VER PQRS
 * Carga de la lista, estados (cargando / error / vacío), filtros y botón volver.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import { pqrsMock, renderVerPqrs, VerPqrs } from './pqrsHelpers.jsx';

jest.mock('axios');
jest.mock('../config.js', () => ({ API_URL: 'http://localhost:3000' }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

beforeEach(() => {
  axios.get.mockReset();
  axios.patch.mockReset();
  mockNavigate.mockClear();
  localStorage.setItem('token', 'token-falso');
});

describe('VerPqrs - ver PQRS', () => {
  test('muestra "Cargando PQRS..." mientras espera la respuesta', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // nunca resuelve
    render(
      <MemoryRouter>
        <VerPqrs />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando PQRS...')).toBeInTheDocument();
  });

  test('consulta el endpoint de admin enviando el token', async () => {
    await renderVerPqrs();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/pqrs/admin', {
      headers: { Authorization: 'Bearer token-falso' }
    });
  });

  test('muestra una tarjeta por cada PQRS con su código', async () => {
    await renderVerPqrs();
    expect(screen.getByText(/PQRS-001/)).toBeInTheDocument();
    expect(screen.getByText(/PQRS-002/)).toBeInTheDocument();
    expect(screen.getByText(/PQRS-003/)).toBeInTheDocument();
  });

  test('muestra el nombre y el email del usuario en la tarjeta', async () => {
    await renderVerPqrs();
    expect(screen.getByText(/Valeria/)).toBeInTheDocument();
    expect(screen.getByText(/juan@correo.com/)).toBeInTheDocument();
  });

  test('corta la descripción a 100 caracteres y agrega "..."', async () => {
    await renderVerPqrs();
    const larga = pqrsMock[0].Descripcion;
    const esperado = `${larga.substring(0, 100)}...`;
    expect(screen.getByText(esperado)).toBeInTheDocument();
    expect(screen.queryByText(larga)).not.toBeInTheDocument();
  });

  test('muestra los badges de estado en español', async () => {
    await renderVerPqrs();
    // Los badges son <span class="estado-badge ...">
    expect(document.querySelector('.badge-pendiente')).toHaveTextContent('Pendiente');
    expect(document.querySelector('.badge-proceso')).toHaveTextContent('En proceso');
    expect(document.querySelector('.badge-resuelta')).toHaveTextContent('Resuelta');
  });

  test('muestra "No hay PQRS para mostrar" si la lista viene vacía', async () => {
    await renderVerPqrs([]);
    expect(screen.getByText('No hay PQRS para mostrar')).toBeInTheDocument();
  });

  test('muestra error si falla la petición', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('Network Error'));
    render(
      <MemoryRouter>
        <VerPqrs />
      </MemoryRouter>
    );
    expect(await screen.findByText('Error al cargar las PQRS')).toBeInTheDocument();
    spy.mockRestore();
  });

  describe('filtros', () => {
    test('los botones muestran el conteo por estado', async () => {
      await renderVerPqrs();
      expect(screen.getByRole('button', { name: 'Todas (3)' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Pendientes (1)' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'En proceso (1)' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Resueltas (1)' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cerradas (0)' })).toBeInTheDocument();
    });

    test('filtrar por "Pendientes" deja solo las pendientes', async () => {
      await renderVerPqrs();
      fireEvent.click(screen.getByRole('button', { name: /^Pendientes/ }));
      expect(screen.getByText(/PQRS-001/)).toBeInTheDocument();
      expect(screen.queryByText(/PQRS-002/)).not.toBeInTheDocument();
      expect(screen.queryByText(/PQRS-003/)).not.toBeInTheDocument();
    });

    test('filtrar por "Resueltas" deja solo las resueltas', async () => {
      await renderVerPqrs();
      fireEvent.click(screen.getByRole('button', { name: /^Resueltas/ }));
      expect(screen.getByText(/PQRS-003/)).toBeInTheDocument();
      expect(screen.queryByText(/PQRS-001/)).not.toBeInTheDocument();
    });

    test('filtrar por un estado sin registros muestra el mensaje vacío', async () => {
      await renderVerPqrs();
      fireEvent.click(screen.getByRole('button', { name: /^Cerradas/ }));
      expect(screen.getByText('No hay PQRS para mostrar')).toBeInTheDocument();
    });

    test('volver a "Todas" muestra de nuevo todas las PQRS', async () => {
      await renderVerPqrs();
      fireEvent.click(screen.getByRole('button', { name: /^Pendientes/ }));
      fireEvent.click(screen.getByRole('button', { name: /^Todas/ }));
      expect(screen.getByText(/PQRS-001/)).toBeInTheDocument();
      expect(screen.getByText(/PQRS-002/)).toBeInTheDocument();
      expect(screen.getByText(/PQRS-003/)).toBeInTheDocument();
    });

    test('el filtro activo recibe la clase "active"', async () => {
      await renderVerPqrs();
      const btn = screen.getByRole('button', { name: /^En proceso/ });
      fireEvent.click(btn);
      expect(btn).toHaveClass('active');
    });
  });

  test('el botón "Volver al Panel" navega a /admin', async () => {
    await renderVerPqrs();
    fireEvent.click(screen.getByText('← Volver al Panel'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
});