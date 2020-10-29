import { Colors } from "consts/Colors"
import type { ThemeType } from "./type"

const formInput = {
  background: Colors.SILVER_LIGHTER,
  borderColorBase: Colors.GREY_LIGHTER,
  borderColorFocus: Colors.BLACK_DARKER,
  borderColorError: "#e00",
  color: Colors.BLACK_DARKER,
}

const formButton = {
  background: Colors.BLACK_DARKER,
  backgroundDisabled: Colors.SILVER_LIGHTER,
  backgroundHover: Colors.SILVER_LIGHTER,
  borderColorDisabled: Colors.GREY_LIGHTER,
  color: Colors.SILVER_LIGHTER,
  colorHover: Colors.BLACK_DARKER,
}

const commentRenderer = {
  borderColor: Colors.GREY_LIGHTER,
}

export const lightTheme: ThemeType = {
  mode: "light",
  formInput,
  formButton,
  commentRenderer,
}
