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

// ====== LÓGICA DE CONTROL DEL CARRITO LATERAL ======
function toggleCarritoLateral() {
    const sidebar = document.getElementById('carrito-lateral');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            renderizarItemsCarrito();
        }
    }
}

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
    renderizarItemsCarrito();
    
    // Abrimos el carrito automáticamente al comprar para mostrar la acción
    document.getElementById('carrito-lateral').classList.add('open');
}

function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito_playjohn', JSON.stringify(carrito));
    actualizarGloboCarrito();
    renderizarItemsCarrito();
}

// ====== DIBUJAR LOS ELEMENTOS DENTRO DEL MENÚ LATERAL ======
function renderizarItemsCarrito() {
    const contenedorItems = document.getElementById('cart-items-container');
    const contenedorTotal = document.getElementById('cart-total-value');
    if (!contenedorItems || !contenedorTotal) return;

    const carrito = obtenerCarrito();
    contenedorItems.innerHTML = '';
    let totalAcumulado = 0;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = `<p style="color: #666; text-align: center; padding-top: 30px;">Tu carrito está vacío.</p>`;
        contenedorTotal.innerText = "$ 0";
        return;
    }

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalAcumulado += subtotal;

        const filaHTML = `
            <div class="cart-item-row">
                <div class="cart-item-details">
                    <h4>${item.nombre} (x${item.cantidad})</h4>
                    <p>${subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</p>
                </div>
                <button type="button" class="remove-item-btn" onclick="eliminarDelCarrito('${item.id}')">✕</button>
            </div>
        `;
        contenedorItems.innerHTML += filaHTML;
    });

    contenedorTotal.innerText = totalAcumulado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
}

// ====== ENVIAR EL PEDIDO DETALLADO A TU WHATSAPP DIRECTO ======
function enviarPedidoWhatsApp() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    let mensaje = "🛒 *NUEVO PEDIDO - 08 PLAY JOHN*\n\nHola! Quiero coordinar la compra de los siguientes productos:\n\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• *${item.nombre}* (x${item.cantidad}) - ${subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}\n`;
    });

    mensaje += `\n💰 *Total del Pedido:* ${total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}\n\n`;
    mensaje += "¿Tienen disponibilidad de stock para confirmar el pago?";

    const urlFinal = "https://whatsapp.com5491141701483&text=" + encodeURIComponent(mensaje);
    window.open(urlFinal, "_blank");
}

// ====== CONECTOR DIRECTO CON TU MACRO DE GOOGLE DRIVE (JSON) ======
const URL_DRIVE_JSON = "https://script.google.com/macros/s/AKfycbwqPdUzWDOJAtaputLJC2ebosxGuLkrkBxOFQu08PxvhenV3iUEcYYV2hGLdhJl5-Kx/exec";

async function cargarProductosDesdeDrive() {
    try {
        console.log("Iniciando sincronización con el JSON de Google Drive...");
        const respuesta = await fetch(URL_DRIVE_JSON);
        const productosLista = await respuesta.json();
        
        window.productosGuardadosGlobal = productosLista;
        renderizarProductosEnPantalla(productosLista, "todos");
    } catch (error) {
        console.error("Error crítico al leer datos desde Google Drive:", error);
    }
}

// ====== RENDERIZADOR COMPATIBLE CON TU PALETA OSCURA ======
function renderizarProductosEnPantalla(productos, filtroSeleccionado) {
    const contenedorGrid = document.querySelector('.products-grid');
    if (!contenedorGrid) return; 

    contenedorGrid.innerHTML = '';
    let productosDibujados = 0;

    productos.forEach((producto, index) => {
        if (!producto || !producto.categoria || !producto.nombre) return;

        const catFormateada = producto.categoria.toLowerCase().trim();
        const listaConsolas = ['ps2', 'ps3', 'ps4', 'ps5', 'xbox 360', 'nintendo wii', 'consolas'];
        let categoriaAsignada = listaConsolas.includes(catFormateada) ? "consolas" : "computacion";
        
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

function filtrarCatalogo(categoria) {
    if (!window.productosGuardadosGlobal) return;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderizarProductosEnPantalla(window.productosGuardadosGlobal, categoria);
}

function inicializarBuscadorGlobal() {
    const searchInputs = document.querySelectorAll('.search-area input');
    const searchButtons = document.querySelectorAll('.search-btn');

    function ejecutarBusqueda(texto) {
        const busqueda = texto.trim().toLowerCase();
        if (busqueda === '' || !window.productosGuardadosGlobal) return;

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

document.addEventListener("DOMContentLoaded", () => {
    actualizarGloboCarrito();
    inicializarBuscadorGlobal();
    cargarProductosDesdeDrive();
});


