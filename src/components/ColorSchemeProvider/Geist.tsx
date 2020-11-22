import { createGlobalStyle, css } from "styled-components"

type Props = { isDarkMode: boolean }
export const Geist = createGlobalStyle<Props>`
  :root {
    --geist-success-lighter: #d3e5ff;
    --geist-success-light: #3291ff;
    --geist-success: #0070f3;
    --geist-success-dark: #0761d1;
    --geist-error-lighter: #f7d4d6;
    --geist-error-light: #ff1a1a;
    --geist-error: #e00;
    --geist-error-dark: #c50000;
    --geist-warning-lighter: #ffefcf;
    --geist-warning-light: #f7b955;
    --geist-warning: #f5a623;
    --geist-warning-dark: #ab570a;
    --geist-violet-lighter: #e3d7fc;
    --geist-violet-light: #8a63d2;
    --geist-violet: #7928ca;
    --geist-violet-dark: #4c2889;
    --geist-cyan-lighter: #aaffec;
    --geist-cyan-light: #79ffe1;
    --geist-cyan: #50e3c2;
    --geist-cyan-dark: #29bc9b;
    --geist-highlight-purple: #f81ce5;
    --geist-highlight-magenta: #eb367f;
    --geist-highlight-pink: #ff0080;
    --geist-highlight-yellow: #fff500;
    --geist-foreground: #000;
    --geist-background: #fff;
    --geist-selection: var(--geist-cyan-light);
    --accents-1: #fafafa;
    --accents-2: #eaeaea;
    --accents-3: #999;
    --accents-4: #888;
    --accents-5: #666;
    --accents-6: #444;
    --accents-7: #333;
    --accents-8: #111;
    --geist-link-color: var(--geist-success);
    --geist-marketing-gray: #fafbfc;
    --geist-code: var(--geist-highlight-purple);
    --geist-secondary-lighter: var(--accents-2);
    --geist-secondary-light: var(--accents-3);
    --geist-secondary: var(--accents-5);
    --geist-secondary-dark: var(--accents-7);
    --dropdown-box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
    --dropdown-triangle-stroke: #fff;
    --scroller-start: #fff;
    --scroller-end: hsla(0, 0%, 100%, 0);
    --shadow-smallest: 0px 4px 8px rgba(0, 0, 0, 0.12);
    --shadow-small: 0 5px 10px rgba(0, 0, 0, 0.12);
    --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.12);
    --shadow-large: 0 30px 60px rgba(0, 0, 0, 0.12);
    --shadow-hover: 0 30px 60px rgba(0, 0, 0, 0.12);
    --shadow-sticky: 0 12px 10px -10px rgba(0, 0, 0, 0.12);
    --portal-opacity: 0.25;
    --wv-green: #0cce6b;
    --wv-orange: #ffa400;
    --wv-red: #ff4e42;

    ${(p) =>
      p.isDarkMode &&
      css`
        --geist-foreground: #fff;
        --geist-background: #000;
        --geist-selection: var(--geist-highlight-purple);
        --accents-8: #fafafa;
        --accents-7: #eaeaea;
        --accents-6: #999;
        --accents-5: #888;
        --accents-4: #666;
        --accents-3: #444;
        --accents-2: #333;
        --accents-1: #111;
        --geist-secondary-lighter: var(--accents-2);
        --geist-secondary-light: var(--accents-3);
        --geist-secondary: var(--accents-5);
        --geist-secondary-dark: var(--accents-7);
        --geist-link-color: var(--geist-success-light);
        --geist-marketing-gray: var(--accents-1);
        --geist-code: var(--geist-cyan-light);
        --geist-error-light: #f33;
        --geist-error: red;
        --geist-error-dark: #e60000;
        --dropdown-box-shadow: 0 0 0 1px var(--accents-2);
        --dropdown-triangle-stroke: #333;
        --scroller-start: #000;
        --scroller-end: transparent;
        --header-background: rgba(0, 0, 0, 0.5);
        --header-border-bottom: inset 0 -1px 0 0 hsla(0, 0%, 100%, 0.1);
        --shadow-smallest: 0 0 0 1px var(--accents-2);
        --shadow-small: 0 0 0 1px var(--accents-2);
        --shadow-medium: 0 0 0 1px var(--accents-2);
        --shadow-large: 0 0 0 1px var(--accents-2);
        --shadow-sticky: 0 0 0 1px var(--accents-2);
        --shadow-hover: 0 0 0 1px var(--geist-foreground);
        --portal-opacity: 0.75;
      `}
  }
`
