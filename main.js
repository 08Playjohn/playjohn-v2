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
// 2. LÓGICA DE PREVISUALIZACIÓN DE PRODUCTO FLOTANTE
// ==========================================

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
    
    const wrapper = document.getElementById('modal-carousel-wrapper');
    if (wrapper) {
        wrapper.innerHTML = ''; 
        indiceImagenModal = 0;   

        if (imagenUrl.includes(',')) {
            imagenesModalActuales = imagenUrl.split(',').map(url => url.trim());
        } else {
            imagenesModalActuales = [imagenUrl.trim()];
        }

        imagenesModalActuales.forEach((url, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.className = 'modal-imagen';
            imgElement.onerror = function() { this.src = 'https://unsplash.com'; };
            imgElement.style.display = index === 0 ? 'block' : 'none';
            wrapper.appendChild(imgElement);
        });
    }

    const flechas = document.querySelectorAll('.modal-carousel-arrow');
    flechas.forEach(flecha => {
        flecha.style.display = imagenesModalActuales.length > 1 ? 'flex' : 'none';
    });
    
    const botonCompraModal = document.getElementById('modal-btn-comprar');
    if (botonCompraModal) {
        botonCompraModal.onclick = function(e) {
            e.stopPropagation();
            agregarAlCarrito(id, nombre, precioNumerico);
            document.getElementById('producto-modal').style.display = 'none';
        };
    }

    // ==========================================
    // NUEVO: CONTROL AUTOMÁTICO DE LA CRUZ DE CIERRE (✕)
    // ==========================================
    const modalOverlay = document.getElementById('producto-modal');
    // Buscamos la caja blanca interna (asumiendo que es el primer 'div' hijo)
    const cajaBlanca = modalOverlay ? modalOverlay.querySelector('div') : null;

    if (cajaBlanca) {
        // Aseguramos que la caja blanca tenga position relative para anclar la cruz
        cajaBlanca.style.position = 'relative';

        // Verificamos si la cruz ya existe para no duplicarla
        let botonCerrar = cajaBlanca.querySelector('.modal-close-btn');
        if (!botonCerrar) {
            botonCerrar = document.createElement('button');
            botonCerrar.type = 'button';
            botonCerrar.className = 'modal-close-btn';
            botonCerrar.innerText = '✕';
            
            // Asignamos la acción directa de cierre
            botonCerrar.onclick = function(e) {
                e.stopPropagation(); // Evita conflictos con clics del fondo
                modalOverlay.style.display = 'none';
            };

            // La insertamos arriba de todo adentro de la caja blanca
            cajaBlanca.insertBefore(botonCerrar, cajaBlanca.firstChild);
        }
    }

    document.getElementById('producto-modal').style.display = 'flex';
}

function cambiarSlideModal(direccion) {
    const imagenes = document.querySelectorAll('#modal-carousel-wrapper .modal-imagen');
    if (imagenes.length <= 1) return;

    imagenes[indiceImagenModal].style.display = 'none';

    indiceImagenModal += direccion;
    if (indiceImagenModal >= imagenes.length) { indiceImagenModal = 0; }
    if (indiceImagenModal < 0) { indiceImagenModal = imagenes.length - 1; }

    imagenes[indiceImagenModal].style.display = 'block';
}

function cerrarModalExterno(event) {
    const modalOverlay = document.getElementById('producto-modal');
    if (event.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
}
// ==========================================
// 3. LÓGICA INTERACTIVA DEL CARRITO
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
    
    const urlFinal = `https://wa.me/${telefono}/?text=${encodeURIComponent(mensaje)}`;
    window.open(urlFinal, "_blank");
}

// ==========================================
// 4. CONECTOR DE BASE DE DATOS (GOOGLE DRIVE)
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
            
            const imagenProd = producto.imagen ? producto.imagen.split(',')[0].trim() : "https://unsplash.com";

            const nombreEscapado = producto.nombre.replace(/'/g, "\\'").replace(/"/g, '\\"');
            const descEscapada = descripcionProd.replace(/'/g, "\\'").replace(/"/g, '\\"');
            const imagenCompletaEscapada = producto.imagen ? producto.imagen.replace(/'/g, "\\'").replace(/"/g, '\\"') : "https://unsplash.com";

            contenedorGrid.innerHTML += `
                <div class="product-card" onclick="abrirProductoFlotante('${prodId}', '${nombreEscapado}', '${descEscapada}', ${precioLimpio}, '${imagenCompletaEscapada}')" style="cursor: pointer;">
                    <div class="product-img-box">
                        <img src="${imagenProd}" alt="${producto.nombre}" onerror="this.src='https://unsplash.com'">
                    </div>
                    <div class="product-info-block">
                        <h3 class="product-title">${producto.nombre}</h3>
                        <p class="product-description">${descripcionProd}</p>
                        <p class="product-price">${precioFormateado}</p>
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
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
    renderizarProductosEnPantalla(window.productosGuardadosGlobal, categoria);
}

// ==========================================
// 5. BUSCADOR GLOBAL Y REFRESCADO
// ==========================================
function inicializarBuscadorGlobal() {
    const searchInputs = document.querySelectorAll('.search-area input');
    const searchButtons = document.querySelectorAll('.search-btn');
    let debounceTimer;

    function ejecutarBusqueda(texto) {
        const textoLimpio = texto.trim().toLowerCase();
        
        // Si el usuario borró el texto, limpia la búsqueda mostrando todos los productos
        if (textoLimpio === '') {
            if (window.productosGuardadosGlobal) {
                renderizarProductosEnPantalla(window.productosGuardadosGlobal, "todos");
            }
            return;
        }

        if (!window.productosGuardadosGlobal) return;

        // Divide el texto en palabras sueltas
        const palabras = textoLimpio.split(/\s+/);

        const productosEncontrados = window.productosGuardadosGlobal.filter(p => {
            const nombre = (p.nombre || '').toLowerCase();
            const descripcion = (p.descripcion || '').toLowerCase();

            // Verifica que cada palabra esté en el nombre o en la descripción
            return palabras.every(palabra => 
                nombre.includes(palabra) || descripcion.includes(palabra)
            );
        });

        renderizarProductosEnPantalla(productosEncontrados, "todos");
    }

    searchButtons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            ejecutarBusqueda(searchInputs[idx].value); 
        });
    });

    searchInputs.forEach(input => {
        // Evita que el formulario se recargue por accidente al presionar Enter
        input.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') e.preventDefault(); 
        });

        // Modificado: Búsqueda automática e inteligente en tiempo real
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                ejecutarBusqueda(e.target.value);
            }, 200); // Espera 200ms tras la última pulsación de tecla
        });
    });
}
// ==========================================
// 6. CONTROL DINÁMICO DEL CARRUSEL DE BANNERS
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

// ====== INICIALIZADOR AL CARGAR LA PÁGINA ======
document.addEventListener("DOMContentLoaded", () => {
    actualizarGloboCarrito();
    inicializarBuscadorGlobal();
    cargarProductosDesdeDrive();
    iniciarRotacionAutomatica();
});
