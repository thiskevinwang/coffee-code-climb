type GetContrast = (hexColor?: string) => "black" | "white" | undefined

/**
 * @see https://gomakethings.com/dynamically-changing-the-text-color-based-on-background-color-contrast-with-vanilla-js/
 */
export const getContrast: GetContrast = (hexColor) => {
  if (!hexColor) return
  // If a leading # is provided, remove it
  if (hexColor.slice(0, 1) === "#") {
    hexColor = hexColor.slice(1)
  }

  // Convert to RGB value
  const r = parseInt(hexColor.substr(0, 2), 16)
  const g = parseInt(hexColor.substr(2, 2), 16)
  const b = parseInt(hexColor.substr(4, 2), 16)

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast
  return yiq >= 128 ? "black" : "white"
}
