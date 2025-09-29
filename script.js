/* ========= CONFIG ========= */
/* Si tu carpeta REAL se llama "perfumes.webp" (carpeta con .webp adentro), deja esta ruta.
   Si en realidad se llama "perfumes", cámbiala a "./perfumes/". */
const IMAGES_DIR = "./perfumes.webp/";
const LS_KEY = "perfumesData_v1";

/* Base de la API:
   - En local: http://localhost:3001 (vercel dev)
   - En producción: cadena vacía (misma URL del deploy) */
// usa siempre producción
const API_BASE = 'https://soat-coral-five.vercel.app';
const COMMIT_URL = `${API_BASE}/api/commit`;
const RAW_URL = 'https://raw.githubusercontent.com/sebastian7010/soat/main/perfumes.json';


/* ========================= */

/* Util: resolver ruta de imagen según si es archivo, ruta o URL */
function resolveImageSrc(imgField) {
    if (!imgField) return "";
    const trimmed = String(imgField).trim();
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("./") || trimmed.startsWith("/")) {
        return trimmed; // URL absoluta o ruta relativa explícita
    }
    // Si solo dieron el archivo, se busca en IMAGES_DIR
    return IMAGES_DIR + trimmed;
}

/* Cargar perfumes (GLOBAL) */
async function getPerfumesData() {
    // 1) Intento principal: leer SIEMPRE del RAW del repo (global)
    try {
        const resp = await fetch(`${RAW_URL}?ts=${Date.now()}`, { cache: "no-store" });
        if (resp.ok) {
            const data = await resp.json();
            // Guardar copia local como respaldo offline
            try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
            return data.map(p => ({
                nombre: p.nombre || "",
                precio: p.precio || "",
                descripcion: p.descripcion || "",
                imagen: p.imagen || ""
            }));
        }
    } catch (e) {
        console.warn("Fallo lectura RAW, uso fallback local:", e);
    }

    // 2) Fallback: localStorage
    try {
        const cached = localStorage.getItem(LS_KEY);
        if (cached) return JSON.parse(cached);
    } catch {}

    // 3) Último recurso: archivo estático del build (puede estar desactualizado)
    try {
        const resp = await fetch("perfumes.json", { cache: "no-store" });
        return await resp.json();
    } catch {
        return [];
    }
}

/* ================== TU CÓDIGO EXISTENTE (conservado) ================== */
// Crear partículas flotantes
function createParticles() {
    const container = document.getElementById("particles");
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        // Tamaño aleatorio
        const size = Math.random() * 6 + 2;
        particle.style.width = size + "px";
        particle.style.height = size + "px";

        // Dividir la pantalla en zonas para mejor distribución
        const zone = i % 4;
        let left, top;

        switch (zone) {
            case 0: // Cuadrante superior izquierdo
                left = Math.random() * 25;
                top = Math.random() * 25;
                break;
            case 1: // Cuadrante superior derecho
                left = 75 + Math.random() * 25;
                top = Math.random() * 25;
                break;
            case 2: // Cuadrante inferior izquierdo
                left = Math.random() * 25;
                top = 75 + Math.random() * 25;
                break;
            case 3: // Cuadrante inferior derecho
                left = 75 + Math.random() * 25;
                top = 75 + Math.random() * 25;
                break;
            default: // Partículas adicionales distribuidas aleatoriamente
                left = Math.random() * 100;
                top = Math.random() * 100;
        }

        particle.style.left = left + "%";
        particle.style.top = top + "%";

        // Duración de animación aleatoria
        particle.style.animationDuration = Math.random() * 4 + 3 + "s";
        particle.style.animationDelay = Math.random() * 2 + "s";

        const colors = ["#6b7280", "#9ca3af", "#d1d5db", "#374151"];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

/* === Usa getPerfumesData(), añade descripción y resuelve rutas === */
async function loadPerfumes() {
    try {
        const perfumes = await getPerfumesData();
        const grid = document.getElementById("perfumes-grid");
        grid.innerHTML = "";

        perfumes.forEach((perfume) => {
                    const card = document.createElement("div");
                    card.className = "perfume-card";

                    const imgSrc = resolveImageSrc(perfume.imagen);

                    card.innerHTML = `
        <img src="${imgSrc}" alt="${perfume.nombre}">
        <h3>${perfume.nombre}</h3>
        <div class="price">$${perfume.precio}</div>
        ${perfume.descripcion ? `<p style="font-size:12px;color:#374151;margin-top:6px;">${perfume.descripcion}</p>` : ""}
      `;

      card.addEventListener("click", () => {
        const mensaje = `Hola quiero comprar ${perfume.nombre}`;
        const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, "_blank");
      });

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando perfumes:", error);
  }
}

// Manejar clicks en botones de servicios
 function setupServiceButtons() {
  const buttons = document.querySelectorAll(".service-btn");

  // Referencias a secciones
  const sections = {
    perfumes: document.getElementById("perfumes-section"),
    entretenimiento: document.getElementById("entretenimiento-section"),
    smarttv: document.getElementById("smarttv-section"),
    tramites: document.getElementById("tramites-section"),
    polizas: document.getElementById("polizas-section"),
    recargas: document.getElementById("recargas-section"),
  };

  // Oculta todas las secciones
  const hideAll = () => {
    Object.values(sections).forEach((sec) => sec?.classList.remove("active"));
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.getAttribute("data-service");
      let mensaje = "";

      hideAll();

      switch (service) {
        case "entretenimiento":
          sections.entretenimiento?.classList.add("active");
          sections.entretenimiento?.scrollIntoView({ behavior: "smooth" });
          return;

        case "tramites":
          sections.tramites?.classList.add("active");
          sections.tramites?.scrollIntoView({ behavior: "smooth" });
          return;

        case "smarttv":
          sections.smarttv?.classList.add("active");
          sections.smarttv?.scrollIntoView({ behavior: "smooth" });
          return;

        case "polizas":
          sections.polizas?.classList.add("active");
          sections.polizas?.scrollIntoView({ behavior: "smooth" });
          return;

        case "perfumes":
          sections.perfumes?.classList.add("active");
          sections.perfumes?.scrollIntoView({ behavior: "smooth" });
          return;

        case "recargas": // mostrar la sección de recargas (no WhatsApp directo)
          sections.recargas?.classList.add("active");
          sections.recargas?.scrollIntoView({ behavior: "smooth" });
          return;

        case "soat":
          mensaje = "Estoy interesado en renovar mi SOAT";
          break;

        case "recargas-direct": // opcional por si algún botón quisiera ir directo a WhatsApp
          mensaje = "Hola, quiero hacer una recarga de mi celular.";
          break;

        default:
          // no-op
          break;
      }

      if (mensaje) {
        const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, "_blank");
      }
    });
  });
}






