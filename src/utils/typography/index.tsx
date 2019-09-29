import Typography from "typography"
import CodePlugin from "typography-plugin-code"
import Wordpress2016 from "typography-theme-wordpress-2016"

import * as Colors from "consts/Colors"
import { store } from "state"
import "css/typography.css"

Wordpress2016.headerFontFamily = ["Cereal"]
Wordpress2016.bodyFontFamily = ["Cereal"]

Wordpress2016.overrideThemeStyles = () => {
  // This is the current state when `injectStyles()` is fired
  const { isDarkMode }: { isDarkMode: boolean } = store.getState()
  return {
    ".Card": {
      background: isDarkMode ? Colors.blackLight : Colors.silverLight,
    },
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    h1: {
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
    "h1, h2, h3, h4, h5, h6, p, label, span, li": {
      color: isDarkMode ? Colors.silverLight : Colors.blackDark,
    },
    small: {
      color: isDarkMode ? Colors.greyLighter : Colors.grey,
    },
    /**
     * The following style tag updates any prismjs code block styling generated by markdown.
     * It fixes issues with aligning line-numbers.
     */
    "span.token.parameter": {
      color: "white",
    },
    "div.gatsby-highlight": {
      backgroundColor: isDarkMode ? Colors.blackLighter : Colors.greyDark,
      borderRadius: `0.3em`,
      margin: `0.5em 0`,
      padding: `1em`,
      overflow: `auto`,
    },
    '.gatsby-highlight pre[class*="language-"].line-numbers': {
      backgroundColor: isDarkMode ? Colors.blackLighter : Colors.greyDark,
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
  console.log("currentValue", currentValue)

  if (previousValue !== currentValue) {
    console.log(
      "**isDarkMode** changed from",
      previousValue,
      "to",
      currentValue,
      "...typography will be injecting styles now"
    )
    typography.injectStyles()
  }
})

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
