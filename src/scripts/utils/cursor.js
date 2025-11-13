import MouseFollower from "mouse-follower"
import gsap from "gsap"

function customCursor() {

  // BLOB CURSOR FOLLOWER SETUP ANS STATE MANAGEMENT
  MouseFollower.registerGSAP(gsap);

  const cursor = new MouseFollower({
    el: null,
    container: document.body,
    className: 'mf-cursor',
    innerClassName: 'mf-cursor-inner',
    textClassName: 'mf-cursor-text',
    mediaClassName: 'mf-cursor-media',
    mediaBoxClassName: 'mf-cursor-media-box',
    iconSvgClassName: 'mf-svgsprite',
    iconSvgNamePrefix: '-',
    iconSvgSrc: '',
    dataAttr: 'cursor',
    hiddenState: '-hidden',
    textState: '-text',
    iconState: '-icon',
    activeState: '-active',
    mediaState: '-media',
    stateDetection: {
        '-pointer': 'a,button',
        '-hidden': 'iframe'
    },
    visible: true,
    visibleOnState: false,
    speed: 0.55,
    ease: 'expo.out',
    overwrite: true,
    skewing: 0,
    skewingText: 2,
    skewingIcon: 2,
    skewingMedia: 2,
    skewingDelta: 0.001,
    skewingDeltaMax: 0.15,
    stickDelta: 0.15,
    showTimeout: 20,
    hideOnLeave: true,
    hideTimeout: 300,
    hideMediaTimeout: 300
  });

  // Rotación continua del cursor (imagen asterisco)
  // Usamos una variable CSS custom para rotar el :before sin interferir con el movimiento del cursor
  const initRotation = () => {
    const cursorElement = document.querySelector('.mf-cursor');
    if (cursorElement) {
      // Inicializar la variable CSS
      cursorElement.style.setProperty('--cursor-rotation', '0deg');
      
      // Animación continua usando variable CSS
      gsap.to(cursorElement, {
        '--cursor-rotation': '360deg',
        duration: 3, // Ajusta la velocidad (menor = más rápido)
        ease: 'none',
        repeat: -1, // Infinito
        modifiers: {
          '--cursor-rotation': (value) => `${parseFloat(value)}deg`
        }
      });
    } else {
      // Reintentar si el cursor aún no está en el DOM
      setTimeout(initRotation, 100);
    }
  };

  // Inicializar rotación después de un pequeño delay para asegurar que el cursor esté renderizado
  setTimeout(initRotation, 200);
}

export default customCursor 