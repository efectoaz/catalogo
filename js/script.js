const minimoCompra = 50000; 
const ENVIO_MDP = 6900;
const ENVIO_GENERAL = 10900;
const ENVIO_LEJANO = 14900;
const ENVIO_SANTACRUZ = 15900;
const ENVIO_MIRAMAR= 0;
const ENVIO_GRATIS = 0;
const minimoRegalo = 70000;   
const REGALO_NOMBRE = "Chicles Fierita Globo (95 u)✨"; 
const PROMO_ACTIVA = "ninguna"; 
// "envio"  → envío gratis
// "regalo" → regalo 
// "ninguna" → sin promo

let productos = [];
let productoIndex = 0;
let currentVariantes = null;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const STOCK_PRODUCTOS = {
    "Ojotas clásicas blancas 🌊🏝️☀️": 5,
  "Botinetas galácticas": 2,
  "Ojotas con abrojo - Blancas": 1,
  "Animal print check! 🤎": 0
};


/*const variantesTransformer = [

  {
    img: "img/camiontra3.jpeg",
    nombre: "Camión Transformer (1 u)",
    precio: "$4.500"
  },
 
  {
    img: "img/autoblancotra.jpeg",
    nombre: "Auto Blanco (1 u)",
    precio: "$4.500"
  },

   {
    img: "img/autoblancoyazul.jpeg",
    nombre: "Auto Blanco y azul (1 u)",
    precio: "$4.500"
  },

  {
    img: "img/aviontra.jpeg",
    nombre: "Avión Transformer (1 u)",
    precio: "$4.500"
  },
  {
    img: "img/camionverdetra.jpeg",
    nombre: "Camión Verde Transformer (1 u)",
    precio: "$4.500"
  },
  {
    img: "img/avionnaranjatra.jpeg",
    nombre: "Avión Naranja Transformer (1 u)",
    precio: "$4.500"
  },
  {
   img: "img/autorojo.jpeg",
    nombre: "Auto Rojo Transformer (1 u)",
    precio: "$4.500"
  }
    
]; */


const productosVariantes = {

};

function cambiarVariante(el, direccion) {
  const card = el.closest('.card');

  const claseVariante = Object.keys(productosVariantes)
    .find(c => card.classList.contains(c));

  if (!claseVariante) return;

  const variantes = productosVariantes[claseVariante];

  let index = parseInt(card.dataset.index || "0");

  index += direccion;

  if (index < 0) index = variantes.length - 1;
  if (index >= variantes.length) index = 0;

  card.dataset.index = index;

  const v = variantes[index];

  card.querySelector("img").src = v.img;
  card.querySelector("h3").textContent = v.nombre;
  card.querySelector("p").textContent = v.precio;

  const btn = card.querySelector(".btn-carrito");
  btn.dataset.nombre = v.nombre;
  btn.dataset.precio = v.precio;
  const stock = STOCK_PRODUCTOS[v.nombre];

  // limpiar avisos viejos
  card.querySelector(".sin-stock-label")?.remove();
  card.querySelector(".ultimo-stock")?.remove();

  if (stock === 0) {
    const aviso = document.createElement("span");
    aviso.className = "sin-stock-label";
    aviso.textContent = "❌ Sin stock";
    card.appendChild(aviso);

    btn.disabled = true;
    btn.textContent = "Sin stock ❌";
  } else if (stock === 1) {
    const aviso = document.createElement("span");
    aviso.className = "ultimo-stock";
    aviso.textContent = "🔥 Última";
    card.appendChild(aviso);

    btn.disabled = false;
    btn.textContent = "Agregar al carrito";
  } else {
    btn.disabled = false;
    btn.textContent = "Agregar al carrito";
  }
}

function validarStock(nombre, carrito) {
  const stockMax = STOCK_PRODUCTOS[nombre];

  if (stockMax !== undefined) {
    const ex = carrito.find(p => p.nombre === nombre && p.talle === talleSeleccionado);
    const cantidadActual = ex ? ex.cantidad : 0;

    if (cantidadActual >= stockMax) {
      mostrarToast("⚠️ No hay más disponibles", "error");
      return false;
    }
  }

  return true;
}
const btn = document.getElementById("whatsapp-btn");

if (btn) {
  btn.addEventListener("click", () => {
    const mensaje = "Hola, vengo del catálogo y tengo una consulta...";
    
    const link = "https://wa.me/542291519731?text=" + encodeURIComponent(mensaje);
    
    window.open(link, "_blank");
  });
}
function calcularCostoEnvio(cp) {

  const codigo = cp.trim();

  if (codigo.startsWith("7607")) {
    return ENVIO_MIRAMAR;
  }

  const prefijos = ["9303", "4430",];

  for (const p of prefijos) {
    if (codigo.startsWith(p)) {
      return ENVIO_SANTACRUZ;
    }
  }

  if (codigo.startsWith("7600")) {
    return ENVIO_MDP;
  }

  if (
    codigo.startsWith("9") ||
    codigo.startsWith("4") ||
    codigo.startsWith("3") ||
    codigo.startsWith("6") ||
    codigo.startsWith("2000") ||
    codigo.startsWith("5965") ||
    codigo.startsWith("8")
  ) {
    return ENVIO_LEJANO;
  }

  return ENVIO_GENERAL;
}

