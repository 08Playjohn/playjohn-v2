// ==========================================
// 1. CONFIGURACIÓN DE REDES SOCIALES
// ==========================================

function abrirWppPlayJohn() {
    const telefono = "5491141701483";
    const mensaje = "Hola 08 Play John! Quiero hacer una consulta.";
    const urlFinal = `https://wa.me/${telefono}/?text=${encodeURIComponent(mensaje)}`;
    window.open(urlFinal, "_blank");
}

function abrirIgPlayJohn() {
    const usuarioIg = "08playjohn";
    const urlIg = `https://instagram.com/${usuarioIg}/`; 
    window.open(urlIg, "_blank");
}

// ==========================================
// NUEVO: LÓGICA DE PRODUCTO FLOTANTE (MODAL)
// ==========================================

// Esta función recibe los datos dinámicos desde tu loop de Google Drive
function abrirProductoFlotante(id, nombre, descripcion, precio, imagenUrl) {
    // 1. Inyectamos los textos e imágenes en los selectores del modal de tu HTML
    document.getElementById('modal-titulo').innerText = nombre;
    document.getElementById('modal-descripcion').innerText = descripcion || "Sin descripción disponible.";
    
    // Convertimos el precio a formato moneda para que luzca estético
    const precioNumerico = parseFloat(precio) || 0;
    document.getElementById('modal-precio').innerText = precioNumerico.toLocaleString('es-AR', { 
        style: 'currency', 
        currency: 'ARS', 
        maximumFractionDigits: 0 
    });
    
    document.getElementById('modal-img').src = imagenUrl;
    
    // 2. Vinculamos el botón de compra interna del modal con tu función nativa de carrito
    const botonCompra = document.getElementById('modal-btn-comprar');
    botonCompra.onclick = function() {
        // Ejecuta tu función existente pasándole los parámetros limpios
        agregarAlCarrito(id, nombre, precioNumerico);
        
        // Cierra la ventana flotante de forma automática al sumarlo, si lo deseás
        document.getElementById('producto-modal').style.display = 'none';
    };

    // 3. Mostramos la ventana flotante en pantalla
    document.getElementById('producto-modal').style.display = 'flex';
}