function setupTramitesButtons() {
  const grid = document.getElementById("tramites-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".tramite-card");
    if (!card) return;

    const tipo = card.getAttribute("data-tramite");
    let mensaje = "Hola, quiero realizar un trámite de tránsito.";

    switch (tipo) {
      case "impuesto":
        mensaje = "Hola, quiero hacer el Pago de impuesto vehicular.";
        break;
      case "semaforizacion":
        mensaje = "Hola, quiero hacer el Pago de semaforización.";
        break;
      case "fotomultas":
        mensaje = "Hola, quiero hacer el Pago de foto multas.";
        break;
      case "otros":
        mensaje = "Hola, quiero realizar otro trámite de tránsito (por favor indicar).";
        break;
    }

    const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");
  });
}
function setupPolizasButtons() {
  const grid = document.getElementById("polizas-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".poliza-card");
    if (!card) return;

    const tipo = card.getAttribute("data-poliza");
    let mensaje = "Hola, quiero cotizar una póliza de seguro.";

    switch (tipo) {
      case "todo-riesgo":
        mensaje = "Hola, quiero cotizar un Seguro Todo Riesgo para vehículo.";
        break;
      case "vida":
        mensaje = "Hola, quiero cotizar un Seguro de Vida.";
        break;
      case "vivienda":
        mensaje = "Hola, quiero cotizar un Seguro de Vivienda (hogar).";
        break;
      case "viaje":
        mensaje = "Hola, quiero cotizar un Seguro de Viaje.";
        break;
      case "otros":
        mensaje = "Hola, quiero cotizar otra póliza (por favor indicar).";
        break;
    }

    const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");
  });
}