// ========================
// MODAL DE PRODUCTOS
// ========================
const modal = document.getElementById('modal'); 
if (modal) {
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = modal.querySelector('.modal-content');

  const prevBtn = document.createElement('div');
  const nextBtn = document.createElement('div');

  const prevProdBtn = document.createElement('div');
  const nextProdBtn = document.createElement('div');

  prevBtn.textContent = '‹';
  nextBtn.textContent = '›';
  prevProdBtn.textContent = '←';
  nextProdBtn.textContent = 'Siguiente producto →';

  prevProdBtn.classList.add('prev-producto');
  nextProdBtn.classList.add('next-producto');
  prevBtn.classList.add('prev');
  nextBtn.classList.add('next');
 

  modalContent.appendChild(prevBtn);
  modalContent.appendChild(nextBtn);
  modalContent.appendChild(prevProdBtn);
  modalContent.appendChild(nextProdBtn);


  // Productos
 // Productos
  const imagenesProducto = {
    "Ojotas clásicas blancas 🌊🏝️☀️": ["img/ojotasblancas.jpg", "img/ojotasblancas2.jpg", "img/ojotasblancas3.jpg"],
    "Botinetas galácticas": ["img/boti1.jpg", "img/zapas.jpg", "img/boti2.jpg"],
    "Ojotas con abrojo - Blancas": ["img/abrojo1.jpg", "img/abrojo2.jpg"],
    "Animal print check! 🤎": ["img/animalPrint.jpg", "img/print1.jpg", "img/print2.jpg"],
    "Botas": ["img/bs1.jpg", "img/bs2.jpg", "img/bs3.jpg", "img/bs4.jpg"],
    "Botas 🤎": ["img/501.jpg", "img/502.jpg"]
   
  };
  
  let currentImages = [];
  let currentIndex = 0;
  let currentTitle = "";

  function abrirModal(card) {

  productoIndex = productos.indexOf(card);

  const titulo = card.querySelector('h3')?.textContent.trim();
  const stock = STOCK_PRODUCTOS[titulo];

  
  const img = card.querySelector('img');
  const title = card.querySelector('h3');
  const price = card.querySelector('p');

 currentTitle = title ? title.textContent : "Producto";

  const claseVariante = Object.keys(productosVariantes)
  .find(c => card.classList.contains(c));

  if (claseVariante) {
    currentVariantes = productosVariantes[claseVariante];
    currentImages = currentVariantes.map(v => v.img);
    currentTitle = currentVariantes[0].nombre;
  } else {
    currentVariantes = null;
    currentImages = imagenesProducto[currentTitle] || [img?.src || ''];
  }

  currentIndex = parseInt(card.dataset.index || "0");

  modal.style.display = 'flex';
  actualizarModal();

  modalTitle.textContent = currentTitle;
  document.getElementById('modal-precio').textContent = price ? price.textContent : '';
  const talleSelect = document.querySelector("#modal .talle-calzado");

  if (!talleSelect) return;

  talleSelect.innerHTML = '<option value="">Seleccioná un talle</option>';

  const talles = card.dataset.talles;

  if (talles) {
    talles.split(",").forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.trim();
      opt.textContent = t.trim();
      talleSelect.appendChild(opt);
    });
  }

  const modalAgregarBtn = document.getElementById('modal-agregar');

  //  SI ES PROMO → SOLO OCULTA EL BOTÓN Y AGRANDA EL MODAL
  if (card.classList.contains('promo')) {
    modalAgregarBtn.style.display = 'inline-block'; 
    modal.classList.add('fullscreen'); // ✨ clase para agrandar modal
  } else {
    modalAgregarBtn.style.display = 'inline-block';
    modalAgregarBtn.dataset.producto = currentTitle;
    modalAgregarBtn.dataset.precio = price ? price.textContent : '';
    modal.classList.remove('fullscreen'); // asegura tamaño normal para otros
  }

}
function actualizarModal() {
  const media = currentImages[currentIndex] || '';

  if (media.endsWith(".mp4")) {
    modalImg.style.display = "none";

    let video = document.getElementById("modal-video");

    if (!video) {
      video = document.createElement("video");
      video.id = "modal-video";
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.controls = false;
      video.addEventListener("click", () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");

      video.style.width = "100%";
      video.style.borderRadius = "10px";

      modalImg.parentElement.appendChild(video);
    }

    video.src = media;
    video.classList.remove("video-ojos");

    if (media.includes("videoojos")) {
      video.classList.add("video-ojos");
    }
    video.style.display = "block";

  } else {
    modalImg.style.display = "block";
    modalImg.src = media;

    const video = document.getElementById("modal-video");
    if (video) {
      video.style.display = "none";
      video.pause();
    }
  }

  const modalAgregarBtn = document.getElementById('modal-agregar');

  //  VARIANTES 
  if (currentVariantes) {
    const variante = currentVariantes[currentIndex];

    modalTitle.textContent = variante.nombre;
    document.getElementById('modal-precio').textContent = variante.precio;

    modalAgregarBtn.dataset.producto = variante.nombre;
    modalAgregarBtn.dataset.precio = variante.precio;

  } else {
    //  PRODUCTO NORMAL
    modalTitle.textContent = currentTitle;

    modalAgregarBtn.dataset.producto = currentTitle;
    modalAgregarBtn.dataset.precio = document.getElementById('modal-precio').textContent;
  }

  //  Flechas 
  if (currentImages.length > 1) {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  // Reset zoom 
  modalImg.classList.remove('zoomed');
}

  prevBtn.onclick = () => {
    if (currentImages.length > 1) {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      actualizarModal();
    }
  };

  nextBtn.onclick = () => {
    if (currentImages.length > 1) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      actualizarModal();
    }
  };

  prevProdBtn.onclick = () => {
  productoIndex = (productoIndex - 1 + productos.length) % productos.length;
  abrirModal(productos[productoIndex]);
  };

  nextProdBtn.onclick = () => {
    productoIndex = (productoIndex + 1) % productos.length;
    abrirModal(productos[productoIndex]);
  };
  modalImg.onclick = () => {
    if (currentImages.length > 1) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      actualizarModal();
      return;
    }
    modalImg.classList.toggle('zoomed');
    if (modalImg.classList.contains("zoomed")) {
    currentX = 0;
    currentY = 0;
    modalImg.style.setProperty("--x", "0px");
    modalImg.style.setProperty("--y", "0px");
  }
  };

  const closeBtn = modal.querySelector('.close');

  let bloqueandoCierre = false;

  function cerrarModal() {
  bloqueandoCierre = true;

  modal.style.display = 'none';
  modalImg.classList.remove('zoomed');

  const cardActual = productos[productoIndex];

    if (cardActual) {
      setTimeout(() => {
        cardActual.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 50);
    }

    setTimeout(() => {
      bloqueandoCierre = false;
    }, 300);
  }

  // Botón cerrar
  if (closeBtn) {
    closeBtn.onclick = cerrarModal;
  }

  // Click afuera del contenido (en cualquier parte de la pantalla)
  document.addEventListener('click', e => {
    if (bloqueandoCierre) return;

    if (modal.style.display === 'flex' && !modalContent.contains(e.target)) {
      cerrarModal();
    }
  });

  // Tecla ESC
  document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
      cerrarModal();
    }
  });

  productos = Array.from(document.querySelectorAll('.card'))
  .filter(card => card.offsetParent !== null);

  const cards = document.querySelectorAll('.card');
 
  cards.forEach(card => {
 
    const titulo = card.querySelector('h3')?.textContent || '';
    const stock = STOCK_PRODUCTOS[titulo] ?? null;
    const select = card.querySelector(".talle-calzado");
    const talles = card.dataset.talles?.split(",") || [];

    if (select && talles.length) {
      select.innerHTML = '<option value="">Seleccioná un talle</option>';

      talles.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.trim();
        opt.textContent = t.trim();
        select.appendChild(opt);
      });
    }

    //  Si el stock es 0 → ocultar producto
    if (stock === 0) {
      card.classList.add("sin-stock");

      const aviso = document.createElement('span');
      aviso.className = 'sin-stock-label';
      aviso.textContent = "❌ Sin stock";

      card.appendChild(aviso);
    }
      
    // Si queda 1 → mostrar aviso
    if (stock === 1) {
      const aviso = document.createElement('span');
      aviso.className = 'ultimo-stock';
      aviso.textContent = "🔥 Última";
      card.appendChild(aviso);
    }


    const cantidadImgs = imagenesProducto[titulo]?.length || 1;
    //  indicador visual de que hay más
    if (cantidadImgs > 1) {
      card.classList.add("tiene-mas");
    }
    
    card.addEventListener('click', (ev) => {
       ev.stopPropagation();

    const titulo = card.querySelector('h3')?.textContent.trim();
    const stock = STOCK_PRODUCTOS[titulo];

    //  
    const sinStock = stock === 0;

    if (card.classList.contains('promo')) return;
    if (ev.target.closest('.btn-carrito')) return;
    if (ev.target.classList.contains("flecha")) return;
    if (ev.target.closest("select")) return;
      
    abrirModal(card);
  });
  });
}

