import { createGlobalStyle, css } from "styled-components"
import { Colors } from "consts/Colors"

export const GlobalTypographyStyles = createGlobalStyle`
  :root {
    --purple-or-cyan: ${(props) =>
      props.isDarkMode ? Colors.PURPLE : Colors.CYAN};
    --text: ${(props) =>
      props.isDarkMode ? Colors.SILVER_LIGHT : Colors.BLACK_DARK};
    --table-border: ${(props) =>
      props.isDarkMode ? Colors.GREY_DARKER : Colors.GREY_LIGHTER};
    --details-border: ${(props) =>
      props.isDarkMode ? Colors.GREY_LIGHTER : Colors.GREY};
    --blockquote-text: ${(props) =>
      props.isDarkMode ? Colors.GREY_LIGHT : Colors.GREY_DARK};
    --blockquote-background: ${(props) =>
      props.isDarkMode ? Colors.BLACK : Colors.SILVER};
    --blockquote-border-left: ${(props) =>
      props.isDarkMode ? Colors.BLACK_LIGHTER : Colors.SILVER_DARKER};
    --gatsby-highlight-background-color: ${(props) =>
      props.isDarkMode ? Colors.BLACK_LIGHTER : Colors.GREY_DARK};
  }

  ::selection {
     background: var(--purple-or-cyan);
  }
  s {
    text-decoration-line: line-through;
    text-decoration-color: var(--purple-or-cyan);
    text-decoration-style: wavy;
  }
  a {
    color: var(--text);
    box-shadow: var(--purple-or-cyan) 0px -5px 0px inset;
    transition: box-shadow 200ms ease-in-out;

    :hover {
      box-shadow: var(--purple-or-cyan) 0px -1.5rem 0px inset;
    }
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