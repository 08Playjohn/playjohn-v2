// ====== CONFIGURACIÓN DE REDES SOCIALES (08 PLAY JOHN) ======

function abrirWppPlayJohn() {
    const telefono = "5491141701483";
    const mensaje = "Hola 08 Play John! Quiero hacer una consulta.";
    const urlWpp = "https://whatsapp.com" + telefono + "&text=" + encodeURIComponent(mensaje);
    window.open(urlWpp, "_blank");
}

function abrirIgPlayJohn() {
    const usuarioIg = "08playjohn";
    const urlIg = "https://www.instagram.com/" + usuarioIg + "/";
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

// ====== LECTOR DINÁMICO REESTRUCTURADO (COLUMNAS EXACTAS) ======
const URL_DRIVE_CSV = "https://google.com";

async function cargarProductosDesdeDrive() {
    try {
        const respuesta = await fetch(URL_DRIVE_CSV);
        const datosTexto = await respuesta.text();
        
        const filas = datosTexto.split('\n').slice(1); 
        const productos = [];

        filas.forEach((fila, index) => {
            // Regex seguro para separar celdas por comas sin romper descripciones largas
            const columnas = fila.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || fila.split(',');
            
            // Verificamos que la fila contenga al menos hasta la columna K (mínimo 11 columnas)
            if (columnas && columnas.length >= 11) {
                
                // Mapeo Dinámico según tus especificaciones
                const nombreProd = columnas[0].replace(/"/g, '').trim();
                const precioProd = columnas[6].replace(/"/g, '').replace(/[^0-9.]/g, '').trim();
                const descripcionProd = columnas[7].replace(/"/g, '').trim();
                const categoriaExcel = columnas[8].replace(/"/g, '').trim().toUpperCase();
                const imagenProd = columnas[9].replace(/"/g, '').trim();
                const visibleWeb = columnas[10].replace(/"/g, '').trim().toLowerCase();
                
                // Filtro dinámico: Solo se procesa si columna K es 'si' y tiene nombre válido
                if (visibleWeb === 'si' && nombreProd !== "") {
                    let categoriaGeneral = '';
                    const listaConsolas = ['PS2', 'PS3', 'PS4', 'PS5', 'XBOX 360', 'NINTENDO WII', 'CONSOLAS'];
                    const listaComputacion = ['COMPUTACION', 'AURICULARES', 'CABLES', 'MOUSES', 'TECLADOS'];

                    if (listaConsolas.includes(categoriaExcel)) {
                        categoriaGeneral = 'consolas';
                    } else if (listaComputacion.includes(categoriaExcel)) {
                        categoriaGeneral = 'computacion';
                    }

                    productos.push({
                        id: `prod_${index}`,
                        nombre: nombreProd,
                        precio: precioProd ? parseFloat(precioProd) : 0,
                        descripcion: descripcionProd ? descripcionProd : "Sin descripción disponible.",
                        categoriaPrincipal: categoriaGeneral,
                        imagen: imagenProd ? imagenProd : "https://unsplash.com"
                    });
                }
            }
        });

        window.catalogoGlobal = productos;
        renderizarProductosEnPantalla(productos);

    } catch (error) {
        console.error("Error al conectar con las columnas de Google Drive:", error);
    }
}

// ====== RENDERIZADOR DIRECTO SIN IMPUESTOS NI CUOTAS ======
function renderizarProductosEnPantalla(productos) {
    const contenedorGrid = document.querySelector('.products-grid');
    if (!contenedorGrid) return; 

    const esPaginaComputacion = window.location.pathname.includes('computacion');
    const seccionObjetivo = esPaginaComputacion ? 'computacion' : 'consolas';
    
    const productosFiltrados = productos.filter(p => p.categoriaPrincipal === seccionObjetivo);
    
    contenedorGrid.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedorGrid.innerHTML = `<p style="color: #aaa; grid-column: 1/-1; text-align: center; padding: 40px;">No hay productos disponibles activos en este momento.</p>`;
        return;
    }

    productosFiltrados.forEach(p => {
        const precioFormateado = p.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

        // Estructura limpia solicitada: Imagen, Título, Descripción, Precio Neto y Botón Único de Compra
        const tarjetaHTML = `
            <div class="product-card">
                <div class="product-img-box">
                    <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://unsplash.com'">
                </div>
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <p class="product-description">${p.descripcion}</p>
                    <p class="product-price">${precioFormateado}</p>
                    <button class="add-to-cart-btn" onclick="agregarAlCarrito('${p.id}', '${p.nombre}', ${p.precio})">
                        🛒 COMPRAR
                    </button>
                </div>
            </div>
        `;
        contenedorGrid.innerHTML += tarjetaHTML;
    });
}

// ====== BUSCADOR ASINCRÓNICO GLOBAL ======
function inicializarBuscadorGlobal() {
    const searchInputs = document.querySelectorAll('.search-area input');
    const searchButtons = document.querySelectorAll('.search-btn');

    function ejecutarBusqueda(texto) {
        const busqueda = texto.trim().toLowerCase();
        if (busqueda === '' || !window.catalogoGlobal) return;

        const encontrado = window.catalogoGlobal.find(p => p.nombre.toLowerCase().includes(busqueda));

        if (encontrado && encontrado.categoriaPrincipal !== '') {
            window.location.href = `${encontrado.categoriaPrincipal}.html`;
        } else {
            alert('No se encontraron productos activos con ese nombre.');
        }
    }

    searchButtons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); ejecutarBusqueda(searchInputs[idx].value); });
    });
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); ejecutarBusqueda(e.target.value); } });
    });
}

// Inicializador General al Cargar el sitio
document.addEventListener("DOMContentLoaded", () => {
    console.log("Catálogo automatizado de 08 Play John listo.");
    actualizarGloboCarrito();
    inicializarBuscadorGlobal();
    cargarProductosDesdeDrive();
});