// Manejar clicks en botones de entretenimiento
function setupEntertainmentButtons() {
  const entertainmentCards = document.querySelectorAll(".entertainment-card");

  entertainmentCards.forEach((card) => {
    card.addEventListener("click", () => {
      const service = card.getAttribute("data-service");
      const serviceName = card.querySelector("h3").textContent;
      let mensaje = "";

      switch (service) {
        case "netflix":
          mensaje = "Hola estoy interesado en comprar cuenta de Netflix";
          break;
        case "disney":
          mensaje = "Hola estoy interesado en comprar cuenta de Disney+";
          break;
        case "amazon":
          mensaje = "Hola estoy interesado en comprar cuenta de Amazon Prime";
          break;
        case "star":
          mensaje = "Hola estoy interesado en comprar cuenta de Star+";
          break;
        case "hbo":
          mensaje = "Hola estoy interesado en comprar cuenta de HBO Max";
          break;
        case "win":
          mensaje = "Hola estoy interesado en comprar cuenta de Win+";
          break;
        case "youtube":
          mensaje = "Hola estoy interesado en comprar cuenta de YouTube Premium";
          break;
        case "spotify":
          mensaje = "Hola estoy interesado en comprar cuenta de Spotify Premium";
          break;
        case "paramount":
          mensaje = "Hola estoy interesado en comprar cuenta de Paramount+";
          break;
        case "plex":
          mensaje = "Hola estoy interesado en comprar cuenta de Plex";
          break;
        case "iptv":
          mensaje = "Hola estoy interesado en el servicio de IPTV";
          break;
        case "crunchyroll":
          mensaje = "Hola estoy interesado en comprar cuenta de Crunchyroll";
          break;
        case "vix":
          mensaje = "Hola estoy interesado en comprar cuenta de Vix+";
          break;
        case "directv":
          mensaje = "Hola estoy interesado en comprar cuenta de Directv Go";
          break;
        case "chatgpt":
          mensaje = "Hola estoy interesado en comprar cuenta de ChatGPT Premium";
          break;
        case "canva":
          mensaje = "Hola estoy interesado en comprar cuenta de Canva Pro";
          break;
        case "capcut":
          mensaje = "Hola estoy interesado en comprar cuenta de CapCut Pro";
          break;
        case "duolingo":
          mensaje = "Hola estoy interesado en comprar cuenta de Duolingo Plus";
          break;
        case "gemini":
          mensaje = "Hola estoy interesado en comprar cuenta de Google Gemini Advanced";
          break;
        default:
          mensaje = `Hola estoy interesado en ${serviceName}`;
      }

      const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, "_blank");
    });
  });
}

function setupRecargasButtons() {
  const grid = document.getElementById("recargas-grid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".recarga-card");
    if (!card) return;

    const operador = card.getAttribute("data-recarga");
    let mensaje = "Hola, quiero hacer una recarga de celular.";

    switch (operador) {
      case "tigo":
        mensaje = "Hola, quiero hacer una recarga para Tigo.";
        break;
      case "claro":
        mensaje = "Hola, quiero hacer una recarga para Claro.";
        break;
      case "movistar":
        mensaje = "Hola, quiero hacer una recarga para Movistar.";
        break;
      case "virgin":
        mensaje = "Hola, quiero hacer una recarga para Virgin Mobile.";
        break;
      case "etb":
        mensaje = "Hola, quiero hacer una recarga para ETB.";
        break;
      case "exito":
        mensaje = "Hola, quiero hacer una recarga para Móvil Éxito.";
        break;
      case "wom":
        mensaje = "Hola, quiero hacer una recarga para Wom.";
        break;
      case "otro":
        mensaje = "Hola, quiero hacer una recarga. Mi operador es: (especificar)";
        break;
    }

    const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");
  });
}


function setupSmartTVButtons() {
  const smarttvCards = document.querySelectorAll(".smarttv-card");

  smarttvCards.forEach((card) => {
    card.addEventListener("click", () => {
      const productName = card.querySelector("h3").textContent;
      const mensaje = `Hola quiero comprar ${productName} para convertir mi TV a Smart TV`;
      const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, "_blank");
    });
  });
}

// Manejar clicks en botones de navegación
function setupNavButtons() {
  const serviciosBtn = document.getElementById("servicios-btn");
  const productosBtn = document.getElementById("productos-btn");

  if (!serviciosBtn || !productosBtn) {
    console.error("Navigation buttons not found");
    return;
  }

  // Botones de servicios: SOAT, entretenimiento, trámites, recargas
  const serviciosButtons = ["soat", "entretenimiento", "tramites", "recargas"];

  // Botones de productos: smarttv, perfumes, polizas
  const productosButtons = ["smarttv", "perfumes", "polizas"];

  serviciosBtn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
    serviciosBtn.classList.add("active");

    document.querySelectorAll(".service-btn").forEach((btn) => btn.classList.remove("highlighted"));

    serviciosButtons.forEach((service) => {
      const button = document.querySelector(`[data-service="${service}"]`);
      if (button) button.classList.add("highlighted");
    });
  });

  productosBtn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
    productosBtn.classList.add("active");

    document.querySelectorAll(".service-btn").forEach((btn) => btn.classList.remove("highlighted"));

    productosButtons.forEach((product) => {
      const button = document.querySelector(`[data-service="${product}"]`);
      if (button) button.classList.add("highlighted");
    });
  });
}

// Animación de entrada para los botones
function animateButtons() {
  const buttons = document.querySelectorAll(".service-btn");
  buttons.forEach((button, index) => {
    button.style.opacity = "0";
    button.style.transform = "translateY(50px)";

    setTimeout(() => {
      button.style.transition = "all 0.6s ease";
      button.style.opacity = "1";
      button.style.transform = "translateY(0)";
    }, index * 100);
  });
}

