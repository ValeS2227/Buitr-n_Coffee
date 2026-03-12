// mini base de datos de productos

const productosDB = {
  1: {
    id: 1,
    nombre: "Café Molido",
    imagen: "/img/cafe1.jpeg",
    estado: "ACTIVO",
    tostado: "Medio",
    precio: "Desde $ 60.000",
    calificacion: 5,
    reseñas: [
      {
        autor: "Santiago",
        fecha: "21/09/2025",
        texto: "Ta bueno el café, hagan más porfa"
      },
      {
        autor: "CrashhSus",
        fecha: "19/09/2025",
        texto: "Muy buen café, recomendado"
      },
      {
        autor: "UnRandom",
        fecha: "15/09/2025",
        texto: "El mejor café que probé"
      }
    ]
  },

  2: {
    id: 2,
    nombre: "Grano",
    imagen: "/img/cafe2.jpeg",
    estado: "ACTIVO",
    tostado: "Oscuro",
    precio: "Desde $ 65.000",
    calificacion: 4.5,
    reseñas: [
      {
        autor: "Carlos",
        fecha: "20/09/2025",
        texto: "Excelente grano, muy aromático"
      },
      {
        autor: "María",
        fecha: "18/09/2025",
        texto: "Buena relación calidad-precio"
      }
    ]
  },

  3: {
    id: 3,
    nombre: "Grano Especial",
    imagen: "/img/cafe3.jpeg",
    estado: "AGOTADO",
    tostado: "Claro",
    precio: "Desde $ 70.000",
    calificacion: 5,
    reseñas: [
      {
        autor: "Juan",
        fecha: "22/09/2025",
        texto: "Café de especialidad increíble"
      },
      {
        autor: "Ana",
        fecha: "17/09/2025",
        texto: "Vale cada peso"
      },
      {
        autor: "Pedro",
        fecha: "10/09/2025",
        texto: "El aroma es espectacular"
      }
    ]
  }
};

export { productosDB };