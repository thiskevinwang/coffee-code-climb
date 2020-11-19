import React, { useState, useReducer, useEffect, useCallback } from "react"
import type { PageProps } from "gatsby"
import { useSelector } from "react-redux"
import { useSpring } from "react-spring"

import Layout from "./layout"
import Layout2 from "./layout2"
import { RootState } from "_reduxState"
import { FunButtonsModal } from "components/FunButtonsModal"

import * as Colors from "consts/Colors"

interface Props {
  location: PageProps["location"]
}
/**
 * ⚠️ Don't destructure props!
 */
const LayoutManager: React.FC<Props> = (props) => {
  const { pathname } = props.location
  const [showModal, setShowModal] = useState(false)
  const [shouldExit, setShouldExit] = useState(false)
  const [neverShowModalChecked, toggleNeverShowModalChecked] = useReducer(
    (s: boolean) => !s,
    false
  )

  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const layoutVersion = useSelector((state: RootState) => state.layoutVersion)

  const neverModalShowAgain =
    typeof window !== "undefined" &&
    window.localStorage.getItem("neverModalShowAgain")

  /**
   * mount
   * ...if neverModalShowAgain is not in local storage
   * 1. toggle modal TRUE
   * 2. increase opacity to 1
   */
  useEffect(() => {
    if (!neverModalShowAgain && pathname === "/") {
      setTimeout(() => {
        setShowModal(true)
        setModalProps({ opacity: 1 })
      }, 2000)
    }
  }, [neverModalShowAgain, pathname])

  const [{ opacity, modalBackground, fill }, setModalProps] = useSpring(() => ({
    opacity: showModal ? 1 : 0,
    modalBackground: isDarkMode ? Colors.blackDarker : Colors.silverLighter,
    fill: isDarkMode ? Colors.silverLighter : Colors.blackDarker,
  }))

  /**
   * side effect of `shouldExit`
   * 1. decrease opacity to 0
   * 2. then toggle modal FALSE
   */
  //TODO DELAY THIS by 1ish second
  useEffect(() => {
    if (shouldExit) {
      setModalProps({
        opacity: 0,
        onRest: () => {
          setShowModal(false)
        },
      })
    }
  }, [shouldExit])

  useEffect(() => {
    setModalProps({
      modalBackground: isDarkMode ? Colors.blackDarker : Colors.silverLighter,
      fill: isDarkMode ? Colors.silverLighter : Colors.blackDarker,
    })
  }, [isDarkMode])

  const renderLayout = useCallback(() => {
    switch (layoutVersion) {
      case 1:
        return <Layout {...props} />
      case 2:
        return <Layout2 {...props} />
      default:
        return <Layout {...props} />
    }
  }, [layoutVersion, props])
  return (
    <>
      {showModal && (
        <FunButtonsModal
          animatedOpacity={opacity}
          // contentOpacity={contentOpacity}
          animatedModalBackground={modalBackground}
          animatedFill={fill}
          // modalWidth={modalWidth}
          // modalHeight={modalHeight}
          shouldExit={shouldExit}
          setShouldExit={setShouldExit}
          neverShowModalChecked={neverShowModalChecked}
          toggleNeverShowModalChecked={toggleNeverShowModalChecked}
        />
      )}
      {renderLayout()}
    </>
  )
}

export { LayoutManager }
