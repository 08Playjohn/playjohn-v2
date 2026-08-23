// ====== CONFIGURACIÓN DE REDES SOCIALES (08 PLAY JOHN) ======

function abrirWppPlayJohn() {
    const telefono = "5491141701483";
    const mensaje = "Hola 08 Play John! Quiero hacer una consulta.";
    const urlWpp = "https://whatsapp.com" + telefono + "&text=" + encodeURIComponent(mensaje);
    window.open(urlWpp, "_blank");
}

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
        
        console.log("Conexión exitosa. Catálogo recibido.");
        
        // Guardamos de forma global para poder filtrar sin volver a hacer fetch
        window.productosGuardadosGlobal = productosLista;
        
        // Inicializamos mostrando "todos" los productos
        renderizarProductosEnPantalla(productosLista, "todos");
        
    } catch (error) {
        console.error("Error crítico al leer datos desde Google Drive:", error);
    }
}

// ====== RENDERIZADOR MEJORADO CON FILTROS DINÁMICOS Y TEXTO COMPLETO ======
function renderizarProductosEnPantalla(productos, filtroSeleccionado) {
    const contenedorGrid = document.querySelector('.products-grid');
    if (!contenedorGrid) return; 

    contenedorGrid.innerHTML = '';
    let productosDibujados = 0;

    productos.forEach((producto, index) => {
        if (!producto || !producto.categoria || !producto.nombre) return;

        // Estandarizamos la categoría que viene de tu planilla Excel
        const catFormateada = producto.categoria.toLowerCase().trim();
        const listaConsolas = ['ps2', 'ps3', 'ps4', 'ps5', 'xbox 360', 'nintendo wii', 'consolas'];
        
        let categoriaAsignada = listaConsolas.includes(catFormateada) ? "consolas" : "computacion";
        
        // Filtro lógico: si el filtro es 'todos', pasa. Si no, debe coincidir exactamente
        if (filtroSeleccionado === "todos" || categoriaAsignada === filtroSeleccionado) {
            
            const prodId = producto.id ? producto.id : `drive_${index}`;
            const precioLimpio = producto.precio ? parseFloat(producto.precio) : 0;
            const precioFormateado = precioLimpio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
            const descripcionProd = producto.descripcion ? producto.descripcion : "Sin descripción disponible.";
            const imagenProd = producto.imagen ? producto.imagen : "https://unsplash.com";

            const tarjetaHTML = `
                <div class="product-card">
                    <div class="product-img-box">
                        <img src="${imagenProd}" alt="${producto.nombre}" onerror="this.src='https://unsplash.com'">
                    </div>
                    <div class="product-info-block">
                        <h3 class="product-title">${producto.nombre}</h3>
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

    if (productosDibujados === 0) {
        contenedorGrid.innerHTML = `<p style="color: #aaa; grid-column: 1/-1; text-align: center; padding: 40px; font-family: sans-serif;">No hay productos disponibles bajo esta categoría.</p>`;
    }
}

// ====== FUNCIÓN PARA DISPARAR LOS BOTONES DE FILTRADO EN PANTALLA ======
function filtrarCatalogo(categoria) {
    if (!window.productosGuardadosGlobal) return;
    
    // Cambiamos el estado de los botones visuales
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Renderizamos la grilla con el nuevo filtro aplicado
    renderizarProductosEnPantalla(window.productosGuardadosGlobal, categoria);
}

// ====== BUSCADOR ASINCRÓNICO GLOBAL ======
function inicializarBuscadorGlobal() {
    const searchInputs = document.querySelectorAll('.search-area input');
    const searchButtons = document.querySelectorAll('.search-btn');

    function ejecutarBusqueda(texto) {
        const busqueda = texto.trim().toLowerCase();
        if (busqueda === '' || !window.productosGuardadosGlobal) return;

        // Filtramos de forma dinámica en la pantalla actual los nombres que coincidan
        const productosEncontrados = window.productosGuardadosGlobal.filter(p => p.nombre.toLowerCase().includes(busqueda));
        renderizarProductosEnPantalla(productosEncontrados, "todos");
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
    console.log("Catálogo Inteligente Unificado para 08 Play John inicializado.");
    actualizarGloboCarrito();
    inicializarBuscadorGlobal();
    cargarProductosDesdeDrive();
});

