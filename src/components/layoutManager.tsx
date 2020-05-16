import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import { useSpring, useChain, animated, AnimatedValue } from "react-spring"

import Layout from "./layout"
import Layout2 from "./layout2"
import { setLayoutVersion, RootState } from "_reduxState"
import { rhythm } from "utils/typography"
import { FunButtonsModal } from "components/FunButtonsModal"

import * as Colors from "consts/Colors"

const LayoutManager = (props) => {
  const [showModal, toggleModal] = useReducer((s: boolean) => !s, false)
  const [shouldExit, setShouldExit] = useState(false)
  const [neverShowModalChecked, toggleNeverShowModalChecked] = useReducer(
    (s: boolean) => !s,
    false
  )

  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const layoutVersion = useSelector((state: RootState) => state.layoutVersion)
  const dispatch = useDispatch()

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
    !neverModalShowAgain &&
      setTimeout(() => {
        toggleModal(true)
        setModalProps({ opacity: 1 })
      }, 2000)
  }, [])

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
          toggleModal()
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