// ========================
// BUSCADOR DE PRODUCTOS
// ========================
document.addEventListener("DOMContentLoaded", () => {
  sincronizarCarritoConHTML();

  const searchInput = document.getElementById("search");
  const cards = document.querySelectorAll(".card");
  const noResults = document.getElementById("no-results");

  if (!searchInput || cards.length === 0) return;

  function filtrarProductos() {
    const filter = searchInput.value.toLowerCase().trim();
    let matches = 0;

    cards.forEach(card => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || '';
      const desc = card.querySelector("p")?.textContent.toLowerCase() || "";

      if (title.includes(filter) || desc.includes(filter)) {
        card.style.display = "block";
        matches++;
      } else {
        card.style.display = "none";
      }
    });

    if (noResults) {
      if (matches === 0 && filter.length > 0) {
        noResults.textContent = "No encontramos tu producto, escribinos";
        noResults.style.display = "block";
      } else {
        noResults.style.display = "none";
      }
    }
  }

  searchInput.addEventListener("input", filtrarProductos);
  searchInput.addEventListener("keyup", filtrarProductos);
});

// ========================
// TOAST
// ========================
function mostrarToast(mensaje, tipo = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = mensaje;
  toast.className = "toast " + tipo;

  toast.style.display = "block";
  toast.classList.add("show");

  // Cerrar al hacer click
  toast.onclick = () => {
    toast.classList.remove("show");
    setTimeout(() => toast.style.display = "none", 200);
  };

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.style.display = "none", 400);
  }, 800);
}


  function lanzarConfetti() {
  const canvas = document.createElement("canvas");

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";

  document.body.appendChild(canvas);

  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true
  });

  myConfetti({
    particleCount: 1500,
    spread: 190,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    canvas.remove();
  }, 4500);
}