// Función que detecta clics fuera de la tarjeta del producto flotante para cerrarlo
function cerrarModalExterno(event) {
    const modalOverlay = document.getElementById('producto-modal');
    if (event.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
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
// ==========================================
// 1. CONFIGURACIÓN DE REDES SOCIALES
// ==========================================

function abrirWppPlayJohn() {
    const telefono = "5491141701483";
    const mensaje = "Hola 08 Play John! Quiero hacer una consulta.";
    const urlFinal = `https://wa.me{telefono}/?text=${encodeURIComponent(mensaje)}`;
    window.open(urlFinal, "_blank");
}

function abrirIgPlayJohn() {
    const usuarioIg = "08playjohn";
    const urlIg = `https://instagram.com{usuarioIg}/`; 
    window.open(urlIg, "_blank");
}

// VARIABLES GLOBALES PARA EL CARRUSEL DEL MODAL
let imagenesModalActuales = [];
let indiceImagenModal = 0;

function abrirProductoFlotante(id, nombre, descripcion, precio, imagenUrl) {
    document.getElementById('modal-titulo').innerText = nombre;
    document.getElementById('modal-descripcion').innerText = descripcion || "Sin descripción disponible.";
    
    const precioNumerico = parseFloat(precio) || 0;
    document.getElementById('modal-precio').innerText = precioNumerico.toLocaleString('es-AR', { 
        style: 'currency', 
        currency: 'ARS', 
        maximumFractionDigits: 0 
    });
    
    // ==========================================
    // NUEVA LÓGICA: SEPARAR IMÁGENES POR COMA
    // ==========================================
    const wrapper = document.getElementById('modal-carousel-wrapper');
    wrapper.innerHTML = ''; // Limpiamos fotos anteriores
    indiceImagenModal = 0;   // Reseteamos el contador al primer slide

    // Si tu celda de Drive tiene comas, las divide en una lista de links. Si no, crea una lista de una sola foto.
    if (imagenUrl.includes(',')) {
        imagenesModalActuales = imagenUrl.split(',').map(url => url.trim());
    } else {
        imagenesModalActuales = [imagenUrl.trim()];
    }

    // Inyectamos las imágenes en el contenedor del carrusel
    imagenesModalActuales.forEach((url, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.className = 'modal-imagen';
        imgElement.onerror = function() { this.src = 'https://unsplash.com'; };
        // Escondemos todas las fotos menos la primera
        imgElement.style.display = index === 0 ? 'block' : 'none';
        wrapper.appendChild(imgElement);
    });

    // Escondemos las flechas si el producto tiene una sola imagen
    const flechas = document.querySelectorAll('.modal-carousel-arrow');
    flechas.forEach(flecha => {
        flecha.style.display = imagenesModalActuales.length > 1 ? 'flex' : 'none';
    });
    
    // Botón de compra interno del modal
    const botonCompraModal = document.getElementById('modal-btn-comprar');
    botonCompraModal.onclick = function(e) {
        e.stopPropagation();
        agregarAlCarrito(id, nombre, precioNumerico);
        document.getElementById('producto-modal').style.display = 'none';
    };

    document.getElementById('producto-modal').style.display = 'flex';
}

// NUEVA FUNCIÓN: Mover las imágenes del producto flotante hacia adelante o atrás
function cambiarSlideModal(direccion) {
    const imagenes = document.querySelectorAll('#modal-carousel-wrapper .modal-imagen');
    if (imagenes.length <= 1) return;

    // Ocultamos la imagen actual
    imagenes[indiceImagenModal].style.display = 'none';

    // Calculamos el nuevo índice de foto
    indiceImagenModal += direccion;
    if (indiceImagenModal >= imagenes.length) { indiceImagenModal = 0; }
    if (indiceImagenModal < 0) { indiceImagenModal = imagenes.length - 1; }

    // Mostramos la nueva imagen
    imagenes[indiceImagenModal].style.display = 'block';
}


    // 3. Desplegamos el modal flotante centrado
    document.getElementById('producto-modal').style.display = 'flex';
}

// Condición: Si el usuario hace click afuera de la tarjeta blanca (en el fondo oscuro), vuelve
function cerrarModalExterno(event) {
    const modalOverlay = document.getElementById('producto-modal');
    if (event.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
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
// ==========================================
// CONTINUACIÓN DE LÓGICA DEL CARRITO
// ==========================================

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

function enviarPedidoWhatsApp() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    document.getElementById('form-nombre').value = '';
    document.getElementById('form-direccion').value = '';

    const modal = document.getElementById('modal-formulario-cliente');
    if (modal) modal.style.display = 'flex';
}

function cerrarFormularioCliente() {
    const modal = document.getElementById('modal-formulario-cliente');
    if (modal) modal.style.display = 'none';
}

function procesarFormularioYEnviar() {
    const nombreInput = document.getElementById('form-nombre').value.trim();
    let direccionInput = document.getElementById('form-direccion').value.trim();

    if (!nombreInput) {
        alert("Por favor, ingresá tu Nombre y Apellido para continuar.");
        return;
    }

    if (!direccionInput) {
        direccionInput = "No especificada por el cliente";
    }

    const carrito = obtenerCarrito();
    let total = 0;

    let mensaje = `*🛒 NUEVO PEDIDO - 08 PLAY JOHN*\n\n`;
    mensaje += `Hola, soy: *${nombreInput}*\n`;
    mensaje += `📌 *Dirección de cliente:* ${direccionInput}\n\n`;
    mensaje += `Quiero coordinar la compra de los siguientes productos:\n\n`;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• *${item.nombre}* (x${item.cantidad}) - ${subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}\n`;
    });

    mensaje += `\n💰 *Total del Pedido:* ${total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}\n`;
    mensaje += `\n¿Tienen disponibilidad de stock para confirmar el pago?`;

    const telefono = "5491141701483";
    cerrarFormularioCliente();
    
    const urlFinal = `https://wa.me{telefono}/?text=${encodeURIComponent(mensaje)}`;
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
            
            // =========================================================================
            // COLOQUÉ TU REGLA ACÁ ADENTRO (¡Corregida con [0] para que no tire error!):
            // =========================================================================
            const imagenProd = producto.imagen ? producto.imagen.split(',')[0].trim() : "https://unsplash.com";

            // Limpiamos comillas simples y dobles para que no rompan la función onclick del HTML
            const nombreEscapado = producto.nombre.replace(/'/g, "\\'").replace(/"/g, '\\"');
            const descEscapada = descripcionProd.replace(/'/g, "\\'").replace(/"/g, '\\"');
            
            // Pasamos el string entero de imágenes (con comas) al modal para que arme el carrusel
            const imagenCompletaEscapada = producto.imagen ? producto.imagen.replace(/'/g, "\\'").replace(/"/g, '\\"') : "https://unsplash.com";

            // NUEVO: La tarjeta completa abre la ventana flotante al hacer clic
            contenedorGrid.innerHTML += `
                <div class="product-card" onclick="abrirProductoFlotante('${prodId}', '${nombreEscapado}', '${descEscapada}', ${precioLimpio}, '${imagenCompletaEscapada}')" style="cursor: pointer;">
                    <div class="product-img-box">
                        <img src="${imagenProd}" alt="${producto.nombre}" onerror="this.src='https://unsplash.com'">
                    </div>
                    <div class="product-info-block">
                        <h3 class="product-title">${producto.nombre}</h3>
                        <p class="product-description">${descripcionProd}</p>
                        <p class="product-price">${precioFormateado}</p>
                        <!-- event.stopPropagation() hace que el botón sume directo al carrito sin abrir el flotante -->
                        <button class="add-to-cart-btn" onclick="event.stopPropagation(); agregarAlCarrito('${prodId}', '${nombreEscapado}', ${precioLimpio})">
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

            // Limpiamos comillas simples y dobles para que no rompan la función onclick del HTML
            const nombreEscapado = producto.nombre.replace(/'/g, "\\'").replace(/"/g, '\\"');
            const descEscapada = descripcionProd.replace(/'/g, "\\'").replace(/"/g, '\\"');

            // NUEVO: La tarjeta completa abre la ventana flotante al hacer clic
            contenedorGrid.innerHTML += `
                <div class="product-card" onclick="abrirProductoFlotante('${prodId}', '${nombreEscapado}', '${descEscapada}', ${precioLimpio}, '${imagenProd}')" style="cursor: pointer;">
                    <div class="product-img-box">
                        <img src="${imagenProd}" alt="${producto.nombre}" onerror="this.src='https://unsplash.com'">
                    </div>
                    <div class="product-info-block">
                        <h3 class="product-title">${producto.nombre}</h3>
                        <p class="product-description">${descripcionProd}</p>
                        <p class="product-price">${precioFormateado}</p>
                        <!-- event.stopPropagation() hace que el botón sume directo al carrito sin abrir el flotante -->
                        <button class="add-to-cart-btn" onclick="event.stopPropagation(); agregarAlCarrito('${prodId}', '${nombreEscapado}', ${precioLimpio})">
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

    if (indice >= imagenes.length) { indiceSlideActual = 0; }
    else if (indice < 0) { indiceSlideActual = imagenes.length - 1; }
    else { indiceSlideActual = indice; }

    imagenes.forEach(img => img.style.display = 'none');
    imagenes[indiceSlideActual].style.display = 'block';
}

function cambiarSlide(direccion) {
    clearInterval(intervaloCarrusel);
    mostrarSlide(indiceSlideActual + direccion);
    iniciarRotacionAutomatica();
}

function iniciarRotacionAutomatica() {
    intervaloCarrusel = setInterval(() => {
        mostrarSlide(indiceSlideActual + 1);
    }, 4000);
}
