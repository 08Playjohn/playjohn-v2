// LINK DE TU GOOGLE SHEET (Recordá usar el enlace que termina en .csv de "Publicar en la web")
const URL_DRIVE_CSV = "https://script.google.com/macros/s/AKfycbwqPdUzWDOJAtaputLJC2ebosxGuLkrkBxOFQu08PxvhenV3iUEcYYV2hGLdhJl5-Kx/exec";

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

// ====== LECTOR DINÁMICO ADAPTADO A TU DRIVE ======
async function cargarProductosDesdeDrive() {
    try {
        const respuesta = await fetch(URL_DRIVE_CSV);
        const datosTexto = await respuesta.text();
        
        // Dividimos por filas y salteamos la primera (encabezados)
        const filas = datosTexto.split('\n').slice(1); 
        const productos = [];

        filas.forEach((fila, index) => {
            // Usamos una expresión regular para separar por comas de forma segura por si hay comas en las descripciones
            const columnas = fila.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || fila.split(',');
            
            // Verificamos que la fila tenga al menos los datos hasta la columna L (mínimo 12 columnas)
            if (columnas.length >= 12) {
                
                // Limpiamos comillas y espacios de los textos extraídos
                const nombreProd = columnas[0].replace(/"/g, '').trim();
                const precioProd = columnas[6].replace(/"/g, '').replace(/[^0-9.]/g, '').trim();
                const subcategoria = columnas[9].replace(/"/g, '').trim().toUpperCase();
                const visibleWeb = columnas[11].replace(/"/g, '').trim().toLowerCase();
                
                // Condicionador dinámico de visibilidad (Columna L)
                if (visibleWeb === 'si' && nombreProd !== "") {
                    
                    // Agrupador inteligente de categorías principales
                    let categoriaGeneral = '';
                    const listaConsolas = ['PS2', 'PS3', 'PS4', 'PS5', 'XBOX 360', 'NINTENDO WII'];
                    const listaComputacion = ['COMPUTACION', 'AURICULARES', 'CABLES', 'MOUSES', 'TECLADOS'];

                    if (listaConsolas.includes(subcategoria)) {
                        categoriaGeneral = 'consolas';
                    } else if (listaComputacion.includes(subcategoria)) {
                        categoriaGeneral = 'computacion';
                    }

                    productos.push({
                        id: `prod_${index}`, // Generamos un ID único basado en la fila
                        nombre: nombreProd,
                        precio: precioProd ? parseFloat(precioProd) : 0,
                        subcategoria: subcategoria,
                        categoriaPrincipal: categoriaGeneral,
                        imagen: "https://unsplash.com" // Colocá una por defecto por ahora
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

// ====== RENDERIZADOR AUTOMÁTICO EN LAS GRILLAS ======
function renderizarProductosEnPantalla(productos) {
    const contenedorGrid = document.querySelector('.products-grid');
    if (!contenedorGrid) return; 

    // Detectamos en qué página web está parado el usuario actualmente
    const esPaginaComputacion = window.location.pathname.includes('computacion');
    const seccionObjetivo = esPaginaComputacion ? 'computacion' : 'consolas';
    
    // Filtramos los artículos que correspondan a esta sección del sitio
    const productosFiltrados = productos.filter(p => p.categoriaPrincipal === seccionObjetivo);
    
    contenedorGrid.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedorGrid.innerHTML = `<p style="color: #aaa; grid-column: 1/-1; text-align: center; padding: 40px;">No hay productos disponibles para mostrar en esta sección.</p>`;
        return;
    }

    // Inyectamos las tarjetas de forma dinámica
    productosFiltrados.forEach(p => {
        const precioFormateado = p.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
        
        const tarjetaHTML = `
            <div class="product-card">
                <div class="product-img-box">
                    <img src="${p.imagen}" alt="${p.nombre}">
                </div>
                <div class="product-info">
                    <span style="font-size: 10px; color: #8c00ff; font-weight: bold; text-transform: uppercase;">${p.subcategoria}</span>
                    <h3>${p.nombre}</h3>
                    <p class="product-price">${precioFormateado}</p>
                    <button class="add-to-cart-btn" onclick="agregarAlCarrito('${p.id}', '${p.nombre}', ${p.precio})">Agregar al Carrito 🛒</button>
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

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    actualizarGloboCarrito();
    cargarProductosDesdeDrive();
    inicializarBuscadorGlobal();
});
