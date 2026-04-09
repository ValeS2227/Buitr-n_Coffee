import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: 2,
    borderBottomColor: '#c0392b',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c0392b'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 100,
    fontSize: 10,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 10,
    flex: 1
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    marginTop: 10,
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 9
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  total: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999'
  }
});

const ReciboPDF = ({ compra, usuario, fecha, numeroRecibo }) => {
  // Asegurar que los datos existen
  const items = compra?.items || [];
  const subtotal = compra?.subtotal || 0;
  const envio = compra?.envio || 0;
  const total = compra?.total || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Buitrón Coffee</Text>
          <Text style={styles.subtitle}>Recibo de Compra</Text>
          <Text style={styles.subtitle}>N° {numeroRecibo}</Text>
          <Text style={styles.subtitle}>Fecha: {fecha}</Text>
        </View>

        {/* Información del cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{usuario?.Nombre_usuario || ''} {usuario?.Apellido || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento:</Text>
            <Text style={styles.value}>{usuario?.Documento || 'No especificado'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{usuario?.Telefono || 'No especificado'}</Text>
          </View>
        </View>

        {/* Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Producto</Text>
            <Text style={styles.col2}>Precio</Text>
            <Text style={styles.col3}>Cantidad</Text>
            <Text style={styles.col4}>Subtotal</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.Nombre_producto}</Text>
              <Text style={styles.col2}>${item.PrecioUnitario?.toLocaleString() || 0}</Text>
              <Text style={styles.col3}>{item.Cantidad}</Text>
              <Text style={styles.col4}>${(item.Cantidad * (item.PrecioUnitario || 0)).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.label, { width: '80%', textAlign: 'right' }]}>Subtotal:</Text>
            <Text style={[styles.value, { textAlign: 'right' }]}>${subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { width: '80%', textAlign: 'right' }]}>Envío:</Text>
            <Text style={[styles.value, { textAlign: 'right' }]}>
              {envio === 0 ? 'Gratis' : `$${envio.toLocaleString()}`}
            </Text>
          </View>
          <View style={styles.total}>
            <Text style={styles.totalText}>Total: ${total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>¡Gracias por tu compra! Visítanos nuevamente en Buitrón Coffee</Text>
          <Text>Si tienes alguna duda, contáctanos: atencion@buitroncoffee.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReciboPDF;