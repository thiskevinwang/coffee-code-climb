import React, { useState, useReducer, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import { useSpring, useChain, animated, AnimatedValue } from "react-spring"

import Layout from "./layout"
import Layout2 from "./layout2"
import { setLayoutVersion, RootState } from "_reduxState"
import { rhythm } from "utils/typography"
import { FunButtonsModal } from "components/FunButtonsModal"

import * as Colors from "consts/Colors"

const LayoutManager = props => {
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

  const resizeRef = useRef()
  const { modalWidth, modalHeight } = useSpring({
    ref: resizeRef,
    from: { modalWidth: 0, modalHeight: 0 },
    to: { modalWidth: shouldExit ? 0 : 25, modalHeight: shouldExit ? 0 : 50 },
  })

  const contentOpacityRef = useRef()
  const { contentOpacity } = useSpring({
    ref: contentOpacityRef,
    from: { contentOpacity: 0 },
    to: { contentOpacity: shouldExit ? 0 : 1 },
  })

  // useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6])
  useChain(
    shouldExit
      ? [contentOpacityRef, resizeRef]
      : [resizeRef, contentOpacityRef],
    shouldExit ? [0, 0] : [2.1, 3]
  )

  /**
   * side effect of `shouldExit`
   * 1. decrease opacity to 0
   * 2. then toggle modal FALSE
   */
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

  return (
    <>
      {showModal && (
        <FunButtonsModal
          animatedOpacity={opacity}
          contentOpacity={contentOpacity}
          animatedModalBackground={modalBackground}
          animatedFill={fill}
          modalWidth={modalWidth}
          modalHeight={modalHeight}
          setShouldExit={setShouldExit}
          neverShowModalChecked={neverShowModalChecked}
          toggleNeverShowModalChecked={toggleNeverShowModalChecked}
        />
      )}
      {(() => {
        switch (layoutVersion) {
          case 1:
            return <Layout {...props} />
          case 2:
            return <Layout2 {...props} />
          default:
            return <Layout {...props} />
        }
      })()}
    </>
  )
}

export { LayoutManager }
