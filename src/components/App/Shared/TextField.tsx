import { withStyles } from "@material-ui/core/styles"
import MuiTextField from "@material-ui/core/TextField"

export const TextField = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-adornedStart": {
      // remove auto added padding when
      // 'startAdornment' is present
      paddingLeft: "0",
    },
    "& label.Mui-focused": {},
    "& .MuiInput-underline:after": {},
    "& .MuiOutlinedInput-root": {
      // hack to hide 'startAdornment' background
      // from bleeding over the rounded border
      overflow: "hidden",
      height: 40,
      // Input
      "& input": {
        color: "var(--geist-foreground)",
        "&.Mui-disabled": {
          cursor: "not-allowed",
          color: "var(--accents-3)",
        },
      },
      // Border
      "& fieldset": {
        borderColor: "var(--accents-3)",
        transition: theme.transitions.create(["border-color"], {
          easing: theme.transitions.easing.easeInOut,
        }),
      },
      "&:hover": {
        "& fieldset": {
          borderColor: "var(--geist-foreground)",
        },
        "&.Mui-error": {
          "& fieldset": {
            borderColor: "var(--geist-error)",
          },
        },
      },
      "&.Mui-focused": {
        "& fieldset": {
          borderColor: "var(--geist-foreground)",
        },
        "&.Mui-error": {
          "& fieldset": {
            borderColor: "var(--geist-error)",
          },
        },
      },
      "&.Mui-disabled": {
        "& fieldset": {
          borderColor: "var(--accents-3)",
        },
      },
    },

    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      // don't conflict with `fullWidth` prop
      "&:not(&.MuiInputBase-fullWidth)": {
        width: "40ch",
      },
    },
  },
}))(MuiTextField)

TextField.defaultProps = {
  variant: "outlined",
}
