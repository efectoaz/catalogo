const minimoCompra = 10000;   // Compra mínima
const minimoRegalo = 50000;   // Desde este total se activa el regalo
const REGALO_NOMBRE = "Pote Gomitas de Ojos (30 unidades)";


const ENVIO_MIRAMAR = 0;
const ENVIO_MDP = 5500;
const ENVIO_GENERAL = 10000;
const ENVIO_LEJANO = 13000;
const ENVIO_GRATIS = 0;
const PROMO_ACTIVA = "envio"; 
// "envio"  → envío gratis
// "regalo" → regalo 
// "ninguna" → sin promoo

const btn = document.getElementById("whatsapp-btn");


if (btn) {
  btn.addEventListener("click", () => {
  //fbq('track', 'Contact');
  const numero = "542291519731";
  const mensaje = "Hola! Vengo del catálogo y tengo una consulta...";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
  })
};

function calcularCostoEnvio(cp) {

  if (!cp) return ENVIO_GENERAL;

  const codigo = cp.trim();

  // Miramar (7607)
  if (codigo.startsWith("7607")) {
    return ENVIO_MIRAMAR;
  }

  // Mar del Plata (7600)
  if (codigo.startsWith("7600")) {
    return ENVIO_MDP;
  }

  // Muy al sur o muy al norte
  if (
    codigo.startsWith("9") || // Patagonia
    codigo.startsWith("4") || // NOA
    codigo.startsWith("3")    // NEA
  ) {
    return ENVIO_LEJANO;
  }

  // Resto del país
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
  //const contador = document.createElement('span');

  prevBtn.textContent = '<';
  nextBtn.textContent = '>';
  prevBtn.classList.add('prev');
  nextBtn.classList.add('next');
  //contador.classList.add('contador');

  modalContent.appendChild(prevBtn);
  modalContent.appendChild(nextBtn);
  //modalContent.appendChild(contador);

  // Productos
  const imagenesProducto = {
    "Ojotas clásicas blancas 🌊🏝️☀️": ["img/ojotasblancas.jpg", "img/ojotasblancas2.jpg", "img/ojotasblancas3.jpg"],
    "Botinetas galácticas": ["img/boti1.jpg", "img/zapas.jpg", "img/boti2.jpg"],
    "Ojotas con abrojo - Blancas": ["img/abrojo1.jpg", "img/abrojo2.jpg"],
    "Animal print check! 🤎": ["img/animalPrint.jpg", "img/print1.jpg", "img/print2.jpg"],
    "Botas": ["img/bs1.jpg", "img/bs2.jpg", "img/bs3.jpg", "img/bs4.jpg"],
    "Botas 🤎": ["img/501.jpg", "img/502.jpg"]
   
  };

  function animarAgregar(btn) {
  console.log("Animado botón", btn);
  if (!btn) return;

  // Vibración (si está disponible)
  if (navigator.vibrate) {
    navigator.vibrate(40);
  }

  btn.classList.remove("animar-agregar");
  void btn.offsetWidth; // fuerza reflow
  btn.classList.add("animar-agregar");

  setTimeout(() => {
    btn.classList.remove("animar-agregar");
  }, 400);
}

  let currentImages = [];
  let currentIndex = 0;
  let currentTitle = "";

  function abrirModal(card) {
    const img = card.querySelector('img');
    const title = card.querySelector('h3');
    const price = card.querySelector('p');

    currentTitle = title ? title.textContent : "Producto";
    currentImages = imagenesProducto[currentTitle] || [img?.src || ''];
    currentIndex = 0;

    modal.style.display = 'flex';
    actualizarModal();

    modalTitle.textContent = currentTitle;
    document.getElementById('modal-precio').textContent = price ? price.textContent : '';

    const modalAgregarBtn = document.getElementById('modal-agregar');
    if (modalAgregarBtn) {
        modalAgregarBtn.dataset.producto = currentTitle;
        modalAgregarBtn.dataset.precio = price ? price.textContent : '';

        const textoPrecio = price ? price.textContent.toLowerCase() : '';
        modalAgregarBtn.style.display = textoPrecio.includes('sin stock') ? 'none' : 'inline-block';
    }

    // ————————————————
    // SCROLL AUTOMÁTICO DEL SELECT (solo cuando se abre)
    // ————————————————
    const talleSelect = document.getElementById("talle-calzado");
if (talleSelect) {
    // Limpiamos opciones anteriores
    talleSelect.innerHTML = '<option value="">Seleccioná un talle</option>';

    // Obtenemos los talles desde el data-talles de la card
    const talles = card.dataset.talles ? card.dataset.talles.split(',') : [];

    talles.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.trim();
        opt.textContent = t.trim();
        talleSelect.appendChild(opt);
    });

    // Scroll automático solo cuando se abre
    requestAnimationFrame(() => {
        talleSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

}


  function actualizarModal() {
    modalImg.src = currentImages[currentIndex] || '';
    modalTitle.textContent = currentTitle;

    if (currentImages.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      //contador.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      //contador.textContent = '';
    }
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

  modalImg.onclick = () => {
    if (currentImages.length > 1) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      actualizarModal();
      return;
    }
    modalImg.classList.toggle('zoomed');
  };

  const closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      modalImg.classList.remove('zoomed');
    };
  }

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalImg.classList.remove('zoomed');
    }
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const titulo = card.querySelector('h3')?.textContent || '';
    const cantidadImgs = imagenesProducto[titulo]?.length || 1;
    if (cantidadImgs > 1) {
      const overlay = document.createElement('span');
      overlay.className = 'mas-fotos';
      overlay.textContent = `+${cantidadImgs - 1} fotos`;
      card.appendChild(overlay);
    }
    card.addEventListener('click', (ev) => {
      if (card.classList.contains('promo')) return;
      if (ev.target.closest('button')) return;
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

  // 👇 Cerrar al hacer click
  toast.onclick = () => {
    toast.classList.remove("show");
    setTimeout(() => toast.style.display = "none", 200);
  };

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.style.display = "none", 400);
  }, 3000);
}

  function lanzarConfetti() {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
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
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const numero = "542291519731";

  const carritoBtn = document.getElementById("carrito-btn");
  const carritoDropdown = document.getElementById("carrito-dropdown");
  const carritoItemsContainer = document.getElementById("carrito-items");
  const carritoCount = document.getElementById("carrito-count");
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
    borderRadius: "12px", background: "#f1ededff",
    display: "none", padding: "15px", width: "300px",
  });

  const parsePrecio = p => parseFloat(p.replace(/[^\d,]/g,"").replace(/\./g,"").replace(",","."))||0;
  const calcularTotal = () => carrito.reduce((a,i)=>a+parsePrecio(i.precio)*i.cantidad,0);

  const btnPagarMP = document.getElementById("btn-pagar-mp");

  btnPagarMP?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (carrito.length === 0) {
      alert("Tu carrito está vacío 🛒");
      return;
    }

    let msg = "💳 *Pedido listo para abonar*\n\n";
    let total = 0;
    let totalProductos = 0;

    carrito.forEach(i => {
      const precioUnitario = parsePrecio(i.precio);
      const subtotal = precioUnitario * i.cantidad;
      total += subtotal;
      totalProductos += i.cantidad;

      if (i.cantidad > 1) {
        msg += `• *${i.nombre}* — ${i.cantidad} x ${i.precio} → *$${subtotal.toLocaleString("es-AR")}*\n`;
      } else {
        msg += `• *${i.nombre}* — ${i.precio}\n`;
      }
    });

    msg += `\n📦 *Total de productos:* ${totalProductos}`;
    msg += `\n💰 *Total a pagar:* $${total.toLocaleString("es-AR")}`;
    msg += `\n\n📩 *Datos necesarios para el Correo*`;
    msg += `\nPor favor envianos estos datos 👇`;
    msg += `\n- Nombre y apellido:`;
    msg += `\n- CUIL/DNI:`;
    msg += `\n- Localidad:`;
    msg += `\n- Provincia:`;
    msg += `\n- Dirección exacta:`;
    msg += `\n- Código postal:`;
    msg += `\n- Teléfono:`;
    msg += `\n- Email:`;


    const numero = "542291519731";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });


  function actualizarCarrito() {
    carritoItemsContainer.innerHTML = carrito.length === 0
      ? "<p class='carrito-vacio'>🛍️ Tu carrito está vacío</p>"
      : carrito.map(i=>`
        <div class='carrito-item'>
          <strong>${i.nombre}${i.precio==0 ? " (REGALO)" : ""}</strong>  ${i.precio || "$0"}<br>
          ${i.talle ? `<em>Talle: ${i.talle}</em><br>` : ""}
          <button class='cantidad-btn restar' data-nombre='${i.nombre}' data-talle='${i.talle}'>-</button>
          ${i.cantidad}
          <button class='cantidad-btn sumar' data-nombre='${i.nombre}' data-talle='${i.talle}'>+</button>
        </div>
      `).join("");


    const total = calcularTotal();
    carritoCount.textContent = carrito.reduce((a,i)=>a+i.cantidad,0);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    const totalProductos = carrito.reduce((a,i)=>a+i.cantidad,0);
    carritoTotal.innerHTML = `
      <strong>- Cantidad de productos: ${totalProductos}</strong><br>
      <strong>- Total: $${total.toLocaleString("es-AR")}</strong>
    `;

    actualizarAvisoEnvioGratis(total);

    let carritoTimer;

    function iniciarTemporizadorCierre() {
      // Limpiamos cualquier temporizador previo
      clearTimeout(carritoTimer);

      // Solo si el carrito está abierto
      if (carritoDropdown.style.display === "block") {
        carritoTimer = setTimeout(() => {
          carritoDropdown.style.display = "none";
          fondoModal.style.display = "none";
        }, 10000); // 10 segundos
      }
    }

    // Reiniciar temporizador cuando el usuario interactúa con el carrito
    carritoDropdown.addEventListener("mouseenter", () => clearTimeout(carritoTimer));
    carritoDropdown.addEventListener("mouseleave", iniciarTemporizadorCierre);

    // Reiniciar temporizador cada vez que se abre el carrito
    carritoBtn?.addEventListener("click", iniciarTemporizadorCierre);

  }

  carritoBtn?.addEventListener("click",()=>{
    const visible = carritoDropdown.style.display==="block";
    carritoDropdown.style.display = visible?"none":"block";
    fondoModal.style.display = visible?"none":"block";
  });

  fondoModal.addEventListener("click",()=>{
    carritoDropdown.style.display="none";
    fondoModal.style.display="none";
  });

  function cerrarModal() {
    carritoDropdown.style.display = "none";
    fondoModal.style.display = "none";
  }

  document.getElementById("salir-carrito")?.addEventListener("click", cerrarModal);

  vaciarBtn?.addEventListener("click",()=>{carrito=[];actualizarCarrito();});

  document.addEventListener("click", e => {
    if(e.target.classList.contains("sumar")){
      const item = carrito.find(p => p.nombre === e.target.dataset.nombre && p.talle === e.target.dataset.talle);
      if(item) item.cantidad++;
    }
    if(e.target.classList.contains("restar")){
      const item = carrito.find(p => p.nombre === e.target.dataset.nombre && p.talle === e.target.dataset.talle);
      if(item){
        item.cantidad > 1 
          ? item.cantidad-- 
          : carrito = carrito.filter(p => !(p.nombre === item.nombre && p.talle === item.talle));
      }
    }
    actualizarCarrito();
  });


  document.querySelectorAll(".btn-carrito, .btn-consulta, #modal-agregar, #modal-consulta")
    .forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const card = btn.closest(".card");
        let nombre = card?.querySelector("h3")?.innerText || document.getElementById("modal-title")?.innerText;
        let precio = card?.querySelector("p")?.innerText || document.getElementById("modal-precio")?.innerText;
        const texto = btn.innerText.toLowerCase();

        if (texto.includes("agregar")) {
          const selectTalle = document.getElementById("talle-calzado");
          const talle = selectTalle ? selectTalle.value : "";

          if (!talle) {
            mostrarToast("Por favor seleccioná un talle", "warning");
            return;
          }

          const ex = carrito.find(p => p.nombre === nombre && p.talle === talle);

          if (ex) {
            ex.cantidad++;
          } else {
            carrito.push({ nombre, precio, cantidad: 1, talle });
          }

          actualizarCarrito();
          animarAgregar(btn);
          mostrarToast("Producto agregado al carrito 🛒", "warning");
          if (typeof modal !== "undefined" && modal?.style?.display === "flex") modal.style.display = "none";
          //carritoDropdown.style.display = "block";
          //fondoModal.style.display = "block";
        }
        else if (texto.includes("promo")) {
          const msg = "💬 Hola, quiero consultar sobre *" + nombre + "*.";
          window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");
        }
      });
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

  // 🔹 Productos
  carrito.forEach(i => {
    const precioUnitario = parsePrecio(i.precio);
    const subtotal = precioUnitario * i.cantidad;
    total += subtotal;
    totalProductos += i.cantidad;

    if (i.cantidad > 1) {
      msg += `• *${i.nombre}* (Talle: ${i.talle}) — ${i.cantidad} x ${i.precio} → *$${subtotal.toLocaleString("es-AR")}*\n`;
    } else {
      msg += `• *${i.nombre}* (Talle: ${i.talle}) — ${i.precio}\n`;
    }

  });

  // 🔹 Compra mínima
  if (total < minimoCompra) {
    alert(`⚠️ La compra mínima es de $${minimoCompra.toLocaleString("es-AR")}`);
    return;
  }

  // 🔹 Abrir modal de código postal
  const modalCP = document.getElementById("modal-cp");
  const inputCP = document.getElementById("cp-input");
  inputCP.value = "";
  modalCP.style.display = "flex";

  // 🔹 Esperar confirmación del usuario

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
    msg += `\n📦 *Total de productos:* ${totalProductos}`;
    msg += `\n🚚 *Envío:* $0`;
    msg += `\n\n💳 *Total a pagar:* $${totalFinal.toLocaleString("es-AR")}`;

    msg += `\n\n📍 *Retiro en Miramar*`;

    const numero = "542236010443";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    modalCP.style.display = "none";
  });

  const cpConfirmar = document.getElementById("cp-confirmar");
  cpConfirmar.onclick = () => {
    const codigoPostalCliente = inputCP.value.trim();
    const esMiramar = codigoPostalCliente.startsWith("7607");

    if (!codigoPostalCliente) {
      alert("⚠️ Por favor, ingresá tu código postal.");
      return;
    }

    // ❗ Validación de código postal
    if (!/^\d{4,8}$/.test(codigoPostalCliente)) {
      alert("⚠️ Código postal inválido. Ingresá solo números (4 a 8 dígitos).");
      return;
    }

    // 🔹 Calcular envío con regla de envío gratis
    let costoEnvio;

    if (PROMO_ACTIVA === "envio" && total >= 50000) {
      costoEnvio = 0;
    } else {
      costoEnvio = calcularCostoEnvio(codigoPostalCliente);
    }

    const totalFinal = total + costoEnvio;

    let mensajeRegalo = "";

    if (PROMO_ACTIVA === "regalo" && total >= minimoRegalo) {
        mensajeRegalo = `\n🎁 ¡Tu compra incluye: ${REGALO_NOMBRE} de regalo!`;
    } else {
        mensajeRegalo = ""; // Nada si no llega al mínimo
    }



     // 🔹 Totales finales
    msg += mensajeRegalo;
    totalProductos += (PROMO_ACTIVA === "regalo" && total >= minimoRegalo) ? 1 : 0;
    msg += `\n📦 *Total de productos:* ${totalProductos}`;
    msg += `\n🚚 *Envío:* $${costoEnvio.toLocaleString("es-AR")}`;
    msg += `\n\n💳 *Total a pagar (con envío incluido):* $${totalFinal.toLocaleString("es-AR")}`;

    if (esMiramar) {
    msg += `\n\n📍 *Entrega en Terminal de Miramar*`;
    
  } else {
    msg += `\n\n- Alguna referencia del domicilio (opcional): `;
    msg += `\n- Teléfono: `;
    msg += `\n- Email: `;
    msg += `\n- Código postal: ${codigoPostalCliente}`;
    msg += `\n- Dirección exacta: `;
    msg += `\n- Localidad: `;
    msg += `\n- Provincia: `;
    msg += `\n- Nombre y apellido: `;
    msg += `\n\n📩 *Datos necesarios para el envío a través de Correo Argentino (Si ya completaste alguna vez, podés omitirlo)👆🏻*`;
  }

    // 🔹 Abrir WhatsApp
    const numero = "542291519731";
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
    } else {
      const falta = minimoRegalo - total;
      aviso.innerHTML = `🎁 Sumá <strong>$${falta.toLocaleString("es-AR")}</strong> y llevate un regalo!`;
    }
    aviso.style.display = "block";
    return;
  }

  if (PROMO_ACTIVA === "envio") {
    if (envioManualGratis || total >= 50000) {
      aviso.innerHTML = "🎉 <strong>¡Tenés envío gratis!</strong>";
      aviso.style.display = "block";

      if (!estadoEnvio.toastMostrado) {
        mostrarToast("🎉 Tenés envío gratis! ✨", "fiesta", 1500);
        setTimeout(() => lanzarConfetti(), 1500);
        estadoEnvio.toastMostrado = true;
      }
    } else {
      const falta = 50000 - total;
      aviso.innerHTML = `Sumá <strong>$${falta.toLocaleString("es-AR")}</strong> y conseguí <b>envío gratis</b>`;
      aviso.style.display = "block";
    }
    return;
  }

  if (PROMO_ACTIVA === "ninguna") {
    if (total < minimoCompra) {

      aviso.style.display = "block";
    } else {
      aviso.style.display = "none";
    }
  }
}

