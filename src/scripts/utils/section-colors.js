import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Cambia el color del body según la sección visible con transiciones suaves
 * @param {Object} options - Configuración
 * @param {Object} options.sectionColors - Mapa de selectores de sección a colores
 * @param {number} options.transitionDuration - Duración de la transición en segundos (default: 1)
 * @param {string} options.defaultColor - Color por defecto si no hay sección (default: transparent)
 */
export function initSectionColors(options = {}) {
  // Configuración por defecto
  const config = {
    sectionColors: {
      '#hero': '#EC532C', // orange
      '#intro-first': '#FBC346', // yellow (primera sección intro)
      '#intro-second': '#C7E6D5', // aquaGreen (segunda sección intro)
      '#intro-third': '#EC532C', // orange (tercera sección intro)
      '#about-us': '#103B60', // darkBlue
      '#work': '#0F8896', // turquoise
      '#products': '#EC532C', // orange
      '.contact, footer': '#103B60', // dark blue del footer
    },
    transitionDuration: 0,
    defaultColor: 'transparent',
    ...options
  };

  // Registrar ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Color actual del body
  let currentColor = config.defaultColor;
  const body = document.body;
  
  // Control de sección activa para evitar múltiples activaciones
  let activeSection = null;
  let changeTimeout = null;
  let isChanging = false;

  // Array para almacenar los triggers creados y sus secciones
  const triggers = [];
  const sectionData = [];

  // Primero, recopilar todas las secciones y ordenarlas por posición
  Object.entries(config.sectionColors).forEach(([selector, color]) => {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn(`SectionColors: No se encontró el selector "${selector}"`);
      return;
    }

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      
      sectionData.push({
        element,
        selector,
        color,
        top,
        name: element.id || element.className.split(' ')[0] || selector
      });
    });
  });

  // Ordenar por posición en el DOM
  sectionData.sort((a, b) => a.top - b.top);

  // Función para calcular qué sección tiene más área visible
  const getMostVisibleSection = () => {
    let maxArea = 0;
    let mostVisible = null;

    sectionData.forEach((section) => {
      const rect = section.element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calcular área visible de la sección en el viewport
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      // Solo considerar secciones que están realmente visibles
      if (visibleHeight > 0 && rect.bottom > 0 && rect.top < viewportHeight) {
        const visibleArea = visibleHeight * rect.width;
        
        if (visibleArea > maxArea) {
          maxArea = visibleArea;
          mostVisible = section;
        }
      }
    });

    return mostVisible;
  };

  // Función para cambiar el color con transición suave
  const changeBodyColor = (newColor, sectionName = '', force = false) => {
    // Si ya está cambiando y no es forzado, cancelar
    if (isChanging && !force) {
      return;
    }

    // Si ya es el color actual y la misma sección, no hacer nada
    if (currentColor === newColor && activeSection === sectionName) return;

    // Cancelar cambio pendiente si hay uno
    if (changeTimeout) {
      clearTimeout(changeTimeout);
    }

    // Usar un pequeño delay para agrupar cambios rápidos y verificar la sección más visible
    changeTimeout = setTimeout(() => {
      // Verificar cuál es realmente la sección más visible
      const mostVisible = getMostVisibleSection();
      
      // Si hay una sección más visible y no es la que se está intentando activar, usar esa
      if (mostVisible && mostVisible.name !== sectionName && !force) {
        // Usar la sección más visible en su lugar
        newColor = mostVisible.color;
        sectionName = mostVisible.name;
      }

      // Si ya es el color actual, no hacer nada
      if (currentColor === newColor && activeSection === sectionName) {
        changeTimeout = null;
        return;
      }

      isChanging = true;

      gsap.to(body, {
        backgroundColor: newColor,
        duration: config.transitionDuration,
        ease: 'power2.inOut',
        onComplete: () => {
          isChanging = false;
        }
      });

      // Mostrar en consola la sección en viewport
      if (sectionName) {
        console.log('📍 Sección en viewport:', sectionName, '| Color:', newColor);
      }

      currentColor = newColor;
      activeSection = sectionName;
      changeTimeout = null;
    }, 100); // Delay para agrupar cambios rápidos y verificar visibilidad
  };

  // Crear ScrollTriggers con mejor control de solapamiento
  sectionData.forEach((section, index) => {
    const trigger = ScrollTrigger.create({
      trigger: section.element,
      start: 'top 60%', // Más alto para evitar solapamientos tempranos
      end: 'bottom 40%', // Más bajo para evitar solapamientos tardíos
      // markers: true,
      onEnter: () => {
        // Verificar que esta sección sea realmente la más visible antes de cambiar
        const mostVisible = getMostVisibleSection();
        if (mostVisible && mostVisible.name === section.name) {
          changeBodyColor(section.color, section.name);
        }
      },
      onEnterBack: () => {
        const mostVisible = getMostVisibleSection();
        if (mostVisible && mostVisible.name === section.name) {
          changeBodyColor(section.color, section.name);
        }
      },
      onLeave: () => {
        // Cuando sale, verificar cuál es la siguiente sección más visible
        const mostVisible = getMostVisibleSection();
        if (mostVisible) {
          changeBodyColor(mostVisible.color, mostVisible.name, true);
        }
      },
      onLeaveBack: () => {
        // Cuando sale hacia atrás, verificar cuál es la sección más visible
        const mostVisible = getMostVisibleSection();
        if (mostVisible) {
          changeBodyColor(mostVisible.color, mostVisible.name, true);
        }
      }
    });
    
    triggers.push(trigger);
  });

  // Color inicial basado en la primera sección visible al cargar
  const setInitialColor = () => {
    // Ordenar las secciones por su posición en el DOM
    const allSections = [];
    Object.entries(config.sectionColors).forEach(([selector, color]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        allSections.push({ element, color, top: element.getBoundingClientRect().top + window.scrollY });
      });
    });

    // Ordenar por posición
    allSections.sort((a, b) => a.top - b.top);

    // Encontrar la primera sección visible
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    for (const section of allSections) {
      const rect = section.element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementBottom = elementTop + rect.height;

      // Si la sección está visible en el viewport
      if (elementTop < viewportBottom && elementBottom > viewportTop) {
        const sectionName = section.element.id || section.element.className.split(' ')[0] || 'unknown';
        changeBodyColor(section.color, sectionName);
        return;
      }
    }

    // Si no hay ninguna visible, usar la primera
    if (allSections.length > 0) {
      const sectionName = allSections[0].element.id || allSections[0].element.className.split(' ')[0] || 'unknown';
      changeBodyColor(allSections[0].color, sectionName);
    }
  };

  // Establecer color inicial después de que todo esté cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(setInitialColor, 100);
    });
  } else {
    setTimeout(setInitialColor, 100);
  }

  // Refrescar cuando el contenido dinámico se carga
  ScrollTrigger.addEventListener('refresh', () => {
    setTimeout(setInitialColor, 50);
  });

  // Limpiar al destruir
  return () => {
    triggers.forEach(trigger => trigger.kill());
  };
}