// ========================
// ZOOM EN IMAGEN DEL MODAL
// ========================
const modalImgZoom = document.getElementById("modal-img");
if (modalImgZoom) {
  modalImgZoom.onclick = () => modalImgZoom.classList.toggle("zoomed");
}

// ========================
// FUNCIONES DE CARRITO
// ========================
document.addEventListener("DOMContentLoaded", () => {

  const numero = "542291570129";

  const carritoBtn = document.getElementById("carrito-btn");
  const carritoDropdown = document.getElementById("carrito-dropdown");
  const carritoItemsContainer = document.getElementById("carrito-items");
  const carritoCount = document.getElementById("carrito-count");
  
  if (carritoCount) {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    carritoCount.textContent = total;
  }

  const vaciarBtn = document.getElementById("vaciar-carrito");
  const carritoTotal = document.getElementById("carrito-total");

  const fondoModal = document.createElement("div");
  fondoModal.id = "fondo-carrito";
  Object.assign(fondoModal.style, {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "none", zIndex: "998"
  });
  document.body.appendChild(fondoModal);

  Object.assign(carritoDropdown.style, {
    zIndex: "999", position: "fixed",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
    borderRadius: "12px", background: "white",
    display: "none", padding: "15px", width: "300px",
  });

  const parsePrecio = p => parseFloat(p.replace(/[^\d,]/g,"").replace(/\./g,"").replace(",","."))||0;
  const calcularTotal = () => carrito.reduce((a,i)=>a+parsePrecio(i.precio)*i.cantidad,0);

  function actualizarCarrito() {
    carritoItemsContainer.innerHTML = carrito.length === 0
      ? "<p class='carrito-vacio'>Tu carrito está vacío 🛒</p>"
      : carrito.map(i=>`
        <div class='carrito-item'>
         <strong>${i.nombre}</strong> (Talle: ${i.talle}) ${i.precio || "$0"}<br>
          <button class='cantidad-btn restar' data-nombre='${i.nombre}'>-</button>
          ${i.cantidad}
          <button class='cantidad-btn sumar' data-nombre='${i.nombre}'>+</button>
        </div>
      `).join("");

    const total = calcularTotal();
    carritoCount.textContent = carrito.reduce((a,i)=>a+i.cantidad,0) || 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));

    const totalProductos = carrito.reduce((a,i)=>a+i.cantidad,0);
    carritoTotal.innerHTML = `
      <strong>- Cantidad de productos: ${totalProductos}</strong><br>
      <strong>- Total: $${total.toLocaleString("es-AR")}</strong>
    `;

    actualizarAvisoEnvioGratis(total);

    let carritoTimer;

    function iniciarTemporizadorCierre() {
      clearTimeout(carritoTimer);

      if (carritoDropdown.style.display === "block") {
        carritoTimer = setTimeout(() => {
          carritoDropdown.style.display = "none";
          fondoModal.style.display = "none";
        }, 30000); 
      }
    }

    // PRECIO
    document.querySelectorAll(".card").forEach(card => {
    const nombre = card.querySelector("h3")?.textContent.trim();
    const precio = card.querySelector("p")?.textContent.trim();
    const btn = card.querySelector(".btn-carrito");

    if (btn) {
      btn.dataset.nombre = nombre;
      btn.dataset.precio = precio;
    }
  });
    carritoDropdown.addEventListener("mouseenter", () => clearTimeout(carritoTimer));
    carritoDropdown.addEventListener("mouseleave", iniciarTemporizadorCierre);

    carritoBtn?.addEventListener("click", iniciarTemporizadorCierre);
    document.querySelectorAll(".card").forEach(card => {
    const titulo = card.querySelector("h3")?.textContent.trim();
    const stockMax = STOCK_PRODUCTOS[titulo];

    const item = carrito.find(p => p.nombre === titulo);
    const cantidad = item ? item.cantidad : 0;

    const btn = card.querySelector(".btn-carrito");
    if (!btn) return;

    if (stockMax === 0) {
      btn.disabled = true;
      btn.textContent = "Sin stock ❌";
      return;
    }

    if (stockMax !== undefined && cantidad >= stockMax) {
      btn.disabled = true;
      btn.textContent = "Agotado 🛒";
    } else {
      btn.disabled = false;
      btn.textContent = "Agregar al carrito";
    }
  });
  }

  carritoBtn?.addEventListener("click", () => {
     const modal = document.getElementById("modal");
      if (modal && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    const visible = window.getComputedStyle(carritoDropdown).display === "block";

    carritoDropdown.style.display = visible ? "none" : "block";
    fondoModal.style.display = visible ? "none" : "block";

    const whatsappBtn = document.getElementById("whatsapp-btn");

    if (visible) {
      whatsappBtn.classList.remove("oculto");
    } else {
      whatsappBtn.classList.add("oculto");
    }
  });

  fondoModal.addEventListener("click",()=>{
    carritoDropdown.style.display="none";
    fondoModal.style.display="none";

    document.getElementById("whatsapp-btn").classList.remove("oculto");
  });

  function cerrarModal() {
    carritoDropdown.style.display = "none";
    fondoModal.style.display = "none";

    document.getElementById("whatsapp-btn").classList.remove("oculto");
  }

  document.getElementById("salir-carrito")?.addEventListener("click", cerrarModal);

  vaciarBtn?.addEventListener("click",()=>{
  carrito = [];
  actualizarCarrito();
  carritoCount.textContent = 0;
});

  document.addEventListener("click",e=>{
    if (e.target.classList.contains("sumar")) {
    const nombre = e.target.dataset.nombre;
    const item = carrito.find(p => p.nombre === nombre);

    if (!validarStock(nombre, carrito)) return;

    if (item) item.cantidad++;
    carritoCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }

    if(e.target.classList.contains("restar")){

      const item=carrito.find(p=>p.nombre===e.target.dataset.nombre);
      if (item) {
        item.cantidad > 1
          ? item.cantidad--
          : carrito = carrito.filter(p => p.nombre !== item.nombre);

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        carritoCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      }
    }
    if(e.target.classList.contains("carrito-eliminar")){
      carrito=carrito.filter(p=>p.nombre!==e.target.dataset.nombre);
    }
    actualizarCarrito();
  });

  document.querySelectorAll(".btn-carrito, #modal-agregar")
    .forEach(btn => {
      btn.addEventListener("click", e => {
        console.log("CLICK DETECTADO");
        e.stopPropagation();
        const card = btn.closest(".card");
        let nombre, precio;
        let talleSeleccionado = null;

        // 🔹 Si viene desde una card
       if (card) {
        const select = card.querySelector(".talle-calzado");
        if (select) {

          talleSeleccionado = select.value;
        }
      }
        // 🔹 Si viene desde el modal
        else {
          const select = document.querySelector("#modal .talle-calzado");
          if (select) {
            talleSeleccionado = select.value;
          }
        }

        // ❌ VALIDACIÓN
        if (talleSeleccionado === "" || talleSeleccionado === null) {
          mostrarToast("⚠️ Seleccioná un talle antes de agregar", "error");
          return;
        }
          console.log("DATASET:", btn.dataset.nombre, btn.dataset.precio);
        //  Si el botón tiene data → usar eso (producto dinámico)
        if (btn.dataset.nombre && btn.dataset.precio) {
          nombre = btn.dataset.nombre;
          precio = btn.dataset.precio;
        } else {
          nombre = card?.querySelector("h3")?.textContent.trim() 
                || document.getElementById("modal-title")?.textContent.trim();

         precio = card?.querySelector("p")?.textContent.trim() 
  || document.getElementById("modal-precio")?.textContent.trim();
        }
       if (true) {

            // 🔒 validar talle SOLO en modal
            if (!talleSeleccionado) {
              mostrarToast("⚠️ Seleccioná un talle antes de agregar", "error");
              return;
            }

            const stockMax = STOCK_PRODUCTOS[nombre];
            const ex = carrito.find(p => p.nombre === nombre && p.talle === talleSeleccionado);

            if (stockMax !== undefined) {
              const cantidadActual = ex ? ex.cantidad : 0;

              if (cantidadActual >= stockMax) {
                mostrarToast("⚠️ No hay más disponibles", "error");
                return;
              }
            }

          if (ex) {
            ex.cantidad++;
          } else {
            carrito.push({ nombre, precio, cantidad: 1, talle: talleSeleccionado });
          }

          carritoCount.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
         
           animarCarrito();

          // 🔁 detectar de dónde viene
          let img;

          if (card) {
            img = card.querySelector("img");
          } else {
            img = document.getElementById("modal-img");
          }

          if (img) volarAlCarrito(img);

          if (stockMax !== undefined) {

            const productoEnCarrito = carrito.find(p => p.nombre === nombre);
            const cantidadActual = productoEnCarrito ? productoEnCarrito.cantidad : 0;
          }
          actualizarCarrito();
        }
      });
    actualizarAvisoEnvioGratis(calcularTotal());
    });

document.getElementById("enviar-carrito")?.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 🛒");
    return;
  }

  let msg = "🛍️ *Quiero comenzar este pedido:*\n\n";
  let total = 0;
  let totalProductos = 0;
  let costoEnvio = 0;

  // Productos
  carrito.forEach(i => {
    const precioUnitario = parsePrecio(i.precio);
    const subtotal = precioUnitario * i.cantidad;
    total += subtotal;
    totalProductos += i.cantidad;

    if (i.cantidad > 1) {
      msg += `• *${i.nombre}* — *${i.cantidad}* x ${i.precio} → *$${subtotal.toLocaleString("es-AR")}*\n`;
    } else {
      msg += `• *${i.nombre}* — ${i.precio}\n`;
    }
  });

  //  Compra mínima
  if (total < minimoCompra) {
    alert(`⚠️ La compra mínima es de $${minimoCompra.toLocaleString("es-AR")}`);
    return;
  }

  //  Abrir modal de código postal
  const modalCP = document.getElementById("modal-cp");
  const inputCP = document.getElementById("cp-input");

  const cpGuardado = localStorage.getItem("codigoPostalCliente");

  if (cpGuardado) {
    inputCP.value = cpGuardado;
  } else {
    inputCP.value = "";
  }

  modalCP.style.display = "flex";

  //  Esperar confirmación del usuario

  // Botón cancelar del modal de código postal
  const cpCancelar = document.getElementById("cp-cancelar");
  if (cpCancelar) {
    cpCancelar.onclick = () => {
      const modalCP = document.getElementById("modal-cp");
      if (modalCP) {
        modalCP.style.display = "none"; // cierra el modal
      }
    };
  }

  // Botón confirmar código postal
  const btnRetirarMiramar = document.getElementById("retirar-miramar");

  btnRetirarMiramar?.addEventListener("click", () => {

    const costoEnvio = 0; // Igual que Miramar
    const totalFinal = total + costoEnvio;

    let mensajeRegalo = "";

    if (PROMO_ACTIVA === "regalo" && total >= minimoRegalo) {
      mensajeRegalo = `\n🎁 ¡Tu compra incluye: ${REGALO_NOMBRE} de regalo!`;
    }

    msg += mensajeRegalo;
    totalProductos += (PROMO_ACTIVA === "regalo" && total >= minimoRegalo) ? 1 : 0;
    msg += `\n📦 *Total de productos:* ${totalProductos}`;
    msg += `\n🚚 *Envío:* $0`;
    msg += `\n\n💳 *Total a pagar:* $${totalFinal.toLocaleString("es-AR")}`;

    msg += `\n\n📍 *Retiro en Miramar*`;

    const numero = "542291570129";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    modalCP.style.display = "none";
  });

  const cpConfirmar = document.getElementById("cp-confirmar");
  cpConfirmar.onclick = () => {
    const codigoPostalCliente = inputCP.value.trim();
    localStorage.setItem("codigoPostalCliente", codigoPostalCliente);
    const esMiramar = codigoPostalCliente.startsWith("7607");


    if (!codigoPostalCliente) {
      alert("⚠️ Por favor, ingresá tu código postal.");
      return;
    }

    //  Validación de código postal
    if (!/^\d{4,8}$/.test(codigoPostalCliente)) {
      alert("⚠️ Código postal inválido. Ingresá solo números (4 a 8 dígitos).");
      return;
    }

    let costoEnvio;

    if (PROMO_ACTIVA === "envio" && total >= 80000) {
      costoEnvio = 0;
    } else {
      costoEnvio = calcularCostoEnvio(codigoPostalCliente);
    }

    const totalFinal = total + costoEnvio;

    let mensajeRegalo = "";

    if (PROMO_ACTIVA === "regalo" && total >= minimoRegalo) {
        mensajeRegalo = `\n🎁 ¡Tu compra incluye: ${REGALO_NOMBRE} de regalo!`;
    } else {
        mensajeRegalo = ""; 
    }

    msg += mensajeRegalo;
    totalProductos += (PROMO_ACTIVA === "regalo" && total >= minimoRegalo) ? 1 : 0;
    msg += `\n📦 *Total de productos:* ${totalProductos}`;
    msg += `\n🚚 *Envío:* $${costoEnvio.toLocaleString("es-AR")}`;
    msg += `\n\n💳 *Total a pagar (con envío incluido):* $${totalFinal.toLocaleString("es-AR")}`;

    if (esMiramar) {
    msg += `\n\n📍 *Entrega en Miramar*`;
    
  } else {
    msg += `\n\n codigo postal: ${codigoPostalCliente}`;
    msg += `\n\n✨ *¡Tu pedido ya está listo!*`;
    msg += `\nSolo tocá *Enviar* y te respondemos enseguida para coordinar 💌`;
        /*
    msg += `\n- Alguna referencia del domicilio (opcional): `;
    msg += `\n- Teléfono: `;
    msg += `\n- Email: `; 
    msg += `\n- Dirección exacta: `;
    msg += `\n- Provincia y Localidad: `;
    msg += `\n- Nombre y apellido: `;
    msg += `\n\n📩 *Datos necesarios para el envío (Si ya completaste alguna vez, podés omitirlo)👆🏻*`;
    */
  }

    // 🔹 Abrir WhatsAppp
    const numero = "542236010443";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    // 🔹 Cerrar modal
    modalCP.style.display = "none";
  };
});
});

