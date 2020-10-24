import { createGlobalStyle, css } from "styled-components"

import { Colors } from "consts/Colors"

/**
 * Classname for text selection preview
 */
export const SELECTION_PREVIEW_CLASS = "SELECTION_PREVIEW_CLASS"

interface GlobalStylesProps {
  isDarkMode: boolean
}

/**
 *
 */
export const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  .${SELECTION_PREVIEW_CLASS} {
    /* opacity: 0; */
    position: absolute;
    
    backdrop-filter: blur(5px);
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    padding: 10px;
    padding-left: 30px;

    transition: all 200ms ease-in-out;
    box-shadow: var(--shadow);
    
    ::before {
      content: '“';
      position: absolute;
      left: 5px;
      top: 0;
      font-size: 48px;
      line-height: 1;
    }

    ${(props) =>
      props.isDarkMode
        ? css`
            /* DARK */
            background-color: rgba(50, 50, 50, 0.5);
            border-color: ${Colors.PURPLE};

            ::before {
              color: white;
            }
          `
        : css`
            /* LIGHT */
            background-color: rgba(255, 255, 255, 0.5);
            border-color: ${Colors.CYAN};
          `}
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
