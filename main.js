// ==========================================
// 1. CONFIGURACIÓN DE REDES SOCIALES
// ==========================================
function abrirWppPlayJohn() {
    const telefono = "5491141701483";
    const mensaje = "Hola 08 Play John! Quiero hacer una consulta.";
    const urlFinal = "https://whatsapp.com" + telefono + "&text=" + encodeURIComponent(mensaje);
    window.open(urlFinal, "_blank");
}

// ==========================================
// 2. LÓGICA INTERACTIVA DEL CARRITO
// ==========================================
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
    
    const sidebar = document.getElementById('carrito-lateral');
    if (sidebar) sidebar.classList.add('open');
}

function cambiarCantidadItem(id, operacion) {
    let carrito = obtenerCarrito();
    const producto = carrito.find(item => item.id === id);
    
    if (producto) {
        if (operacion === 'sumar') {
            producto.cantidad += 1;
        } else if (operacion === 'restar') {
            producto.cantidad -= 1;
        }
        
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
    }
    
    localStorage.setItem('carrito_playjohn', JSON.stringify(carrito));
    actualizarGloboCarrito();
    renderizarItemsCarrito();
}

function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito_playjohn', JSON.stringify(carrito));
    actualizarGloboCarrito();
    renderizarItemsCarrito();
}

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

        contenedorItems.innerHTML += `
            <div class="cart-item-row">
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p>${subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</p>
                    <div class="cart-qty-control">
                        <button type="button" class="qty-btn" onclick="cambiarCantidadItem('${item.id}', 'restar')">−</button>
                        <span class="qty-number">${item.cantidad}</span>
                        <button type="button" class="qty-btn" onclick="cambiarCantidadItem('${item.id}', 'sumar')">+</button>
                    </div>
                </div>
                <button type="button" class="remove-item-btn" onclick="eliminarDelCarrito('${item.id}')">✕</button>
            </div>
        `;
    });

    contenedorTotal.innerText = totalAcumulado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
}

// ==========================================
// 3. FUNCIÓN ÚNICA DE ENVÍO DE PEDIDO
// ==========================================
function enviarPedidoWhatsApp() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    let mensaje = "🛒 *NUEVO PEDIDO - 08 PLAY JOHN*\n\nHola! Quiero realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += "• *" + item.nombre + "* (x" + item.cantidad + ") - " + subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }) + "\n";
    });

    mensaje += "\n💰 *Total del Pedido:* " + total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }) + "\n\n";
    mensaje += "¿Tienen disponibilidad de stock para confirmar el pago?";

    const telefono = "5491141701483";
    
    // ESTA ES LA URL LIMPIA QUE DEBE QUEDAR
    const urlFinal = "https://whatsapp.com" + telefono + "&text=" + encodeURIComponent(mensaje);
    window.open(urlFinal, "_blank");
}


// ==========================================
// 3. CONECTOR DE BASE DE DATOS (GOOGLE DRIVE)
// ==========================================
const URL_DRIVE_JSON = "https://script.google.com/macros/s/AKfycbwqPdUzWDOJAtaputLJC2ebosxGuLkrkBxOFQu08PxvhenV3iUEcYYV2hGLdhJl5-Kx/exec";

async function cargarProductosDesdeDrive() {
    try {
        console.log("Sincronizando con Google Drive...");
        const respuesta = await fetch(URL_DRIVE_JSON);
        const productosLista = await respuesta.json();
        
        window.productosGuardadosGlobal = productosLista;
        renderizarProductosEnPantalla(productosLista, "todos");
    } catch (error) {
        console.error("Error crítico al leer datos desde Google Drive:", error);
    }
}

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

            contenedorGrid.innerHTML += `
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
    if (event && event.target) {
        event.target.classList.add('active');
    }
    renderizarProductosEnPantalla(window.productosGuardadosGlobal, categoria);
}

// ==========================================
// 4. BUSCADOR GLOBAL Y REFRESCADO
// ==========================================
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


    searchButtons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); ejecutarBusqueda(searchInputs[idx].value); });
    });
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); ejecutarBusqueda(e.target.value); } });
    });
}

// ====== INICIALIZADOR AL CARGAR LA PÁGINA ======
document.addEventListener("DOMContentLoaded", () => {
    actualizarGloboCarrito();
    inicializarBuscadorGlobal();
    cargarProductosDesdeDrive();
    iniciarRotacionAutomatica();
});
// ==========================================
// 5. CONTROL DINÁMICO DEL CARRUSEL DE BANNERS
// ==========================================
let indiceSlideActual = 0;
let intervaloCarrusel;

function mostrarSlide(indice) {
    const imagenes = document.querySelectorAll('.carousel-slide .carousel-img');
    if (imagenes.length === 0) return;

    // Manejo de bucle si se pasa del límite izquierdo o derecho
    if (indice >= imagenes.length) { indiceSlideActual = 0; }
    else if (indice < 0) { indiceSlideActual = imagenes.length - 1; }
    else { indiceSlideActual = indice; }

    // Ocultamos todas las imágenes y solo mostramos la activa
    imagenes.forEach(img => img.style.display = 'none');
    imagenes[indiceSlideActual].style.display = 'block';
}

function cambiarSlide(direccion) {
    // Al hacer clic manual, reiniciamos el temporizador automático para que no salte rápido
    clearInterval(intervaloCarrusel);
    mostrarSlide(indiceSlideActual + direccion);
    iniciarRotacionAutomatica();
}

function iniciarRotacionAutomatica() {
    intervaloCarrusel = setInterval(() => {
        mostrarSlide(indiceSlideActual + 1);
    }, 4000); // Cambia de propaganda automáticamente cada 4 segundos
}

// Modificamos el inicializador DOMContentLoaded que ya tenés en tu main.js 
// para que encienda el carrusel apenas cargue la web agregando:
// iniciarRotacionAutomatica(); justo antes del cierre de la función.


