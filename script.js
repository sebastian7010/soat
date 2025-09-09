// Crear partículas flotantes
function createParticles() {
    const container = document.getElementById("particles")
    const particleCount = 15

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"

        // Tamaño aleatorio
        const size = Math.random() * 6 + 2
        particle.style.width = size + "px"
        particle.style.height = size + "px"

        // Posición aleatoria
        particle.style.left = Math.random() * 100 + "%"
        particle.style.top = Math.random() * 100 + "%"

        // Duración de animación aleatoria
        particle.style.animationDuration = Math.random() * 4 + 3 + "s"
        particle.style.animationDelay = Math.random() * 2 + "s"

        // Color aleatorio entre amarillo y rojo
        const colors = ["#FFD700", "#FF4444", "#FFA500", "#FF6666"]
        particle.style.background = colors[Math.floor(Math.random() * colors.length)]

        container.appendChild(particle)
    }
}

// Cargar perfumes desde JSON
async function loadPerfumes() {
    try {
        const response = await fetch("perfumes.json")
        const perfumes = await response.json()
        const grid = document.getElementById("perfumes-grid")

        perfumes.forEach((perfume) => {
            const card = document.createElement("div")
            card.className = "perfume-card"
            card.innerHTML = `
                <img src="${perfume.imagen}" alt="${perfume.nombre}">
                <h3>${perfume.nombre}</h3>
                <div class="price">$${perfume.precio}</div>
            `

            card.addEventListener("click", () => {
                const mensaje = `Hola quiero comprar ${perfume.nombre}`
                const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`
                window.open(whatsappUrl, "_blank")
            })

            grid.appendChild(card)
        })
    } catch (error) {
        console.error("Error cargando perfumes:", error)
    }
}

// Manejar clicks en botones de servicios
function setupServiceButtons() {
    const buttons = document.querySelectorAll(".service-btn")
    const perfumesSection = document.getElementById("perfumes-section")
    const entretenimientoSection = document.getElementById("entretenimiento-section")
    const smarttvSection = document.getElementById("smarttv-section")

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const service = button.getAttribute("data-service")
            let mensaje = ""

            perfumesSection.classList.remove("active")
            entretenimientoSection.classList.remove("active")
            smarttvSection.classList.remove("active")

            switch (service) {
                case "soat":
                    mensaje = "Estoy interesado en renovar mi SOAT"
                    break
                case "entretenimiento":
                    entretenimientoSection.classList.add("active")
                    entretenimientoSection.scrollIntoView({ behavior: "smooth" })
                    return
                case "tramites":
                    mensaje = "Hola estoy interesado en resolver mis trámites de tránsito"
                    break
                case "smarttv":
                    smarttvSection.classList.add("active")
                    smarttvSection.scrollIntoView({ behavior: "smooth" })
                    return
                case "polizas":
                    mensaje =
                        "Hola quiero hacer la póliza de (seguro todo riesgo para vehículo - seguros de viaje - seguros de vida - seguros de hogar)"
                    break
                case "perfumes":
                    // Mostrar sección de perfumes
                    perfumesSection.classList.add("active")
                    perfumesSection.scrollIntoView({ behavior: "smooth" })
                    return
                case "recargas":
                    mensaje = "Hola estoy interesado en hacer recarga de mi celular"
                    break
            }

            if (mensaje) {
                const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`
                window.open(whatsappUrl, "_blank")
            }
        })
    })
}