// ========================
// SINCRONIZAR CARRITO CON PRODUCTOS Y TALLES DEL HTML (SILENCIOSO)
// ========================
function sincronizarCarritoConHTML() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) return;

  // 🔹 Leer productos y talles actuales del HTML
  const productosHTML = {};
  document.querySelectorAll(".card").forEach(card => {
    const nombre = card.querySelector("h3")?.innerText.trim();
    const precioTexto = card.querySelector("p")?.innerText.trim();
    const talles = card.dataset.talles
      ? card.dataset.talles.split(",").map(t => t.trim())
      : [];

    if (nombre && precioTexto) {
      const precio = parseFloat(
        precioTexto.replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")
      );

      productosHTML[nombre] = {
        precio,
        talles
      };
    }
  });

  let cambios = false;

  carrito = carrito.filter(item => {
    const producto = productosHTML[item.nombre];

    // ❌ Producto eliminado
    if (!producto) {
      cambios = true;
      return false;
    }

    // ❌ Talle eliminado
    if (item.talle && !producto.talles.includes(item.talle)) {
      cambios = true;
      return false;
    }

    // 🔄 Precio actualizado
    const precioCarrito = parseFloat(
      item.precio.replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")
    );

    if (precioCarrito !== producto.precio) {
      item.precio = `$${producto.precio.toLocaleString("es-AR")}`;
      cambios = true;
    }

    return true;
  });

  if (cambios) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}


