import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import Layout from "./layout"
import Layout2 from "./layout2"
import { setLayoutVersion } from "state"
import { rhythm } from "utils/typography"

const LayoutManager = props => {
  const layoutVersion = useSelector(state => state.layoutVersion)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("layoutVersion", layoutVersion)

    const handleKeypress = e => {
      switch (e.key) {
        case "1":
          return dispatch(setLayoutVersion(1))
        case "2":
          return dispatch(setLayoutVersion(2))
        case "3":
          return dispatch(setLayoutVersion(3))
        default:
          return
      }
    }

    window.addEventListener("keypress", handleKeypress)
    return () => {
      window.removeEventListener("keypress", handleKeypress)
    }
  }, [layoutVersion])

  switch (layoutVersion) {
    case 1:
      return <Layout {...props} />
    case 2:
      return <Layout2 {...props} />
    default:
      return <Layout {...props} />
  }
}

export { LayoutManager }
