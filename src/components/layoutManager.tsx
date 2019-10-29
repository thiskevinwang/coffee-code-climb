import React, { useState, useReducer, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import { useSpring, useChain, animated } from "react-spring"

import Layout from "./layout"
import Layout2 from "./layout2"
import { setLayoutVersion, RootState } from "_reduxState"
import { rhythm } from "utils/typography"

const XIcon = (
  <svg viewBox="0 0 24 24" s>
    <g>
      <path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path>
    </g>
  </svg>
)
const XIconContainer = styled.div`
  border-radius: 100%;
  position: absolute;
  top: 0;
  right: 0;
  margin: 25px;
  height: 25px;
  width: 25px;

  transition: background 200ms ease-in-out;
  :hover {
    background: lightgrey;
  }
`

const ModalBackground = styled(animated.div)`
  background-color: rgba(40, 40, 45, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
  z-index: 9998;
`

const Modal = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-radius: 10px;
  padding: 0px 50px 50px 50px;
  height: 50%;
  width: 25%;
  background: white;
  position: fixed;
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  /* margin-top: 50%; */
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  z-index: 9999;

  @media (max-width: 769px) {
    height: auto;
    /* max-height: 500px; */
    width: auto;
    /* max-width: 300px; */

    margin-top: 25%;
    margin-right: 10%;
    margin-bottom: 25%;
    margin-left: 10%;
  }
`

const ModalTitleText = styled(animated.h2)`
  /* override typography */
  color: black;
  margin-bottom: 0;
  @media (max-width: 350px) {
    margin-top: 20%;
  }
`
const Key = styled(animated.p)`
  /* override typography */
  color: black;

  font-weight: 700;
  font-size: 20px;
  margin-bottom: 5px;
`

const ItemRowContainer = styled(animated.div)``
const ItemRow = styled(animated.div)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const ButtonContainer = styled(animated.div)``
const CheckboxContainer = styled(animated.div)`
  text-align: center;
`
const Checkbox = styled(animated.input)``
const Button = styled(animated.div)`
  /* position: absolute; */
  /* bottom: 0; */
  border-radius: 10px;
  border: 1px solid white;
  background: grey;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  color: white;
  transition: border 200ms ease-in-out;

  :hover {
    border: 1px solid black;
  }
`

const LayoutManager = props => {
  const [showModal, toggleModal] = useReducer((s: boolean) => !s, false)
  const [shouldExit, setShouldExit] = useState(false)
  const [neverShowModalChecked, toggleNeverShowModalChecked] = useReducer(
    (s: boolean) => !s,
    false
  )
  const layoutVersion = useSelector((state: RootState) => state.layoutVersion)
  const dispatch = useDispatch()

  const neverModalShowAgain =
    typeof window !== "undefined" &&
    window.localStorage.getItem("neverModalShowAgain")

  /**
   * mount
   * ...if neverModalShowAgain is not in local storage
   * 1. toggle modal
   * 2. increase opacity to 1
   */
  useEffect(() => {
    !neverModalShowAgain &&
      setTimeout(() => {
        toggleModal(true)
        setModalProps({ opacity: 1 })
      }, 2000)
  }, [])
  const [modalProps, setModalProps] = useSpring(() => ({
    opacity: showModal ? 1 : 0,
  }))

  /**
   * side effect of `shouldExit`
   * 1. decrease opacity to 0
   * 2. then toggle modal
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
        <>
          <Modal style={modalProps}>
            <XIconContainer
              onClick={() => {
                setShouldExit(true)
              }}
            >
              {XIcon}
            </XIconContainer>
            <ModalTitleText>Some Fun Buttons</ModalTitleText>

            <ItemRowContainer>
              <ItemRow>
                <Key>T</Key> Toggle Icon Trail
              </ItemRow>
              <ItemRow>
                <Key>S</Key> Slow Mo
              </ItemRow>
              <ItemRow>
                <Key>F</Key> ???
              </ItemRow>
              <ItemRow>
                <Key>R</Key> Reset
              </ItemRow>
              <ItemRow>
                <Key>D</Key> Dark Mode
              </ItemRow>
            </ItemRowContainer>

            <ButtonContainer>
              <CheckboxContainer>
                <Checkbox
                  type={"checkbox"}
                  value={neverShowModalChecked}
                  onChange={() => {
                    toggleNeverShowModalChecked()
                  }}
                />{" "}
                <small>Never show this again</small>
              </CheckboxContainer>
              <Button
                onClick={() => {
                  setShouldExit(true)
                  neverShowModalChecked &&
                    window.localStorage.setItem("neverModalShowAgain", "true")
                }}
              >
                OK
              </Button>
            </ButtonContainer>
          </Modal>
          <ModalBackground style={modalProps} />
        </>
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
