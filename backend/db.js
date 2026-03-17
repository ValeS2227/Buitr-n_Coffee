const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'buitroncoffee'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

module.exports = db;