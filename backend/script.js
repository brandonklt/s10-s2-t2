const URL_API = 'http://localhost:3000/productos';
const tabla = document.getElementById('tabla-productos');
const formulario = document.getElementById('formulario-producto');

// --- FUNCIÓN PARA OBTENER Y MOSTRAR PRODUCTOS ---
async function cargarProductos() {
    const res = await fetch(URL_API);
    const productos = await res.json();
    
    tabla.innerHTML = ''; // Limpiar tabla
    productos.forEach(p => {
        tabla.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-action btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// --- FUNCIÓN PARA GUARDAR PRODUCTO ---
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoProducto = {
        nombre: document.getElementById('nombre-producto').value,
        precio: parseFloat(document.getElementById('precio-producto').value),
        stock: parseInt(document.getElementById('stock-producto').value)
    };

    await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
    });

    formulario.reset();
    cargarProductos();
});

// --- FUNCIÓN PARA ELIMINAR ---
async function eliminarProducto(id) {
    if (confirm('¿Deseas eliminar este producto?')) {
        await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        cargarProductos();
    }
}

// Iniciar cargando la lista
cargarProductos();