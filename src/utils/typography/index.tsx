import Typography from "typography"
import CodePlugin from "typography-plugin-code"
import Wordpress2016 from "typography-theme-wordpress-2016"
import * as Colors from "consts/Colors"
import { store } from "src/state"

Wordpress2016.overrideThemeStyles = () => {
  // This is the current state when `injectStyles()` is fired
  const { isDarkMode }: { isDarkMode: boolean } = store.getState()
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    "h1, h2, h3, h4, h5, h6, p, label, span": {
      color: isDarkMode ? Colors.silverLight : Colors.blackDark,
    },
    small: {
      color: isDarkMode ? Colors.greyLighter : Colors.grey,
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

// Everytime the store updates, `injectStyles() is called
store.subscribe(() => {
  typography.injectStyles()
})

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
