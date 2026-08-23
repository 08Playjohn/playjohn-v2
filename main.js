// ====== CONFIGURACIÓN DE REDES SOCIALES (08 PLAY JOHN) ======

// Función para abrir el WhatsApp de forma segura
function abrirWppPlayJohn() {
    const telefono = "5491141701483";
    const mensaje = "Hola 08 Play John! Quiero hacer una consulta.";
    const urlWpp = "https://whatsapp.com" + telefono + "&text=" + encodeURIComponent(mensaje);
    window.open(urlWpp, "_blank");
}

// Función para abrir el Instagram de forma segura
function abrirIgPlayJohn() {
    const usuarioIg = "08playjohn";
    const urlIg = "https://instagram.com" + usuarioIg + "/";
    window.open(urlIg, "_blank");
}

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
        carrito.push({ id: id, nombre: nombre, precio: parseFloat(precio), cantidad: 1 });
    }
    
    localStorage.setItem('carrito_playjohn', JSON.stringify(carrito));
    actualizarGloboCarrito();
    alert(`¡${nombre} agregado al carrito!`);
}

// ====== CONECTOR DIRECTO CON TU MACRO DE GOOGLE DRIVE (JSON) ======
const URL_DRIVE_JSON = "https://script.google.com/macros/s/AKfycbwqPdUzWDOJAtaputLJC2ebosxGuLkrkBxOFQu08PxvhenV3iUEcYYV2hGLdhJl5-Kx/exec";

async function cargarProductosDesdeDrive() {
    try {
        console.log("Iniciando sincronización con el JSON de Google Drive...");
        const respuesta = await fetch(URL_DRIVE_JSON);
        const productosLista = await respuesta.json();
        
        console.log("Conexión exitosa. Datos recibidos:", productosLista);
        
        // Enviamos el listado directamente al renderizador de pantalla
        renderizarProductosEnPantalla(productosLista);

    } catch (error) {
        console.error("Error crítico al leer datos desde Google Drive:", error);
    }
}

// ====== RENDERIZADOR COMPATIBLE CON TU JSON (SIN IMPUESTOS NI CUOTAS) ======
function renderizarProductosEnPantalla(productos) {
    const contenedorGrid = document.querySelector('.products-grid');
    if (!contenedorGrid) return; 

    // Detectamos en qué página HTML está parado el cliente
    const esPaginaComputacion = window.location.pathname.includes('computacion');
    
    contenedorGrid.innerHTML = '';
    let productosDibujados = 0;

    productos.forEach((producto, index) => {
        if (!producto || !producto.categoria || !producto.nombre) return;

        // Estandarizamos la categoría que viene de tu Drive
        const catFormateada = producto.categoria.toLowerCase().trim();
        const listaConsolas = ['ps2', 'ps3', 'ps4', 'ps5', 'xbox 360', 'nintendo wii', 'consolas'];
        
        // Clasificación inteligente
        let esDeConsolas = listaConsolas.includes(catFormateada);
        
        // Filtramos para inyectar solo lo que corresponde a cada sección web
        if ((esPaginaComputacion && !esDeConsolas) || (!esPaginaComputacion && esDeConsolas)) {
            
            // ID de seguridad único por fila
            const prodId = producto.id ? producto.id : `drive_${index}`;
            const precioLimpio = producto.precio ? parseFloat(producto.precio) : 0;
            const precioFormateado = precioLimpio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
            const descripcionProd = producto.descripcion ? producto.descripcion : "Sin descripción disponible.";
            const imagenProd = producto.imagen ? producto.imagen : "https://unsplash.com";

            // Armamos la tarjeta limpia requerida: sin cuotas, sin leyendas fiscales, con sumador de carrito
            const tarjetaHTML = `
                <div class="product-card">
                    <div class="product-img-box">
                        <img src="${imagenProd}" alt="${producto.nombre}" onerror="this.src='https://unsplash.com'">
                    </div>
                    <div class="product-info">
                        <h3>${producto.nombre}</h3>
                        <p class="product-description">${descripcionProd}</p>
                        <p class="product-price">${precioFormateado}</p>
                        <button class="add-to-cart-btn" onclick="agregarAlCarrito('${prodId}', '${producto.nombre.replace(/'/g, "\\'")}', ${precioLimpio})">
                            🛒 COMPRAR
                        </button>
                    </div>
                </div>
            `;
            contenedorGrid.innerHTML += tarjetaHTML;
            productosDibujados++;
        }
    });

    // Si la sección queda vacía colocamos un mensaje decorativo gamer
    if (productosDibujados === 0) {
        contenedorGrid.innerHTML = `<p style="color: #aaa; grid-column: 1/-1; text-align: center; padding: 40px; font-family: sans-serif;">No hay productos disponibles en esta sección por el momento.</p>`;
    }
}

// ====== BUSCADOR ASINCRÓNICO GLOBAL ======
function inicializarBuscadorGlobal() {
    const searchInputs = document.querySelectorAll('.search-area input');
    const searchButtons = document.querySelectorAll('.search-btn');

    function ejecutarBusqueda(texto) {
        const busqueda = texto.trim().toLowerCase();
        if (busqueda === '') return;

        alert('Buscando "' + texto + '" en el catálogo de 08 Play John...');
    }

    searchButtons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); ejecutarBusqueda(searchInputs[idx].value); });
    });
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); ejecutarBusqueda(e.target.value); } });
    });
}

// ====== INICIALIZADOR AL CARGAR LA PÁGINA ======
document.addEventListener("DOMContentLoaded", () => {
    console.log("Catálogo JSON Automatizado para 08 Play John cargado.");
    actualizarGloboCarrito();
    inicializarBuscadorGlobal();
    cargarProductosDesdeDrive();
});
