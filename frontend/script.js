const API_URL = 'http://localhost:3000';
let productoEnEdicion = null;

// Elementos del DOM
const formulario = document.getElementById('formulario-producto');
const inputNombre = document.getElementById('nombre-producto');
const inputPrecio = document.getElementById('precio-producto');
const inputStock = document.getElementById('stock-producto');
const btnGuardar = document.getElementById('btn-guardar');
const tablaProductos = document.getElementById('tabla-productos');

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', cargarProductos);

// Evento del formulario
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);
    
    // Validar datos
    if (!nombre || isNaN(precio) || isNaN(stock)) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }
    
    if (productoEnEdicion) {
        // Actualizar producto
        await actualizarProducto(productoEnEdicion.id, nombre, precio, stock);
    } else {
        // Crear nuevo producto
        await crearProducto(nombre, precio, stock);
    }
    
    formulario.reset();
    productoEnEdicion = null;
    btnGuardar.innerHTML = '<div class="icon-save"></div><span>Guardar Producto</span>';
});

// Cargar productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los productos');
    }
}

// Mostrar productos en la tabla
function mostrarProductos(productos) {
    tablaProductos.innerHTML = '';
    
    if (productos.length === 0) {
        tablaProductos.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No hay productos registrados</td></tr>';
        return;
    }
    
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>S/. ${producto.precio.toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn-action btn-editar" onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">
                    <div class="icon-action"></div>Editar
                </button>
                <button class="btn-action btn-eliminar" onclick="eliminarProducto(${producto.id})">
                    <div class="icon-action"></div>Eliminar
                </button>
            </td>
        `;
        tablaProductos.appendChild(fila);
    });
}

// Crear producto
async function crearProducto(nombre, precio, stock) {
    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, precio, stock })
        });
        
        if (!response.ok) throw new Error('Error al crear producto');
        
        alert('Producto creado exitosamente');
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el producto');
    }
}

// Editar producto
function editarProducto(id, nombre, precio, stock) {
    productoEnEdicion = { id, nombre, precio, stock };
    
    inputNombre.value = nombre;
    inputPrecio.value = precio;
    inputStock.value = stock;
    
    btnGuardar.innerHTML = '<div class="icon-save"></div><span>Actualizar Producto</span>';
    
    // Desplazar al formulario
    document.querySelector('section').scrollIntoView({ behavior: 'smooth' });
}

// Actualizar producto
async function actualizarProducto(id, nombre, precio, stock) {
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, precio, stock })
        });
        
        if (!response.ok) throw new Error('Error al actualizar producto');
        
        alert('Producto actualizado exitosamente');
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el producto');
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar producto');
        
        alert('Producto eliminado exitosamente');
        cargarProductos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    }
}
