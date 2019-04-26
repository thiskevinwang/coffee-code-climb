export const styles = {
  bg1: {
    position: "fixed",
    top: 0,
    left: 0,
    height: `50%`,
    width: `100%`,
    // Removing this line fixes a UI issue when hard-refreshing on Chrome
    // background: `linear-gradient(150deg, ${DARK} 15%, ${DARKER} 35%, ${MID} 55%, ${LIGHTER} 70%, ${LIGHT} 94%)`,
    opacity: 0.7,
    transform: `skewY(-6deg)`,
    transformOrigin: `top left`,
    zIndex: -10,
  },
  dottedBackground: {
    position: "fixed",
    top: 0,
    right: 0,
    height: `100%`,
    width: `30%`,
    transform: `skewX(6deg)`,
    transformOrigin: `top right`,
    zIndex: -9,
  },
  draggableGlass: {
    width: 200,
    height: 200,
    // glass-like
    background: `linear-gradient(150deg, rgba(255,255,255,0.9) 15%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0.8) 94%)`,
    zIndex: 9999,
    position: "absolute",
  },
}