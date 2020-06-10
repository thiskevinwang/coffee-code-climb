import Typography from "typography"
import CodePlugin from "typography-plugin-code"
import Wordpress2016 from "typography-theme-wordpress-2016"

import "css/typography.css"

Wordpress2016.headerFontFamily = ["Cereal"]
Wordpress2016.bodyFontFamily = ["Cereal"]
// const __geist_cyan = "#79ffe1"
// const __geist_purple = "#f81ce5"

Wordpress2016.overrideThemeStyles = () => {
  return {
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
      color: "var(--text)",
    },
    "th, td": {
      borderBottomColor: "var(--table-border)",
    },
    "th:first-child, td:first-child": {
      borderLeft: `10px solid var(--table-border)`,
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
      border: `1px dashed var(--details-border)`,
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
      fill: "var(--table-border)",
      transition: "fill 200ms ease-in-out",
    },
    "a.anchor:hover > svg": {
      fill: "var(--text)",
    },
    small: {
      color: "var(--details-border)",
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

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
