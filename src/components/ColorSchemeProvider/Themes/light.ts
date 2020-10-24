import * as Colors from "consts/Colors"

const formInput = {
  background: Colors.silverLighter,
  borderColorBase: Colors.greyLighter,
  borderColorFocus: Colors.blackDarker,
  borderColorError: "#e00",
  color: Colors.blackDarker,
}

const formButton = {
  background: Colors.blackDarker,
  backgroundDisabled: Colors.silverLighter,
  backgroundHover: Colors.silverLighter,
  borderColorDisabled: Colors.greyLighter,
  color: Colors.silverLighter,
  colorHover: Colors.blackDarker,
}

const commentRenderer = {
  borderColor: Colors.greyLighter,
}

const lightTheme = {
  formInput,
  formButton,
  commentRenderer,
}

export default lightTheme