// ========================
// AVISO ENVÍO GRATIS
// ========================
const estadoEnvio = {
  toastMostrado: false
};

function actualizarAvisoEnvioGratis(total = 0, envioManualGratis = false) {
  const aviso = document.getElementById("aviso-envio-gratis");
  if (!aviso) {
    console.warn("No existe el elemento #aviso-envio-gratis");
    return;
  }

  aviso.style.display = "none";

  // Asegurarse de que estadoEnvio existe
  if (typeof estadoEnvio === "undefined") window.estadoEnvio = { toastMostrado: false };

  total = Number(total) || 0;

  console.log("PROMO_ACTIVA:", PROMO_ACTIVA, "total:", total);

  if (PROMO_ACTIVA === "regalo") {
  if (total >= minimoRegalo) {
    aviso.innerHTML = `🎁 <strong>¡Tu compra incluye: ${REGALO_NOMBRE} de regalo!</strong>`;

    if (!estadoEnvio.toastMostrado) {
      mostrarToast("🎁 ¡Ganaste un regalo! ✨", "fiesta");
      lanzarConfetti();
      estadoEnvio.toastMostrado = true;
        }

      } else {
        const falta = minimoRegalo - total;
        aviso.innerHTML = `🎁 Sumá <strong>$${falta.toLocaleString("es-AR")}</strong> y llevate un regalo!`;

        // reset
        estadoEnvio.toastMostrado = false;
      }

      aviso.style.display = "block";
      return;
    }

  if (PROMO_ACTIVA === "envio") {
    if (envioManualGratis || total >= 80000) {
      aviso.innerHTML = "🎉 <strong>¡Tenés envío gratis!</strong>";
      aviso.style.display = "block";

      if (!estadoEnvio.toastMostrado) {
        mostrarToast("🎉 Tenés envío gratis! ✨", "fiesta");
        lanzarConfetti();
        estadoEnvio.toastMostrado = true; 
      }
    } else {
      const falta = 80000 - total;
      aviso.innerHTML = `Sumá <strong>$${falta.toLocaleString("es-AR")}</strong> y conseguí <b>envío gratis</b>`;
      aviso.style.display = "block";
      // reset
      estadoEnvio.toastMostrado = false;
    }
    aviso.style.display = "block";
    return;
  }

  if (PROMO_ACTIVA === "ninguna") {
    if (total < minimoCompra) {
      aviso.innerHTML = `🛍️ Compra mínima $${minimoCompra.toLocaleString("es-AR")}✨`;
      aviso.style.display = "block";
    } 
    else {
      aviso.innerHTML = `🛍️ Compra mínima $${minimoCompra.toLocaleString("es-AR")}✨`;
      aviso.style.display = "block";
    }
  }
}

