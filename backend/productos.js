const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a la nueva base de datos de inventario
const db = new sqlite3.Database('./inventario.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Conectado a la base de datos de Inventario (SQLite)');
});

// 2. Crear tabla de productos con los campos de la imagen
db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    precio REAL,
    stock INTEGER
)`);

// ----- CRUD DE PRODUCTOS -----

// CREATE: Guardar un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.run(
        'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
        [nombre, precio, stock],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.status(201).json({ id: this.lastID, message: 'Producto guardado con éxito' });
        }
    );
});

// READ: Obtener todos los productos para la tabla
app.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// UPDATE: Editar un producto existente
app.put('/productos/:id', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.run(
        'UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?',
        [nombre, precio, stock, req.params.id],
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.send('Producto actualizado correctamente');
        }
    );
});

// DELETE: Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    db.run('DELETE FROM productos WHERE id=?', [req.params.id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.send('Producto eliminado');
    });
});

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Inventario corriendo en http://localhost:${PORT}`);
});