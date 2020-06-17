import { createGlobalStyle, css } from "styled-components"
import { Colors } from "consts/Colors"

export const GlobalStyles = createGlobalStyle`
  .TOC {
    transition-property: font-size, box-shadow;
    transition-duration: "200ms";
    transition-timing-function: "ease-in-out";
  }
    
  .TOC.TOC__FOCUS {
    font-size: 24px !important;
    will-change: font-size;
  }
  
  .HEADER {
    transition: color 200ms ease-in-out;
    will-change: color;
  }
    
  .HEADER.HEADER__FOCUS {
    color: ${(props) => (props.isDarkMode ? Colors.PURPLE : Colors.CYAN)};
  }

  .Card {
    background: ${(props) =>
      props.isDarkMode ? Colors.BLACK_LIGHT : Colors.SILVER_LIGHT};
  }

  ${(props) =>
    props.isDarkMode &&
    css`
      .MuiSkeleton-wave {
        background: rgba(255, 255, 255, 0.05) !important;
      }
      .MuiSkeleton-wave::after {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.14),
          transparent
        ) !important;
      }
    `}
`