// ========================
// SINCRONIZAR CARRITO CON PRODUCTOS DEL HTML 
// ========================
function sincronizarCarritoConHTML() {

  if (carrito.length === 0) return; // nada que sincronizar

  // 🔹 Función para normalizar nombres y evitar problemas de coincidencia
  function normalizarNombre(nombre) {
    return nombre.replace(/\s+/g, " ").trim().toLowerCase();
  }

  // 🔹 Leer productos actuales del HTML
  const productosHTML = {};
  const cards = document.querySelectorAll(".card");
  if (cards.length === 0) return; // si no hay productos, no toca el carrito

  cards.forEach(card => {
    const nombre = card.querySelector("h3")?.innerText || "";
    const precioTexto = card.querySelector("p")?.innerText || "";

    if (nombre && precioTexto) {
      const precio = parseFloat(
        precioTexto.replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")
      );
      productosHTML[normalizarNombre(nombre)] = precio;
    }
  });

  let cambios = false;

  // 🔹 Validar carrito
  carrito = carrito.filter(item => {
    const nombreItem = normalizarNombre(item.nombre);
    const precioActual = productosHTML[nombreItem];
    

    // Producto eliminado → se quita del carrito
    if (precioActual === undefined) {
      cambios = true;
      return false;
    }

    // 🔥 NUEVO: validar stock real
    const stock = STOCK_PRODUCTOS[item.nombre];

    // ❌ si no hay stock → eliminar del carrito
    if (stock === 0) {
      cambios = true;
      return false;
    }

    // ❌ si supera stock → ajustar cantidad
    if (stock !== undefined && item.cantidad > stock) {
      item.cantidad = stock;
      cambios = true;
    }

    // Precio cambiado → se actualiza
    const precioCarrito = parseFloat(
      (item.precio || "").replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")
    ) || 0;

    if (precioCarrito !== precioActual) {
      item.precio = `$${precioActual.toLocaleString("es-AR")}`;
      cambios = true;
    }

    return true;
  });

  // Guardar carrito actualizado
  if (cambios) localStorage.setItem("carrito", JSON.stringify(carrito));
  

  // 🔹 Actualizar UI inmediatamente
  const carritoCount = document.getElementById("carrito-count");
  const carritoTotal = document.getElementById("carrito-total");

  if (carritoCount) {
    const totalProductos = carrito.reduce((a, i) => a + i.cantidad, 0);
    carritoCount.textContent = totalProductos;
  }

  if (carritoTotal) {
    const total = carrito.reduce((a, i) => {
      const precio = parseFloat(
        (i.precio || "").replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")
      ) || 0;
      return a + precio * i.cantidad;
    }, 0);

    carritoTotal.innerHTML = `
      <strong>- Cantidad de productos: ${carrito.reduce((a, i) => a + i.cantidad, 0)}</strong><br>
      <strong>- Total: $${total.toLocaleString("es-AR")}</strong>
    `;
  }
}
// Arrastrar zoom
let isDragging = false;
let lastX = 0;
let lastY = 0;
let currentX = 0;
let currentY = 0;

