// aca pos cree una mini base de datos barata nomas pa poner los productos q tienen en el catalogo (pueden agregar mas o editar los q ya estan a su gusto ekis de, nomas pongan la coma)
const productosDB = {
  1: {
    id: 1,
    nombre: "Café Molido",
    imagen: "img/cafe1.jpeg",
    estado: "ACTIVO",
    tostado: "Medio",
    precio: "Desde $ 60.000",
    calificacion: 5,
    reseñas: [
      {
        autor: "Santiago",
        fecha: "21/09/2025",
        texto: "Ta bueno el café, hagan más porfa, lo único malo es q la empresa se ubica en menor monte, pero por ese café vale la pena KSDAJADJ!"
      },
      {
        autor: "CrashhSus",
        fecha: "19/09/2025",
        texto: "No puedo definir con palabras lo buena que es el café, pero le doy baja calificación ya que... no sé, nomás quiero hacerlo w"
      },
      {
        autor: "UnRandom",
        fecha: "15/09/2025",
        texto: "Es el mejor café q probé en la fokin lalí, ¿Si compró café al por mayor me dan un descuento?"
      }
    ]
  },


  2: {
    id: 2,
    nombre: "Grano",
    imagen: "img/cafe2.jpeg",
    estado: "ACTIVO",
    tostado: "Oscuro",
    precio: "Desde $ 65.000",
    calificacion: 4.5,
    reseñas: [
      {
        autor: "Carlos",
        fecha: "20/09/2025",
        texto: "Excelente grano, muy aromático. Perfecto para espresso."
      },
      {
        autor: "María",
        fecha: "18/09/2025",
        texto: "Buena relación calidad-precio, lo recomiendo"
      }
    ]
  },


  3: {
    id: 3,
    nombre: "Grano Especial",
    imagen: "img/cafe3.jpeg",
    estado: "AGOTADO",
    tostado: "Claro",
    precio: "Desde $ 70.000",
    calificacion: 5,
    reseñas: [
      {
        autor: "Juan",
        fecha: "22/09/2025",
        texto: "Café de especialidad, notas frutales increíbles"
      },
      {
        autor: "Ana",
        fecha: "17/09/2025",
        texto: "Vale cada peso, mejor café que he probado"
      },
      {
        autor: "Pedro",
        fecha: "10/09/2025",
        texto: "El aroma es espectacular, compraré más"
      }
    ]
  }


};