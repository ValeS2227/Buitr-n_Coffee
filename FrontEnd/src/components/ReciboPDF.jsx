import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registrar fuentes (opcional, para mejor apariencia)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf' },
    { fontWeight: 'bold', src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica-Bold.ttf' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '1px solid #E0E0E0',
    paddingBottom: 20
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10
  },
  empresaInfo: {
    textAlign: 'right'
  },
  empresaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C49A6C',
    marginBottom: 5
  },
  empresaDetalle: {
    fontSize: 10,
    color: '#666666'
  },
  tituloRecibo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333'
  },
  infoCliente: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 5
  },
  infoClienteTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#C49A6C'
  },
  infoClienteTexto: {
    fontSize: 10,
    marginBottom: 5,
    color: '#333333'
  },
  tabla: {
    marginBottom: 30
  },
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderBottom: '1px solid #E0E0E0'
  },
  tablaHeaderTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666666'
  },
  tablaFila: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #F0F0F0'
  },
  tablaFilaTexto: {
    fontSize: 9,
    color: '#333333'
  },
  columnaProducto: { width: '40%' },
  columnaCantidad: { width: '15%', textAlign: 'center' },
  columnaPrecioUnitario: { width: '20%', textAlign: 'right' },
  columnaSubtotal: { width: '25%', textAlign: 'right' },
  resumen: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 5
  },
  lineaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  lineaResumenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2px solid #C49A6C',
    fontWeight: 'bold'
  },
  textoResumen: {
    fontSize: 10
  },
  textoResumenTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C49A6C'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1px solid #E0E0E0',
    paddingTop: 15,
    fontSize: 8,
    color: '#999999'
  },
  agradecimiento: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 10,
    color: '#C49A6C',
    fontStyle: 'italic'
  }
});

const ReciboPDF = ({ compra, usuario, fecha, numeroRecibo }) => {
  const subtotal = compra.total;
  const envio = subtotal >= 50000 ? 0 : 5000;
  const total = subtotal + envio;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo y empresa */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              src="http://localhost:3001/imagenes/logob.png"
            />
            <View>
              <Text style={styles.empresaNombre}>Buitrón Coffee</Text>
              <Text style={styles.empresaDetalle}>Café de especialidad</Text>
            </View>
          </View>
          <View style={styles.empresaInfo}>
            <Text style={styles.empresaDetalle}>NIT: 901.234.567-8</Text>
            <Text style={styles.empresaDetalle}>Tel: (601) 123 4567</Text>
            <Text style={styles.empresaDetalle}>Calle 123 # 45-67</Text>
            <Text style={styles.empresaDetalle}>Bogotá, Colombia</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.tituloRecibo}>RECIBO DE TU PEDIDO</Text>

        {/* Información del cliente */}
        <View style={styles.infoCliente}>
          <Text style={styles.infoClienteTitulo}>DATOS DEL CLIENTE</Text>
          <Text style={styles.infoClienteTexto}>Nombre: {usuario.Nombre_usuario} {usuario.Apellido}</Text>
          <Text style={styles.infoClienteTexto}>Documento: {usuario.Documento || 'No especificado'}</Text>
          <Text style={styles.infoClienteTexto}>Teléfono: {usuario.Telefono || 'No especificado'}</Text>
          <Text style={styles.infoClienteTexto}>Correo: {usuario.Correo}</Text>
        </View>

        {/* Datos del recibo */}
        <View style={styles.infoCliente}>
          <Text style={styles.infoClienteTexto}>Recibo N°: {numeroRecibo}</Text>
          <Text style={styles.infoClienteTexto}>Fecha: {fecha}</Text>
        </View>

        {/* Tabla de productos */}
        <View style={styles.tabla}>
          <View style={styles.tablaHeader}>
            <Text style={[styles.tablaHeaderTexto, styles.columnaProducto]}>DESCRIPCIÓN</Text>
            <Text style={[styles.tablaHeaderTexto, styles.columnaCantidad]}>CANTIDAD</Text>
            <Text style={[styles.tablaHeaderTexto, styles.columnaPrecioUnitario]}>PRECIO UNIT.</Text>
            <Text style={[styles.tablaHeaderTexto, styles.columnaSubtotal]}>SUBTOTAL</Text>
          </View>

          {compra.items.map((item, index) => (
            <View style={styles.tablaFila} key={index}>
              <Text style={[styles.tablaFilaTexto, styles.columnaProducto]}>
                {item.Nombre_producto}
              </Text>
              <Text style={[styles.tablaFilaTexto, styles.columnaCantidad]}>
                {item.Cantidad}
              </Text>
              <Text style={[styles.tablaFilaTexto, styles.columnaPrecioUnitario]}>
                ${item.Precio.toLocaleString()}
              </Text>
              <Text style={[styles.tablaFilaTexto, styles.columnaSubtotal]}>
                ${(item.Precio * item.Cantidad).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Resumen de la compra */}
        <View style={styles.resumen}>
          <View style={styles.lineaResumen}>
            <Text style={styles.textoResumen}>Subtotal:</Text>
            <Text style={styles.textoResumen}>${subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.lineaResumen}>
            <Text style={styles.textoResumen}>Envío:</Text>
            <Text style={styles.textoResumen}>
              {envio === 0 ? 'GRATIS' : `$${envio.toLocaleString()}`}
            </Text>
          </View>
          <View style={styles.lineaResumenTotal}>
            <Text style={styles.textoResumenTotal}>TOTAL:</Text>
            <Text style={styles.textoResumenTotal}>${total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Agradecimiento */}
        <Text style={styles.agradecimiento}>
          ¡Gracias por tu pedido! Te recordamos ir a nuestro punto de venta para obtener tus productos
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Buitrón Coffee - Calidad y tradición en cada taza</Text>
          <Text>© 2026 Buitrón Coffee - Todos los derechos reservados</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReciboPDF;