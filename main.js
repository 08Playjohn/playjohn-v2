// LINK DE TU GOOGLE SHEET (Reemplazá todo lo que está entre comillas por tu enlace .csv de Google)
const URL_DRIVE_CSV = "AQUÍ_PEGA_EL_ENLACE_CSV_QUE_COPIASTE_EN_EL_PASO_2";

// ====== SISTEMA DE CONFIGURACIÓN DE CARRITO ======
function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito_playjohn');
    return carrito ? JSON.parse(carrito) : [];
}

function actualizarGloboCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function agregarAlCarrito(id, nombre, precio) {
    let carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio: parseFloat(price), cantidad: 1 });
    }
    
    localStorage.setItem('carrito_playjohn', JSON.stringify(carrito));
    actualizarGloboCarrito();
    alert(`¡${nombre} agregado!`);
}

// ====== LECTOR DINÁMICO DESDE GOOGLE DRIVE ======
async function cargarProductosDesdeDrive() {
    try {
        const respuesta = await fetch(URL_DRIVE_CSV);
        const datosTexto = await respuesta.text();
        
        // Convertimos las filas del archivo CSV de Drive en un Array de objetos
        const filas = datosTexto.split('\n').slice(1); 
        const productos = [];

        filas.forEach(fila => {
            const columnas = fila.split(',');
            if (columnas.length >= 6) {
                const producto = {
                    id: columnas[0].trim(),
                    nombre: columnas[1].trim(),
                    precio: columnas[2].trim(),
                    categoria: columnas[3].trim().toLowerCase(),
                    imagen: columnas[4].trim(),
                    mostrar: columnas[5].trim().toLowerCase()
                };
                // Condicionador dinámico: Solo se procesa si pusiste "si"
                if (producto.mostrar === 'si') {
                    productos.push(producto);
                }
            }
        });

        window.catalogoGlobal = productos; // Guardamos para el buscador
        renderizarProductosEnPantalla(productos);

    } catch (error) {
        console.error("Error al conectar con Google Drive:", error);
    }
}

// ====== RENDERIZADOR AUTOMÁTICO DE TARJETAS ======
function renderizarProductosEnPantalla(productos) {
    const contenedorGrid = document.querySelector('.products-grid');
    if (!contenedorGrid) return; // Si no estamos en una página de grilla, frena.

    // Detectamos en qué página está parado el usuario (computacion o consolas)
    const paginaActual = window.location.pathname.includes('computacion') ? 'computacion' : 'consolas';
    
    // Filtramos los productos que corresponden estrictamente a esta sección
    const productosFiltrados = productos.filter(p => p.categoria === paginaActual);
    
    // Limpiamos las tarjetas estáticas anteriores
    contenedorGrid.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedorGrid.innerHTML = `<p style="color: #aaa; grid-column: 1/-1; text-align: center;">No hay novedades disponibles en este momento.</p>`;
        return;
    }

    // Armamos las tarjetas dinámicas una por una
    productosFiltrados.forEach(p => {
        const precioFormateado = parseFloat(p.precio).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
        
        const tarjetaHTML = `
            <div class="product-card">
                <div class="product-img-box">
                    <img src="${p.imagen}" alt="${p.nombre}">
                </div>
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <p class="product-price">${precioFormateado}</p>
                    <button class="add-to-cart-btn" onclick="agregarAlCarrito('${p.id}', '${p.nombre}', ${p.precio})">Agregar al Carrito 🛒</button>
                </div>
            </div>
        `;
        contenedorGrid.innerHTML += tarjetaHTML;
    });
}

// ====== BUSCADOR ASINCRÓNICO ======
function inicializarBuscadorGlobal() {
    const searchInputs = document.querySelectorAll('.search-area input');
    const searchButtons = document.querySelectorAll('.search-btn');

    function ejecutarBusqueda(texto) {
        const busqueda = texto.trim().toLowerCase();
        if (busqueda === '' || !window.catalogoGlobal) return;

        const encontrado = window.catalogoGlobal.find(p => p.nombre.toLowerCase().includes(busqueda));

        if (encontrado) {
            window.location.href = `${encontrado.categoria}.html`;
        } else {
            alert('No encontramos novedades con ese nombre.');
        }
    }

    searchButtons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); ejecutarBusqueda(searchInputs[idx].value); });
    });
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); ejecutarBusqueda(e.target.value); } });
    });
}

// Disparador de carga al abrir la web
document.addEventListener('DOMContentLoaded', () => {
    actualizarGloboCarrito();
    cargarProductosDesdeDrive();
    inicializarBuscadorGlobal();
});
