export const switchVariant = (variant: string) => {
  switch (variant) {
    case "Like":
      return "👍"
    case "Love":
      return "❤️"
    case "Haha":
      return "🤣"
    case "Wow":
      return "😮"
    case "Sad":
      return "😢"
    case "Angry":
      return "😠"
    case "None":
      return ""
    default:
      return "..."
  }
}
