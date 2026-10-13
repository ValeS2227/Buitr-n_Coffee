const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Buitrón Coffee',
      version: '1.0.0',
      description: `
        Documentación de la API interna para el sistema de gestión de productos y ventas de Buitrón Coffee.

        ## Autenticación
        Esta API utiliza JWT (JSON Web Token) para autenticación.
        Para acceder a los endpoints protegidos, debes incluir el token en el header Authorization.
      `,
      contact: {
        name: 'Equipo Buitrón Coffee',
        email: 'buitroncoffee@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de desarrollo (localhost)'
      }
    ],
    tags: [
      { name: 'Autenticación', description: 'Endpoints de login, registro y gestión de usuarios' },
      { name: 'Usuarios', description: 'Gestión de usuarios (solo administradores)' },
      { name: 'Productos', description: 'Gestión y consulta de productos' },
      { name: 'Carrito', description: 'Gestión del carrito de compras' },
      { name: 'Pedidos', description: 'Gestión de pedidos' },
      { name: 'PQRS', description: 'Peticiones, Quejas, Reclamos y Sugerencias' },
      { name: 'Reseñas', description: 'Calificaciones y reseñas de productos' },
      { name: 'Estadísticas', description: 'Estadísticas del negocio (solo administradores)' },
      { name: 'Promociones', description: 'Gestión de promociones y cupones de descuento' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT con el prefijo "Bearer "'
        }
      },
      schemas: {
        // ============ USUARIO ============
        Usuario: {
          type: 'object',
          properties: {
            ID_Usuario: { type: 'integer', example: 1 },
            Nombre_usuario: { type: 'string', example: 'Admin' },
            Apellido: { type: 'string', example: 'Sistema' },
            Correo: { type: 'string', example: 'admin@buitron.com' },
            Documento: { type: 'string', example: '123456789' },
            Telefono: { type: 'string', example: '3001234567' },
            ID_Rol: { type: 'integer', enum: [1, 2, 3], example: 1 },
            Estado: { type: 'integer', enum: [0, 1], example: 1 }
          }
        },
        UsuarioRegistro: {
          type: 'object',
          required: ['Nombre_usuario', 'Apellido', 'Correo', 'Clave'],
          properties: {
            Nombre_usuario: { type: 'string', example: 'Juan' },
            Apellido: { type: 'string', example: 'Perez' },
            Correo: { type: 'string', example: 'juan@mail.com' },
            Documento: { type: 'string', example: '123456789' },
            Telefono: { type: 'string', example: '3001234567' },
            Clave: { type: 'string', example: '123456' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['Correo', 'Clave'],
          properties: {
            Correo: { type: 'string', example: 'admin@buitron.com' },
            Clave: { type: 'string', example: 'admin123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login exitoso' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            usuario: { $ref: '#/components/schemas/Usuario' }
          }
        },
        // ============ PRODUCTO ============
        Producto: {
          type: 'object',
          properties: {
            ID_Producto: { type: 'integer', example: 1 },
            Nombre_producto: { type: 'string', example: 'Café Tostado' },
            Descripcion: { type: 'string', example: 'Café de alta calidad' },
            Categoria: { type: 'string', enum: ['Tostado', 'Fino', 'Molido', 'Grano', 'Especial'], example: 'Tostado' },
            Precio: { type: 'number', format: 'float', example: 12000 },
            Stock: { type: 'integer', example: 50 },
            imagen: { type: 'string', example: 'cafe1.jpeg' },
            Estado: { type: 'integer', enum: [0, 1], example: 1 },
            calificacion_promedio: { type: 'number', format: 'float', example: 4.5 },
            total_resenas: { type: 'integer', example: 10 }
          }
        },
        ProductoCreacion: {
          type: 'object',
          required: ['Nombre_producto', 'Categoria', 'Precio', 'Stock'],
          properties: {
            Nombre_producto: { type: 'string', example: 'Café Geisha' },
            Descripcion: { type: 'string', example: 'Café de especialidad' },
            Categoria: { type: 'string', enum: ['Tostado', 'Fino', 'Molido', 'Grano', 'Especial'], example: 'Molido' },
            Precio: { type: 'number', format: 'float', example: 25000 },
            Stock: { type: 'integer', example: 50 },
            imagen: { type: 'string', example: 'cafe_geisha.jpg' },
            ID_Proveedor: { type: 'integer', example: 5 }
          }
        },
        // ============ PEDIDO ============
        Pedido: {
          type: 'object',
          properties: {
            ID_Pedido: { type: 'integer', example: 1 },
            ID_Usuario: { type: 'integer', example: 8 },
            Fecha: { type: 'string', format: 'date-time' },
            Subtotal: { type: 'number', format: 'float', example: 125000 },
            Total: { type: 'number', format: 'float', example: 125000 },
            Estado: { type: 'string', enum: ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'], example: 'Pendiente' },
            Fecha_Limite: { type: 'string', format: 'date-time', nullable: true },
            Pagado: { type: 'integer', enum: [0, 1], example: 0 }
          }
        },
        PedidoCreacion: {
          type: 'object',
          required: ['items', 'subtotal', 'total'],
          properties: {
            ID_Usuario: { type: 'integer', example: 8 },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ID_Producto: { type: 'integer', example: 1 },
                  Cantidad: { type: 'integer', example: 2 },
                  PrecioUnitario: { type: 'number', format: 'float', example: 12000 }
                }
              }
            },
            subtotal: { type: 'number', format: 'float', example: 50000 },
            total: { type: 'number', format: 'float', example: 50000 }
          }
        },
        // ============ CARRITO ============
        CarritoItem: {
          type: 'object',
          properties: {
            ID_Carrito: { type: 'integer' },
            ID_Producto: { type: 'integer' },
            Nombre_producto: { type: 'string' },
            Precio: { type: 'number', format: 'float' },
            Cantidad: { type: 'integer' },
            imagen: { type: 'string' },
            subtotal: { type: 'number', format: 'float' }
          }
        },
        Carrito: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                items: { type: 'array', items: { $ref: '#/components/schemas/CarritoItem' } },
                total: { type: 'number', format: 'float' },
                totalItems: { type: 'integer' }
              }
            }
          }
        },
        CarritoAgregar: {
          type: 'object',
          required: ['productoId'],
          properties: {
            productoId: { type: 'integer', example: 1 },
            cantidad: { type: 'integer', example: 2 }
          }
        },
        CarritoActualizar: {
          type: 'object',
          required: ['cantidad'],
          properties: {
            cantidad: { type: 'integer', example: 3 }
          }
        },
        // ============ PQRS ============
        PQRS: {
          type: 'object',
          properties: {
            ID_PQRS: { type: 'integer' },
            Codigo_Referencia: { type: 'string', example: 'PQRS-20260402-095021' },
            Tipo: { type: 'string', enum: ['pregunta', 'queja', 'reclamo', 'sugerencia', 'felicitacion'], example: 'queja' },
            Estado: { type: 'string', enum: ['pendiente', 'en_proceso', 'resuelta', 'cerrada'], example: 'pendiente' },
            Descripcion: { type: 'string', example: 'Descripción de la PQRS' },
            Respuesta: { type: 'string', nullable: true },
            Fecha_Creacion: { type: 'string', format: 'date-time' }
          }
        },
        PQRSCreacion: {
          type: 'object',
          required: ['nombre', 'email', 'tipo', 'descripcion'],
          properties: {
            nombre: { type: 'string', example: 'Juan Perez' },
            email: { type: 'string', example: 'juan@mail.com' },
            telefono: { type: 'string', example: '3001234567' },
            tipo: { type: 'string', enum: ['pregunta', 'queja', 'reclamo', 'sugerencia', 'felicitacion'], example: 'queja' },
            descripcion: { type: 'string', example: 'Descripción detallada' },
            codigo_referencia: { type: 'string', example: 'PQRS-20260402-095021' },
            id_usuario: { type: 'integer', example: 8 }
          }
        },
        // ============ RESEÑA ============
        Resena: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            producto_id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            nombre_usuario: { type: 'string' },
            calificacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comentario: { type: 'string', example: 'Excelente producto' },
            estado: { type: 'string', enum: ['pendiente', 'aprobada', 'rechazada'], example: 'pendiente' },
            fecha: { type: 'string', format: 'date-time' }
          }
        },
        ResenaCreacion: {
          type: 'object',
          required: ['producto_id', 'calificacion', 'comentario'],
          properties: {
            producto_id: { type: 'integer', example: 1 },
            calificacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comentario: { type: 'string', example: 'Excelente producto' }
          }
        },
        // ============ ESTADÍSTICAS ============
        ResumenProductos: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                productos_mas_vendidos: { type: 'array', items: { $ref: '#/components/schemas/Producto' } },
                productos_stock_bajo: { type: 'array', items: { $ref: '#/components/schemas/Producto' } },
                total_mas_vendidos: { type: 'integer' },
                total_stock_bajo: { type: 'integer' }
              }
            }
          }
        },
        // ============ PROMOCIONES ============
        Promocion: {
          type: 'object',
          properties: {
            ID_Promocion: { type: 'integer', example: 1 },
            Nombre: { type: 'string', example: 'Descuento 20% en Café Tostado' },
            Descripcion: { type: 'string', example: 'Aprovecha el 20% de descuento en nuestro Café Tostado' },
            Tipo: { type: 'string', enum: ['descuento_porcentaje', 'descuento_fijo', '2x1', 'puntos_dobles', 'combo'], example: 'descuento_porcentaje' },
            Valor: { type: 'number', example: 20 },
            Codigo: { type: 'string', example: 'CAFETOSTADO' },
            ID_Producto: { type: 'integer', nullable: true, example: 1 },
            Producto_Nombre: { type: 'string', nullable: true, example: 'Café Tostado' },
            Minimo_Compra: { type: 'number', nullable: true, example: 30000 },
            Fecha_Inicio: { type: 'string', format: 'date-time' },
            Fecha_Fin: { type: 'string', format: 'date-time' },
            Stock_Limite: { type: 'integer', nullable: true, example: 100 },
            Usos_Actuales: { type: 'integer', example: 0 },
            Estado: { type: 'integer', enum: [0, 1], example: 1 },
            Fecha_Creacion: { type: 'string', format: 'date-time' }
          }
        },
        PromocionCreacion: {
          type: 'object',
          required: ['Nombre', 'Tipo', 'Fecha_Inicio', 'Fecha_Fin'],
          properties: {
            Nombre: { type: 'string', example: 'Descuento 20% en Café Tostado' },
            Descripcion: { type: 'string', example: 'Aprovecha el 20% de descuento' },
            Tipo: { type: 'string', enum: ['descuento_porcentaje', 'descuento_fijo', '2x1', 'puntos_dobles', 'combo'], example: 'descuento_porcentaje' },
            Valor: { type: 'number', example: 20 },
            Codigo: { type: 'string', example: 'CAFETOSTADO' },
            ID_Producto: { type: 'integer', nullable: true, example: 1 },
            Minimo_Compra: { type: 'number', nullable: true, example: 30000 },
            Fecha_Inicio: { type: 'string', format: 'date-time' },
            Fecha_Fin: { type: 'string', format: 'date-time' },
            Stock_Limite: { type: 'integer', nullable: true, example: 100 }
          }
        },
        PromocionAplicar: {
          type: 'object',
          required: ['codigo', 'subtotal', 'items'],
          properties: {
            codigo: { type: 'string', example: 'CAFETOSTADO' },
            subtotal: { type: 'number', example: 50000 },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ID_Producto: { type: 'integer', example: 1 },
                  Nombre_producto: { type: 'string', example: 'Café Tostado' },
                  Cantidad: { type: 'integer', example: 2 },
                  PrecioUnitario: { type: 'number', example: 12000 }
                }
              }
            }
          }
        },
        // ============ RESPUESTAS ============
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error al procesar la solicitud' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operación exitosa' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      // =============================================
      // 🛒 CARRITO - ENDPOINTS
      // =============================================
      '/carrito': {
        get: {
          summary: 'Obtener carrito del usuario autenticado',
          description: 'Retorna todos los productos en el carrito del usuario con subtotales y totales',
          tags: ['Carrito'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Carrito obtenido exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          items: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                ID_Carrito: { type: 'integer', example: 1 },
                                Cantidad: { type: 'integer', example: 2 },
                                ID_Producto: { type: 'integer', example: 1 },
                                Nombre_producto: { type: 'string', example: 'Café Tostado' },
                                Precio: { type: 'number', example: 12000 },
                                imagen: { type: 'string', example: 'cafe1.jpeg' },
                                Descripcion: { type: 'string', example: 'Café de alta calidad' },
                                Stock: { type: 'integer', example: 50 },
                                subtotal: { type: 'number', example: 24000 }
                              }
                            }
                          },
                          total: { type: 'number', example: 45000 },
                          totalItems: { type: 'integer', example: 3 }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Token requerido' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Agregar producto al carrito',
          description: 'Agrega un producto al carrito del usuario. Si ya existe, aumenta la cantidad. Verifica stock disponible.',
          tags: ['Carrito'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productoId'],
                  properties: {
                    productoId: { type: 'integer', example: 1 },
                    cantidad: { type: 'integer', example: 2 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Producto agregado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Producto agregado al carrito' },
                      data: {
                        type: 'object',
                        properties: {
                          idCarrito: { type: 'integer', example: 5 }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Datos inválidos o sin stock',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Stock insuficiente. Disponible: 5' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            }
          }
        }
      },
      '/carrito/{itemId}': {
        put: {
          summary: 'Actualizar cantidad de un producto en el carrito',
          description: 'Cambia la cantidad de un producto específico en el carrito. Verifica stock disponible.',
          tags: ['Carrito'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'itemId',
              required: true,
              schema: { type: 'integer' },
              description: 'ID del carrito (ID_Carrito)',
              example: 1
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['cantidad'],
                  properties: {
                    cantidad: { type: 'integer', example: 3 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Cantidad actualizada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Cantidad actualizada' },
                      data: {
                        type: 'object',
                        properties: {
                          cantidad: { type: 'integer', example: 3 }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Cantidad inválida o sin stock',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Stock insuficiente. Disponible: 5' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            404: {
              description: 'Producto no encontrado en el carrito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Producto no encontrado en el carrito' }
                    }
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: 'Eliminar producto del carrito',
          description: 'Elimina un producto específico del carrito del usuario',
          tags: ['Carrito'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'itemId',
              required: true,
              schema: { type: 'integer' },
              description: 'ID del carrito (ID_Carrito)',
              example: 1
            }
          ],
          responses: {
            200: {
              description: 'Producto eliminado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Producto eliminado del carrito' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            404: {
              description: 'Producto no encontrado en el carrito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Producto no encontrado en el carrito' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/carrito/vaciar': {
        delete: {
          summary: 'Vaciar carrito completo',
          description: 'Elimina todos los productos del carrito del usuario autenticado',
          tags: ['Carrito'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Carrito vaciado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Carrito vaciado exitosamente' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'El carrito ya está vacío',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'El carrito ya está vacío' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            }
          }
        }
      },

      // =============================================
      // 📊 ESTADÍSTICAS - ENDPOINTS
      // =============================================
      '/estadisticas/estado-pedidos': {
        get: {
          summary: 'Obtener estado de pedidos (Dashboard)',
          description: 'Retorna estadísticas de pedidos: totales, entregados, pendientes, cancelados, ingresos y ticket promedio. Solo accesible para administradores.',
          tags: ['Estadísticas'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Estadísticas de pedidos obtenidas exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          totales: {
                            type: 'object',
                            properties: {
                              total_pedidos: { type: 'integer', example: 450 },
                              entregados: { type: 'integer', example: 380 },
                              pendientes: { type: 'integer', example: 45 },
                              cancelados: { type: 'integer', example: 25 },
                              ingresos_totales: { type: 'number', example: 1250000 },
                              ticket_promedio: { type: 'number', example: 3289 }
                            }
                          },
                          resumen_por_estado: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                Estado: { type: 'string', example: 'Entregado' },
                                total_pedidos: { type: 'integer', example: 380 },
                                ingresos_totales: { type: 'number', example: 1250000 },
                                pagados: { type: 'integer', example: 350 }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Token requerido' }
                    }
                  }
                }
              }
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Acceso denegado. Solo administradores.' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/estadisticas/resumen-productos': {
        get: {
          summary: 'Obtener resumen de productos (Dashboard)',
          description: 'Retorna los productos más vendidos y los productos con stock bajo. Solo accesible para administradores.',
          tags: ['Estadísticas'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Resumen de productos obtenido exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          productos_mas_vendidos: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                ID_Producto: { type: 'integer', example: 1 },
                                Nombre_producto: { type: 'string', example: 'Café Tostado' },
                                Precio: { type: 'number', example: 12000 },
                                imagen: { type: 'string', example: 'cafe1.jpeg' },
                                TotalVendido: { type: 'integer', example: 150 }
                              }
                            }
                          },
                          productos_stock_bajo: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                ID_Producto: { type: 'integer', example: 5 },
                                Nombre_producto: { type: 'string', example: 'Café Geisha' },
                                Stock: { type: 'integer', example: 3 },
                                Precio: { type: 'number', example: 25000 },
                                imagen: { type: 'string', example: 'cafe_geisha.jpg' },
                                nivel_stock: { type: 'string', example: 'Muy bajo' }
                              }
                            }
                          },
                          total_mas_vendidos: { type: 'integer', example: 10 },
                          total_stock_bajo: { type: 'integer', example: 8 }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador'
            }
          }
        }
      },
      '/estadisticas/alerta-stock': {
        post: {
          summary: 'Obtener alertas de stock bajo',
          description: 'Retorna una lista de productos con stock bajo (≤ 10 unidades) con sus niveles de alerta. Solo accesible para administradores.',
          tags: ['Estadísticas'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Alertas de stock obtenidas exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      alertas: {
                        type: 'array',
                        items: {
                          type: 'string',
                          example: 'Café Geisha - Stock: 3 (Muy bajo)'
                        }
                      },
                      productos: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            ID_Producto: { type: 'integer', example: 5 },
                            Nombre_producto: { type: 'string', example: 'Café Geisha' },
                            Stock: { type: 'integer', example: 3 },
                            nivel_stock: { type: 'string', example: 'Muy bajo' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador'
            }
          }
        }
      },

      // =============================================
      // 🎯 PROMOCIONES - ENDPOINTS
      // =============================================
      '/promociones/activas': {
        get: {
          summary: 'Obtener promociones activas',
          description: 'Retorna todas las promociones activas disponibles para los clientes. No requiere autenticación.',
          tags: ['Promociones'],
          responses: {
            200: {
              description: 'Lista de promociones activas',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Promocion'
                        }
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: 'Error al obtener promociones',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/promociones/codigo/{codigo}': {
        get: {
          summary: 'Verificar código promocional',
          description: 'Verifica si un código promocional es válido y devuelve los detalles de la promoción asociada.',
          tags: ['Promociones'],
          parameters: [
            {
              in: 'path',
              name: 'codigo',
              required: true,
              schema: { type: 'string' },
              description: 'Código promocional a verificar',
              example: 'CAFETOSTADO'
            }
          ],
          responses: {
            200: {
              description: 'Código válido',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        $ref: '#/components/schemas/Promocion'
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Código inválido o promoción expirada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Código inválido o promoción expirada' }
                    }
                  }
                }
              }
            },
            500: {
              description: 'Error al verificar código',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/promociones/aplicar': {
        post: {
          summary: 'Aplicar promoción al carrito',
          description: 'Aplica un código promocional al carrito de compras y calcula el descuento correspondiente. Requiere autenticación.',
          tags: ['Promociones'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PromocionAplicar'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Promoción aplicada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          descuento: { type: 'number', example: 10000 },
                          total: { type: 'number', example: 40000 },
                          mensaje: { type: 'string', example: '✅ Descuento del 20% aplicado a "Café Tostado"' },
                          promocion: {
                            type: 'object',
                            properties: {
                              ID_Promocion: { type: 'integer', example: 1 },
                              Nombre: { type: 'string', example: 'Descuento 20% en Café Tostado' },
                              Tipo: { type: 'string', example: 'descuento_porcentaje' },
                              Codigo: { type: 'string', example: 'CAFETOSTADO' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Error al aplicar promoción',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'El pedido debe ser mayor a $30.000 para aplicar esta promoción' }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Código inválido o expirado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Código inválido o promoción expirada' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Token requerido' }
                    }
                  }
                }
              }
            },
            500: {
              description: 'Error al aplicar promoción',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/promociones/admin/todas': {
        get: {
          summary: 'Obtener todas las promociones (Admin)',
          description: 'Retorna todas las promociones del sistema incluyendo inactivas y expiradas. Solo accesible para administradores.',
          tags: ['Promociones'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista completa de promociones',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Promocion'
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador'
            },
            500: {
              description: 'Error al obtener promociones'
            }
          }
        }
      },
      '/promociones/admin/crear': {
        post: {
          summary: 'Crear promoción (Admin)',
          description: 'Crea una nueva promoción en el sistema. Solo accesible para administradores.',
          tags: ['Promociones'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PromocionCreacion'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Promoción creada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Promoción creada correctamente' },
                      ID_Promocion: { type: 'integer', example: 1 }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Datos inválidos o código duplicado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'El código de promoción ya existe' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador'
            },
            500: {
              description: 'Error al crear promoción'
            }
          }
        }
      },
      '/promociones/admin/actualizar/{id}': {
        put: {
          summary: 'Actualizar promoción (Admin)',
          description: 'Actualiza una promoción existente. Solo accesible para administradores.',
          tags: ['Promociones'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la promoción a actualizar',
              example: 1
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PromocionCreacion'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Promoción actualizada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Promoción actualizada correctamente' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Datos inválidos o código duplicado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'El código de promoción ya existe' }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Promoción no encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Promoción no encontrada' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador'
            },
            500: {
              description: 'Error al actualizar promoción'
            }
          }
        }
      },
      '/promociones/admin/eliminar/{id}': {
        delete: {
          summary: 'Eliminar promoción (Admin)',
          description: 'Elimina una promoción del sistema. Solo accesible para administradores.',
          tags: ['Promociones'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'ID de la promoción a eliminar',
              example: 1
            }
          ],
          responses: {
            200: {
              description: 'Promoción eliminada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Promoción eliminada correctamente' }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Promoción no encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      message: { type: 'string', example: 'Promoción no encontrada' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'No autenticado'
            },
            403: {
              description: 'No autorizado - Se requiere rol de administrador'
            },
            500: {
              description: 'Error al eliminar promoción'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);