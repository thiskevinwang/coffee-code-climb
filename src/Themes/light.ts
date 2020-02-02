import * as Colors from "consts/Colors"

enum formInput {
  background = Colors.silverLighter,
  borderColorBase = Colors.greyLighter,
  borderColorFocus = Colors.blackDarker,
  borderColorError = "#e00",
  color = Colors.blackDarker,
}

enum formButton {
  background = Colors.blackDarker,
  backgroundDisabled = Colors.silverLighter,
  backgroundHover = Colors.silverLighter,
  borderColorDisabled = Colors.greyLighter,
  color = Colors.silverLighter,
  colorHover = Colors.blackDarker,
}

enum commentRenderer {
  borderColor = Colors.greyLighter,
}

const lightTheme = {
  formInput,
  formButton,
  commentRenderer,
  background: Colors.silverLighter,
}

export default lightTheme
