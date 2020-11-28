import { createGlobalStyle, css } from "styled-components"

type Props = { isDarkMode: boolean }
export const GlobalStyles = createGlobalStyle<Props>`
  #___gatsby {
    position: relative;
  }
  .TOC {
    transition-property: color, font-weight, box-shadow;
    transition-duration: 200ms;
    transition-timing-function: ease-in-out;
    font-weight: 300;
    
    /* override built in <a> styling */
    box-shadow: none;
    :hover {
      box-shadow: var(--purple-or-cyan) 0px -1px 0px inset;
    }
  }
    
  .TOC.TOC__FOCUS {
    color: var(--purple-or-cyan);
    font-weight: 700;
    box-shadow: var(--purple-or-cyan) 0px -1px 0px inset;

    > code {
      color: var(--purple-or-cyan);;
    }
  }
  
  .HEADER {
    transition: color 200ms ease-in-out;
    will-change: color;
  }
    
  .HEADER.HEADER__FOCUS {
    color: var(--purple-or-cyan);

    > code {
      color: var(--purple-or-cyan);
    }
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