const modalImg = document.querySelector(".modal-content img");

if (modalImg) {
  modalImg.addEventListener("mousedown", (e) => {
  if (!modalImg.classList.contains("zoomed")) return;

  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;

  modalImg.style.cursor = "grabbing";
});
  
}
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  currentX += dx;
  currentY += dy;

  lastX = e.clientX;
  lastY = e.clientY;

  // límite (opcional, ajustá si querés)
  const maxMove = 200;
  currentX = Math.max(-maxMove, Math.min(maxMove, currentX));
  currentY = Math.max(-maxMove, Math.min(maxMove, currentY));

  modalImg.style.setProperty("--x", currentX + "px");
  modalImg.style.setProperty("--y", currentY + "px");
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  modalImg.style.cursor = "grab";
});


document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {

    // mostrar flechas
    card.classList.add("mostrar-flechas");

    // ocultarlas después de 2 segundos
    setTimeout(() => {
      card.classList.remove("mostrar-flechas");
    }, 2000);
  });
});


let videoActivo = null;

document.querySelectorAll(".card-video").forEach(card => {
  const video = card.querySelector("video");
  const icon = card.querySelector(".sound-icon");

  if (!video || !icon) return;

  video.muted = true;
  video.playsInline = true;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.6 });

  observer.observe(video);

  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    // 🔴 apagar anterior
    if (videoActivo && videoActivo !== video) {
      videoActivo.muted = true;

      const oldCard = videoActivo.closest(".card-video");
      const oldIcon = oldCard.querySelector(".sound-icon");

      oldCard.classList.remove("audio-activo");
      oldIcon.textContent = "🔊";
    }

    // 🔁 toggle actual
    if (video.muted) {
      video.muted = false;
      icon.textContent = "🔊";
      card.classList.add("audio-activo");
      videoActivo = video;
    } else {
      video.muted = true;
      icon.textContent = "🔇";
      card.classList.remove("audio-activo");
      videoActivo = null;
    }
  });
});


