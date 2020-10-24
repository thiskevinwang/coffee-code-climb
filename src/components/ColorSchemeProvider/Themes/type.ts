export interface ThemeType {
  /**
   * This key is for `styled-theming`'s API
   */
  mode: "dark" | "light"
  [k: string]: any
}
