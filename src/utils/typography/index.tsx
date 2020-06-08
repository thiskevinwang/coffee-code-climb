import Typography from "typography"
import CodePlugin from "typography-plugin-code"
import Wordpress2016 from "typography-theme-wordpress-2016"

import { Colors } from "consts/Colors"
import { store } from "_reduxState"
import "css/typography.css"

Wordpress2016.headerFontFamily = ["Cereal"]
Wordpress2016.bodyFontFamily = ["Cereal"]
// const __geist_cyan = "#79ffe1"
// const __geist_purple = "#f81ce5"

Wordpress2016.overrideThemeStyles = () => {
  // This is the current state when `injectStyles()` is fired
  const { isDarkMode }: { isDarkMode: boolean } = store.getState()
  return {
    "::selection": {
      background: isDarkMode ? "#f81ce5" : "#79ffe1",
    },
    s: {
      textDecorationLine: "line-through",
      textDecorationColor: isDarkMode ? "#f81ce5" : "#79ffe1",
      textDecorationStyle: "wavy",
    },
    a: {
      color: isDarkMode ? Colors.SILVER_LIGHT : Colors.BLACK_DARK,
      boxShadow: `${isDarkMode ? "#f81ce5" : "#79ffe1"} 0px -5px 0px inset`,
      transition: `box-shadow 200ms ease-in-out`,
    },
    "a:hover": {
      boxShadow: `${isDarkMode ? "#f81ce5" : "#79ffe1"} 0px -1.5rem 0px inset`,
    },
    ".Card": {
      background: isDarkMode ? Colors.BLACK_LIGHT : Colors.SILVER_LIGHT,
    },
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    h1: {
      fontFamily: "Cereal",
      fontWeight: 900,
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 400,
    },
    h6: {
      fontWeight: 300,
    },
    p: {
      fontWeight: 300,
    },
    "h1, h2, h3, h4, h5, h6, p, label, span, li, td, th, summary": {
      color: isDarkMode ? Colors.SILVER_LIGHT : Colors.BLACK_DARK,
    },
    "th, td": {
      borderBottomColor: isDarkMode ? Colors.GREY_DARKER : Colors.GREY_LIGHTER,
    },
    "th:first-child, td:first-child": {
      borderLeft: `10px solid ${
        isDarkMode ? Colors.GREY_DARKER : Colors.GREY_LIGHTER
      }`,
      paddingLeft: "10px",
    },
    // details "closed" styling
    details: {
      borderRadius: `5px`,
      paddingTop: `1px`,
      paddingLeft: `9px`,
      paddingRight: `9px`,
    },
    "details[open]": {
      paddingTop: `0px`,
      paddingLeft: `8px`,
      paddingRight: `8px`,
      border: `1px dashed ${isDarkMode ? Colors.GREY_LIGHTER : Colors.GREY}`,
    },
    // indent <ul> & <ol> inside details
    "details > ul, details > ol": {
      marginLeft: `23px`,
    },
    "a.anchor": {
      // float: "none",
      // marginLeft: "auto",
    },
    "a.anchor > svg": {
      visibility: "visible !important",
      fill: isDarkMode ? Colors.GREY_DARKER : Colors.GREY_LIGHTER,
      transition: "fill 200ms ease-in-out",
    },
    "a.anchor:hover > svg": {
      fill: isDarkMode ? Colors.SILVER_LIGHT : Colors.BLACK_DARK,
    },
    small: {
      color: isDarkMode ? Colors.GREY_LIGHTER : Colors.GREY,
    },
    /**
     * The following style tag updates any prismjs code block styling generated by markdown.
     * It fixes issues with aligning line-numbers.
     */
    "span.token.parameter": {
      color: "white",
    },
    "div.gatsby-highlight": {
      backgroundColor: isDarkMode ? Colors.BLACK_LIGHTER : Colors.GREY_DARK,
      borderRadius: `0.3em`,
      margin: `0.5em 0`,
      padding: `1em`,
      overflow: `auto`,
    },
    '.gatsby-highlight pre[class*="language-"].line-numbers': {
      backgroundColor: isDarkMode ? Colors.BLACK_LIGHTER : Colors.GREY_DARK,
      fontFamily: `"Dank Mono", "Fira Code", "Operator Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace`,
      padding: 0,
      paddingLeft: `2.8em`,
      overflow: `initial`,
    },
    '.gatsby-highlight pre[class*="language-"] > code': {
      fontFamily:
        '"Dank Mono", "Fira Code", "Operator Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    },
    '.gatsby-highlight pre[class*="language-"] > code .comment': {
      fontStyle: `italic`,
    },
  }
}
Wordpress2016.plugins = [new CodePlugin()]

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

// Everytime the isDarkMode updates, `injectStyles() is called
let currentValue
store.subscribe(() => {
  let previousValue = currentValue
  currentValue = store.getState().isDarkMode

  if (previousValue !== currentValue) {
    typography.injectStyles()
  }
})

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