const menuBtn = document.getElementById("menu-btn");
const menuPanel = document.getElementById("menu-panel");
const menuCatalogo = document.getElementById("menu-catalogo");

if (menuBtn && menuPanel) {
  menuBtn.addEventListener("click", () => {
    menuPanel.classList.toggle("active");
  });
}
if (menuCatalogo) {
  menuCatalogo.addEventListener("click", (e) => {
  e.preventDefault();

  if (window.location.pathname.includes("contacto.html")) {
    window.location.href = "index.html";
  } else {
    window.location.href = "contacto.html";
  }
});
}

function animarCarrito() {
  const btn = document.getElementById("carrito-btn");
  const count = document.getElementById("carrito-count");

  // animación botón
  btn.classList.remove("anim-agregar");
  void btn.offsetWidth; // reinicia animación
  btn.classList.add("anim-agregar");

  // animación contador
  count.classList.remove("anim");
  void count.offsetWidth;
  count.classList.add("anim");
}

function volarAlCarrito(img) {
  const carrito = document.getElementById("carrito-btn");
  const clone = img.cloneNode(true);

  const rect = img.getBoundingClientRect();
  const carritoRect = carrito.getBoundingClientRect();

  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.width = rect.width + "px";
  clone.style.zIndex = 9999;
  clone.style.transition = "all 0.6s ease";

  document.body.appendChild(clone);

  setTimeout(() => {
    clone.style.left = carritoRect.left + "px";
    clone.style.top = carritoRect.top + "px";
    clone.style.width = "20px";
    clone.style.opacity = "0.5";
  }, 10);

  setTimeout(() => clone.remove(), 600);
}

function renderCarritoUI() {
  const carritoCount = document.getElementById("carrito-count");

  const totalProductos = carrito.reduce((a, i) => a + i.cantidad, 0);

  if (carritoCount) {
    carritoCount.textContent = totalProductos;
  }
}


// Selecciona todos los links dentro de .footer-credito
document.querySelectorAll('.footer-credito a').forEach(el => {

  // Escucha el click en cada link
  el.addEventListener('click', function(e) {

    // Detecta si el dispositivo es táctil (sin hover, típico de móviles)
    if (window.matchMedia("(hover: none)").matches) {

      // Evita que el link navegue inmediatamente
      e.preventDefault();

      // 🔽 Cierra cualquier tooltip que esté abierto
      document.querySelectorAll('.footer-credito a')
        .forEach(a => a.classList.remove('active'));

      // 🔼 Activa el tooltip del elemento tocado
      this.classList.add('active');

      // ⏱️ Después de 2 segundos, lo cierra automáticamente
      setTimeout(() => {
        this.classList.remove('active');
      }, 2000);
    }
  });
});

