import * as Colors from "consts/Colors"

enum formInput {
  background = Colors.blackDarker,
  borderColorBase = Colors.greyDarker,
  borderColorFocus = Colors.silverLighter,
  borderColorError = "#a00",
  color = Colors.silverLighter,
}

enum formButton {
  background = Colors.silverLighter,
  backgroundDisabled = Colors.blackDarker,
  backgroundHover = Colors.blackDarker,
  borderColorDisabled = Colors.greyDarker,
  color = Colors.blackDarker,
  colorHover = Colors.silverLighter,
}

const darkTheme = {
  formInput,
  formButton,
}

export default darkTheme
