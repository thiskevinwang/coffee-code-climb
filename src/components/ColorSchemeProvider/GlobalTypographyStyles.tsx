import { createGlobalStyle, css } from "styled-components"
import { Colors } from "consts/Colors"

// github boxshadow - figure out inset... later
// 0 1px 0 rgba(27,31,35,.1), inset 0 1px 0 hsla(0,0%,100%,.03);

type Props = { isDarkMode: boolean }
export const GlobalTypographyStyles = createGlobalStyle<Props>`
  :root {
    --purple-or-cyan: ${(p) => (p.isDarkMode ? Colors.PURPLE : Colors.CYAN)};
    /* var(--text) */
    --text: ${(p) => (p.isDarkMode ? Colors.SILVER_LIGHT : Colors.BLACK_DARK)};
    --background: ${(p) =>
      p.isDarkMode ? Colors.BLACK_LIGHTER : Colors.SILVER_LIGHTER};
    --shadow: ${(p) =>
      p.isDarkMode ? "0 1px 0 rgba(27,31,35,.9)" : "0 1px 0 rgba(27,31,35,.1)"};
    --table-border: ${(p) =>
      p.isDarkMode ? Colors.GREY_DARKER : Colors.GREY_LIGHTER};
    --details-border: ${(p) =>
      p.isDarkMode ? Colors.GREY_LIGHTER : Colors.GREY};
    --blockquote-text: ${(p) =>
      p.isDarkMode ? Colors.GREY_LIGHT : Colors.GREY_DARK};
    --blockquote-background: ${(p) =>
      p.isDarkMode ? Colors.BLACK : Colors.SILVER};
    --blockquote-border-left: ${(p) =>
      p.isDarkMode ? Colors.BLACK_LIGHTER : Colors.SILVER_DARKER};
    --gatsby-highlight-background-color: ${(p) =>
      p.isDarkMode ? Colors.BLACK_LIGHTER : Colors.GREY_DARK};
  }

  ::selection {
     background: var(--purple-or-cyan);
  }
  pre {
    color: var(--text);
  }
  s {
    text-decoration-line: line-through;
    text-decoration-color: var(--purple-or-cyan);
    text-decoration-style: wavy;
  }
  a {
    color: var(--text);
    text-shadow: var(--shadow);
    transition: color 200ms ease-in-out;
    :hover {
      color: var(--purple-or-cyan);
    }
    /* box-shadow: var(--purple-or-cyan) 0px -5px 0px inset;
    transition: box-shadow 200ms ease-in-out;

    :hover {
      box-shadow: var(--purple-or-cyan) 0px -1.5rem 0px inset;
    } */
  }

  /**
     * The following style tag updates any prismjs code block styling generated by markdown.
     * It fixes issues with aligning line-numbers.
     */
    span.token.parameter {
      color: white;
    }
    div.gatsby-highlight {
      background-color: var(--gatsby-highlight-background-color);
      border-radius: 0.3em;
      margin: 0.5em 0;
      padding: 1em;
      overflow: auto;
    }
    .gatsby-highlight pre[class*="language-"].line-numbers {
      background-color: var(--gatsby-highlight-background-color);
      font-family: "Dank Mono", "Fira Code", "Operator Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      padding: 0;
      padding-left: 2.8em;
      overflow: initial;
    }
    .gatsby-highlight pre[class*="language-"] > code {
      font-family:
        "Dank Mono", "Fira Code", "Operator Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    }
    .gatsby-highlight pre[class*="language-"] > code .comment {
      font-style: italic;
    }

    /* markdown quotes */
    blockquote {
      font-style: unset;
      background: var(--blockquote-background);
      border-left-color: var(--blockquote-border-left);
      font-size: 1rem;
      margin-left: 0;
      margin-right: 0;
    }
    blockquote p {
      color: var(--blockquote-text);
    }
`