function setupEntertainmentButtons() {
    const entertainmentCards = document.querySelectorAll(".entertainment-card")

    entertainmentCards.forEach((card) => {
        card.addEventListener("click", () => {
            const service = card.getAttribute("data-service")
            const serviceName = card.querySelector("h3").textContent
            let mensaje = ""

            switch (service) {
                case "netflix":
                    mensaje = "Hola estoy interesado en comprar cuenta de Netflix"
                    break
                case "disney":
                    mensaje = "Hola estoy interesado en comprar cuenta de Disney+"
                    break
                case "amazon":
                    mensaje = "Hola estoy interesado en comprar cuenta de Amazon Prime"
                    break
                case "star":
                    mensaje = "Hola estoy interesado en comprar cuenta de Star+"
                    break
                case "hbo":
                    mensaje = "Hola estoy interesado en comprar cuenta de HBO Max"
                    break
                case "win":
                    mensaje = "Hola estoy interesado en comprar cuenta de Win+"
                    break
                case "youtube":
                    mensaje = "Hola estoy interesado en comprar cuenta de YouTube Premium"
                    break
                case "spotify":
                    mensaje = "Hola estoy interesado en comprar cuenta de Spotify Premium"
                    break
                case "paramount":
                    mensaje = "Hola estoy interesado en comprar cuenta de Paramount+"
                    break
                case "plex":
                    mensaje = "Hola estoy interesado en comprar cuenta de Plex"
                    break
                case "iptv":
                    mensaje = "Hola estoy interesado en el servicio de IPTV"
                    break
                case "crunchyroll":
                    mensaje = "Hola estoy interesado en comprar cuenta de Crunchyroll"
                    break
                case "vix":
                    mensaje = "Hola estoy interesado en comprar cuenta de Vix+"
                    break
                case "directv":
                    mensaje = "Hola estoy interesado en comprar cuenta de Directv Go"
                    break
                case "chatgpt":
                    mensaje = "Hola estoy interesado en comprar cuenta de Chat GPT Premium"
                    break
                case "canva":
                    mensaje = "Hola estoy interesado en comprar cuenta de Canva Pro"
                    break
                case "capcut":
                    mensaje = "Hola estoy interesado en comprar cuenta de CapCut Pro"
                    break
                case "duolingo":
                    mensaje = "Hola estoy interesado en comprar cuenta de Duolingo Plus"
                    break
                case "gemini":
                    mensaje = "Hola estoy interesado en comprar cuenta de Gemini Premium"
                    break
                case "hotgo":
                    mensaje = "Hola estoy interesado en comprar cuenta de Hot Go"
                    break
                case "xxx":
                    mensaje = "Hola estoy interesado en contenido de entretenimiento adulto"
                    break
                case "pornhub":
                    mensaje = "Hola estoy interesado en comprar cuenta de PornHub Premium"
                    break
                default:
                    mensaje = `Hola estoy interesado en comprar cuenta de ${serviceName}`
            }

            const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`
            window.open(whatsappUrl, "_blank")
        })
    })
}

function setupSmartTVButtons() {
    const smarttvCards = document.querySelectorAll(".smarttv-card")

    smarttvCards.forEach((card) => {
        card.addEventListener("click", () => {
            const product = card.getAttribute("data-product")
            const productName = card.querySelector("h3").textContent
            const mensaje = `Hola quiero comprar ${productName} para convertir mi TV a Smart TV`
            const whatsappUrl = `https://wa.me/573003085467?text=${encodeURIComponent(mensaje)}`
            window.open(whatsappUrl, "_blank")
        })
    })
}

// Manejar clicks en botones de navegación
function setupNavButtons() {
    const serviciosBtn = document.getElementById("servicios-btn")
    const productosBtn = document.getElementById("productos-btn")

    if (!serviciosBtn || !productosBtn) {
        console.error("Navigation buttons not found")
        return
    }

    // Botones de servicios: SOAT, entretenimiento, trámites, recargas
    const serviciosButtons = ["soat", "entretenimiento", "tramites", "recargas"]

    // Botones de productos: smarttv, perfumes, polizas
    const productosButtons = ["smarttv", "perfumes", "polizas"]

    serviciosBtn.addEventListener("click", () => {
        // Remover clase active de todos los nav buttons
        document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"))
            // Agregar clase active al botón clickeado
        serviciosBtn.classList.add("active")

        // Remover highlight de todos los botones
        document.querySelectorAll(".service-btn").forEach((btn) => btn.classList.remove("highlighted"))

        // Agregar highlight a botones de servicios
        serviciosButtons.forEach((service) => {
            const button = document.querySelector(`[data-service="${service}"]`)
            if (button) {
                button.classList.add("highlighted")
            }
        })
    })

    productosBtn.addEventListener("click", () => {
        // Remover clase active de todos los nav buttons
        document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"))
            // Agregar clase active al botón clickeado
        productosBtn.classList.add("active")

        // Remover highlight de todos los botones
        document.querySelectorAll(".service-btn").forEach((btn) => btn.classList.remove("highlighted"))

        // Agregar highlight a botones de productos
        productosButtons.forEach((product) => {
            const button = document.querySelector(`[data-service="${product}"]`)
            if (button) {
                button.classList.add("highlighted")
            }
        })
    })
}

// Animación de entrada para los botones
function animateButtons() {
    const buttons = document.querySelectorAll(".service-btn")
    buttons.forEach((button, index) => {
        button.style.opacity = "0"
        button.style.transform = "translateY(50px)"

        setTimeout(() => {
            button.style.transition = "all 0.6s ease"
            button.style.opacity = "1"
            button.style.transform = "translateY(0)"
        }, index * 100)
    })
}

// Inicializar todo cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
    createParticles()
    loadPerfumes()
    setupServiceButtons()
    setupEntertainmentButtons() // Nueva función
    setupSmartTVButtons() // Nueva función
    setupNavButtons()
    animateButtons()
})

// Recrear partículas cada 10 segundos para mantener la animación
setInterval(() => {
    const container = document.getElementById("particles")
    container.innerHTML = ""
    createParticles()
}, 10000)