app.post('/api/login', (req, res) => {
  const { correo, clave } = req.body;

  // Primero verificar si el usuario existe
  db.query(
    'SELECT ID_Usuario, Nombre_usuario, Apellido, ID_Rol FROM usuario WHERE Correo = ? AND Clave = ?',
    [correo, clave],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
      }

      // Verificar si tiene rol de admin
      if (results[0].ID_Rol !== 1) {
        return res.status(403).json({ mensaje: 'No tienes permisos para acceder' });
      }

      res.json({ mensaje: 'Login exitoso', usuario: results[0] });
    }
  );
});