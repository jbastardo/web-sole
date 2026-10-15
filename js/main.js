/**
 * SOLE - Soluciones Originales para Lugares y Espacios
 * Script Principal (main.js)
 * 
 * Variables centralizadas y lógica interactiva
 */

// ==========================================================================
// CONFIGURACIÓN CENTRALIZADA (Variables editables de negocio)
// ==========================================================================
const SOLE_CONFIG = {
  BUSINESS_NAME: "SOLE – Soluciones Originales para Lugares y Espacios",
  BUSINESS_SHORT_NAME: "SOLE",
  BUSINESS_TAGLINE: "Nos encargamos de transformar tus ideas en espacios terminados.",
  BUSINESS_URL: "https://sole.tutecnotienda.site", // o dominio final
  BUSINESS_PHONE: "+56912345678", // Variable editable de teléfono
  BUSINESS_EMAIL: "contacto@soleespacios.cl", // Variable editable de correo
  WHATSAPP_NUMBER: "56912345678", // Variable editable: ingresar código país + número sin '+' ni espacios
  BUSINESS_CITY: "Santiago",
  BUSINESS_REGION: "Región Metropolitana",
  BUSINESS_COUNTRY: "Chile",
  BUSINESS_SCHEDULE: "Lunes a Viernes de 09:00 a 18:30 hrs",
  BUSINESS_LOGO: "/assets/img/logo-sole.png",
  WHATSAPP_DEFAULT_MSG: "Hola SOLE, quisiera consultar por un proyecto de construcción o remodelación."
};

// ==========================================================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
  initHeaderScroll();
  initMobileMenu();
  initFAQAccordion();
  initQuoteForm();
  initAnalyticsTracking();
});

// ==========================================================================
// 1. Enlaces dinámicos de WhatsApp
// ==========================================================================
function initWhatsAppLinks() {
  const whatsappUrl = `https://wa.me/${SOLE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(SOLE_CONFIG.WHATSAPP_DEFAULT_MSG)}`;
  
  // Asignar url a todos los elementos con clase o atributo whatsapp
  const whatsappElements = document.querySelectorAll(".js-whatsapp-link, #whatsappFloatingBtn");
  whatsappElements.forEach(el => {
    el.setAttribute("href", whatsappUrl);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

// ==========================================================================
// 2. Efecto de Scroll en Header
// ==========================================================================
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

// ==========================================================================
// 3. Menú Móvil Hamburguesa
// ==========================================================================
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const drawer = document.querySelector(".mobile-menu-drawer");
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    drawer.classList.toggle("open");
    const isOpen = drawer.classList.contains("open");
    toggleBtn.setAttribute("aria-expanded", isOpen);
    toggleBtn.innerHTML = isOpen ? "✕" : "☰";
  });

  // Cerrar al hacer clic en un enlace
  const links = drawer.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.innerHTML = "☰";
    });
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("open") && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.innerHTML = "☰";
    }
  });
}

// ==========================================================================
// 4. Preguntas Frecuentes (FAQ Accordion)
// ==========================================================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      // Cerrar otros
      faqItems.forEach(other => other.classList.remove("active"));
      // Toggle actual
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// ==========================================================================
// 5. Formulario de Cotización Profesional
// ==========================================================================
function initQuoteForm() {
  const form = document.getElementById("quoteForm");
  const feedback = document.getElementById("quoteFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Extraer datos del formulario
    const formData = new FormData(form);
    const data = {
      nombre: formData.get("nombre") || "",
      telefono: formData.get("telefono") || "",
      email: formData.get("email") || "",
      comuna: formData.get("comuna") || "",
      tipoProyecto: formData.get("tipoProyecto") || "",
      etapa: formData.get("etapa") || "",
      presupuesto: formData.get("presupuesto") || "No especificado",
      descripcion: formData.get("descripcion") || ""
    };

    // Validar campos requeridos
    if (!data.nombre || !data.telefono || !data.email || !data.tipoProyecto) {
      alert("Por favor completa los campos requeridos para coordinar tu cotización.");
      return;
    }

    // Registrar evento de analítica
    triggerAnalyticsEvent("form_submission_quote", {
      project_type: data.tipoProyecto,
      commune: data.comuna
    });

    // Mensaje de éxito en pantalla
    form.style.display = "none";
    feedback.style.display = "block";
    feedback.innerHTML = `
      <div style="font-size: 2.2rem; margin-bottom: 12px;">✓</div>
      <h3 style="color: #294F68; margin-bottom: 10px;">¡Gracias por contactarnos, ${data.nombre}!</h3>
      <p style="color: #4A6572; margin-bottom: 20px;">
        Hemos recibido tu solicitud de cotización para <strong>${data.tipoProyecto}</strong>. 
        Nuestro equipo de proyectos revisará tus requerimientos y te contactará a la brevedad para coordinar la visita técnica y levantamiento inicial.
      </p>
      <div style="margin-top: 15px;">
        <a href="https://wa.me/${SOLE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola SOLE, acabo de enviar una cotización para un proyecto de ${data.tipoProyecto} a nombre de ${data.nombre}.`)}" target="_blank" class="btn btn-whatsapp" style="display: inline-flex;">
          Enviar copia por WhatsApp directo →
        </a>
      </div>
    `;

    // Smooth scroll hacia el mensaje de confirmación
    feedback.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// ==========================================================================
// 6. Preparación para Analítica (Google Analytics 4 / GTM / Meta Pixel)
// ==========================================================================
function initAnalyticsTracking() {
  // Rastreo de clics a WhatsApp
  document.querySelectorAll(".js-whatsapp-link, #whatsappFloatingBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      triggerAnalyticsEvent("click_whatsapp", { location: "site_button" });
    });
  });

  // Rastreo de clics a llamada telefónica
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener("click", () => {
      triggerAnalyticsEvent("click_phone", { phone_number: link.getAttribute("href") });
    });
  });

  // Rastreo de botones de cotización
  document.querySelectorAll('a[href="#cotizacion"]').forEach(link => {
    link.addEventListener("click", () => {
      triggerAnalyticsEvent("click_quote_cta", { cta_text: link.innerText.trim() });
    });
  });
}

function triggerAnalyticsEvent(eventName, params = {}) {
  // Soporte Google Analytics 4 (gtag)
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  // Soporte Google Tag Manager dataLayer
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...params
    });
  }
  // Soporte Meta Pixel (fbq)
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }
}