/* ================== ADMIN PANEL (nuevo) ================== */
let _adminClicks = 0;
let _adminClicksTimer = null;

function enableAdminTrigger() {
  const logo = document.getElementById("admin-logo-trigger");
  const panel = document.getElementById("admin-panel");
  if (!logo || !panel) return;

  logo.addEventListener("click", async () => {
    _adminClicks++;
    clearTimeout(_adminClicksTimer);
    _adminClicksTimer = setTimeout(() => { _adminClicks = 0; }, 1200);

    if (_adminClicks >= 5) {
      _adminClicks = 0;
      panel.classList.toggle("active");
      if (panel.classList.contains("active")) {
        renderAdminTable(await getPerfumesData());
      }
    }
  });
}

function renderAdminTable(perfumes) {
  const tbody = document.getElementById("admin-tbody");
  tbody.innerHTML = "";

  perfumes.forEach((p, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><input type="text" value="${escapeHtml(p.nombre)}" data-field="nombre"></td>
      <td><input type="text" value="${escapeHtml(p.precio)}" data-field="precio"></td>
      <td><textarea data-field="descripcion">${escapeHtml(p.descripcion || "")}</textarea></td>
      <td><input type="text" value="${escapeHtml(p.imagen)}" placeholder="archivo.webp o URL" data-field="imagen"></td>
      <td><button class="row-del">Eliminar</button></td>
    `;

    tbody.appendChild(tr);
  });

  bindAdminControls(perfumes);
}

function bindAdminControls(current) {
  const tbody = document.getElementById("admin-tbody");
  const btnAdd = document.getElementById("admin-add");
  const btnSave = document.getElementById("admin-save");
  const btnExport = document.getElementById("admin-export");
  const inputImport = document.getElementById("admin-import");

  // Editar campos
  tbody.addEventListener("input", (e) => {
    const tr = e.target.closest("tr");
    const index = [...tbody.children].indexOf(tr); // spread correcto
    const field = e.target.getAttribute("data-field");
    if (!field) return;
    current[index][field] = e.target.value;
  });

  // Eliminar fila
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("row-del")) {
      const tr = e.target.closest("tr");
      const index = [...tbody.children].indexOf(tr); // spread correcto
      current.splice(index, 1);
      renderAdminTable(current);
    }
  });

  // Agregar fila
  btnAdd.onclick = () => {
    current.push({ nombre: "", precio: "", descripcion: "", imagen: "" });
    renderAdminTable(current);
  };

  // Guardar: primero navegador, luego GitHub
  btnSave.onclick = async () => {
    try {
      // 1) Guardar en navegador (respaldo)
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(current));
      } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
      }

      // 2) Commit a GitHub
      const payload = {
        message: "Update perfumes.json desde Admin",
        json: current,
        debug: true
      };

      const resp = await fetch(COMMIT_URL + "?debug=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Evita “Unexpected end of JSON input”
      const raw = await resp.text();
      let data;
      try { data = JSON.parse(raw); } catch { data = { raw }; }

      console.log("Commit response:", resp.status, data);

      if (!resp.ok) {
        alert("Guardado en este navegador. No se pudo guardar en GitHub (" + resp.status + "). Revisa la consola.");
        return;
      }

      alert("Guardado en este navegador y commit hecho en GitHub ✅");
      loadPerfumes(); // refresca grilla global leyendo desde RAW
    } catch (e) {
      console.error("Error al guardar:", e);
      alert("Guardado en este navegador. Hubo un error inesperado al intentar GitHub.");
    }
  };

  // Exportar JSON (descarga)
  btnExport.onclick = () => {
    const blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "perfumes.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar JSON
  inputImport.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("Formato inválido");
        const norm = data.map(p => ({
          nombre: p.nombre || "",
          precio: p.precio || "",
          descripcion: p.descripcion || "",
          imagen: p.imagen || ""
        }));
        renderAdminTable(norm);
        current.splice(0, current.length, ...norm);
      } catch (err) {
        alert("JSON inválido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* ================== INIT ================== */
// Inicializar todo cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  loadPerfumes();
  setupServiceButtons();
  setupEntertainmentButtons();
  setupSmartTVButtons();
  setupNavButtons();
  animateButtons();
    setupTramitesButtons(); // <-- NUEVO
      setupPolizasButtons(); // <-- NUEVO
        setupRecargasButtons(); // <-- NUEVO



  enableAdminTrigger(); // activar panel admin oculto (5 clics al logo)
});

setInterval(() => {
  const container = document.getElementById("particles");
  container.innerHTML = "";
  createParticles();
}, 8000);