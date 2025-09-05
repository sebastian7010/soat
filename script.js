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

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const service = button.getAttribute("data-service")
            let mensaje = ""

            switch (service) {
                case "soat":
                    mensaje = "Estoy interesado en renovar mi SOAT"
                    break
                case "entretenimiento":
                    mensaje = "Hola estoy interesado en comprar cuentas de streaming"
                    break
                case "tramites":
                    mensaje = "Hola estoy interesado en resolver mis trámites de tránsito"
                    break
                case "smarttv":
                    mensaje = "Hola quiero convertir mi TV a Smart TV con Watch On"
                    break
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
    animateButtons()
})

// Recrear partículas cada 10 segundos para mantener la animación
setInterval(() => {
    const container = document.getElementById("particles")
    container.innerHTML = ""
    createParticles()
}, 10000)