import React, { useRef } from "react"
import styled from "styled-components"
import theme from "styled-theming"
import { useSpring, useChain, animated, AnimatedValue } from "react-spring"

import { SubmitButton } from "components/Form"

import * as Colors from "consts/Colors"

const XIcon = ({ fill }: { fill: AnimatedValue<any> }) => (
  <animated.svg viewBox="0 0 24 24" s>
    <animated.g>
      <animated.path
        fill={fill}
        d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"
      ></animated.path>
    </animated.g>
  </animated.svg>
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
  overflow: hidden;

  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  z-index: 9999;

  @media (max-width: 769px) {
    height: auto !important;
    /* max-height: 500px; */
    width: auto !important;
    /* max-width: 300px; */

    margin-top: 25%;
    margin-right: 10%;
    margin-bottom: 25%;
    margin-left: 10%;
  }
`

const ModalTitleText = styled(animated.h2)`
  margin-bottom: 10px;

  @media (max-width: 350px) {
    margin-top: 20%;
  }
`

const Key = styled(animated.kbd)`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 5px;
`

const ItemRowContainer = styled(animated.div)``
const ItemRow = styled(animated.div)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  color: ${theme("mode", {
    light: Colors.blackLighter,
    dark: Colors.silverDarker,
  })};
`
const ButtonContainer = styled(animated.div)``
const CheckboxContainer = styled(animated.div)`
  text-align: center;
  margin-bottom: 1rem;
`
const Checkbox = styled(animated.input)``

const FunButtonsModal = ({
  animatedOpacity,
  // contentOpacity,
  animatedModalBackground,
  animatedFill,
  shouldExit,
  setShouldExit,
  neverShowModalChecked,
  toggleNeverShowModalChecked,
  // modalWidth,
  // modalHeight,
}) => {
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
    [0, 0.5]
  )
  return (
    <>
      <Modal
        style={{
          opacity: animatedOpacity,
          background: animatedModalBackground,
          width: modalWidth.interpolate(val => `${val}%`),
          height: modalHeight.interpolate(val => `${val}%`),
        }}
      >
        <animated.div style={{ opacity: contentOpacity }}>
          <XIconContainer
            // style={{ opacity: contentOpacity }}
            onClick={() => {
              setShouldExit(true)
            }}
          >
            <XIcon fill={animatedFill} />
          </XIconContainer>
          <ModalTitleText
          // style={{ opacity: contentOpacity }}
          >
            Some Fun Buttons
          </ModalTitleText>

          <ItemRowContainer
          // style={{ opacity: contentOpacity }}
          >
            <ItemRow>
              <ItemRow>
                <Key>Ctrl</Key>&nbsp;+&nbsp;<Key>t</Key>
              </ItemRow>
              <small>Toggle Icon Trail</small>
            </ItemRow>
            <ItemRow>
              <ItemRow>
                <Key>Ctrl</Key>&nbsp;+&nbsp;<Key>s</Key>
              </ItemRow>
              <small>Slow Mo</small>
            </ItemRow>
            <ItemRow>
              <ItemRow>
                <Key>Ctrl</Key>&nbsp;+&nbsp;<Key>f</Key>
              </ItemRow>
              <small>Flip Cards</small>
            </ItemRow>
            <ItemRow>
              <ItemRow>
                <Key>Ctrl</Key>&nbsp;+&nbsp;<Key>r</Key>
              </ItemRow>
              <small>Reset Cards</small>
            </ItemRow>
            <ItemRow>
              <ItemRow>
                <Key>Ctrl</Key>&nbsp;+&nbsp;<Key>d</Key>
              </ItemRow>
              <small>Dark Mode</small>
            </ItemRow>
          </ItemRowContainer>

          <ButtonContainer
          // style={{ opacity: contentOpacity }}
          >
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
            <SubmitButton
              style={{ width: `100%` }}
              onClick={() => {
                setShouldExit(true)
                neverShowModalChecked &&
                  window.localStorage.setItem("neverModalShowAgain", "true")
              }}
            >
              OK
            </SubmitButton>
          </ButtonContainer>
        </animated.div>
      </Modal>
      <ModalBackground style={{ opacity: animatedOpacity }} />
    </>
  )
}

export { FunButtonsModal }
