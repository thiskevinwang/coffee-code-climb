import * as Colors from "consts/Colors"

const formInput = {
  background: Colors.blackDarker,
  borderColorBase: Colors.greyDarker,
  borderColorFocus: Colors.silverLighter,
  borderColorError: "#a00",
  color: Colors.silverLighter,
}

const formButton = {
  background: Colors.silverLighter,
  backgroundDisabled: Colors.blackDarker,
  backgroundHover: Colors.blackDarker,
  borderColorDisabled: Colors.greyDarker,
  color: Colors.blackDarker,
  colorHover: Colors.silverLighter,
}

const commentRenderer = {
  borderColor: Colors.greyDarker,
}

const darkTheme = {
  formInput,
  formButton,
  commentRenderer,
}

export default darkTheme
