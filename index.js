const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Base de Datos SQLite
const db = new sqlite3.Database('./inventario.db', (err) => {
    if (err) console.error("Error al abrir base de datos:", err);
    else {
        console.log("Conectado a SQLite");
        // Crear tabla si no existe
        db.run(`CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            precio REAL,
            stock INTEGER
        )`);
    }
});

//RUTAS DE LA API

// Obtener 
app.get('/productos', (req, res) => {
    db.all("SELECT * FROM productos", [], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// Agregar o
app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    const query = `INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)`;
    db.run(query, [nombre, precio, stock], function(err) {
        if (err) return res.status(500).send(err);
        res.json({ id: this.lastID, nombre, precio, stock });
    });
});

// Eliminar
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM productos WHERE id = ?`, id, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: "Producto eliminado" });
    });
});

// Editar 
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    const query = `UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?`;
    db.run(query, [nombre, precio, stock, id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: "Producto actualizado" });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});