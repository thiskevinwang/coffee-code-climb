import { Colors } from "consts/Colors"
import type { ThemeType } from "./type"

const formInput = {
  background: Colors.BLACK_DARKER,
  borderColorBase: Colors.GREY_DARKER,
  borderColorFocus: Colors.SILVER_LIGHTER,
  borderColorError: "#a00",
  color: Colors.SILVER_LIGHTER,
}

const formButton = {
  background: Colors.SILVER_LIGHTER,
  backgroundDisabled: Colors.BLACK_DARKER,
  backgroundHover: Colors.BLACK_DARKER,
  borderColorDisabled: Colors.GREY_DARKER,
  color: Colors.BLACK_DARKER,
  colorHover: Colors.SILVER_LIGHTER,
}

const commentRenderer = {
  borderColor: Colors.GREY_DARKER,
}

export const darkTheme: ThemeType = {
  mode: "dark",
  formInput,
  formButton,
  commentRenderer,
}
