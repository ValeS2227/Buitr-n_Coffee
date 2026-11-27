import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

import VerPqrs from '../Admin-paginas/VerPqrs.jsx';

export const pqrsMock = [
  {
    ID_PQRS: 1,
    Tipo: 'queja',
    Estado: 'pendiente',
    Codigo_Referencia: 'PQRS-001',
    Nombre: 'Valeria',
    Email: 'valeria@correo.com',
    Telefono: '3001234567',
    Descripcion:
      'El pedido llegó con el empaque dañado y el café derramado dentro de la caja. Quisiera que revisen el caso por favor.',
    Fecha_Creacion: '2026-11-01T10:00:00Z',
    Respuesta: null
  },
  {
    ID_PQRS: 2,
    Tipo: 'pregunta',
    Estado: 'en_proceso',
    Codigo_Referencia: 'PQRS-002',
    Nombre: 'Juan Carlos',
    Email: 'juan@correo.com',
    Telefono: null,
    Descripcion: '¿Tienen café molido para cafetera italiana?',
    Fecha_Creacion: '2026-11-02T10:00:00Z',
    Respuesta: 'Estamos revisando el inventario.'
  },
  {
    ID_PQRS: 3,
    Tipo: 'felicitacion',
    Estado: 'resuelta',
    Codigo_Referencia: 'PQRS-003',
    Nombre: 'Sharon',
    Email: 'sharon@correo.com',
    Telefono: '3109876543',
    Descripcion: 'Excelente café, muy buena atención.',
    Fecha_Creacion: '2026-11-03T10:00:00Z',
    Respuesta: 'Gracias por tu mensaje.'
  }
];

// Renderiza la vista con la lista simulada y espera a que termine de cargar
export const renderVerPqrs = async (data = pqrsMock) => {
  axios.get.mockResolvedValue({ data });
  render(
    <MemoryRouter>
      <VerPqrs />
    </MemoryRouter>
  );
  await screen.findByText('GESTIÓN DE PQRS');
};

// Hace clic en una tarjeta y espera a que abra el modal
export const abrirModal = async (codigo = 'PQRS-001') => {
  fireEvent.click(screen.getByText(new RegExp(codigo)));
  await screen.findByText('Gestionar PQRS');
};

export { VerPqrs };