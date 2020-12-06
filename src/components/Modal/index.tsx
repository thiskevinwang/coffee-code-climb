import React from "react"
import styled from "styled-components"
import { animated } from "react-spring"
import MuiDialog from "@material-ui/core/Dialog"
import { withStyles } from "@material-ui/core/styles"

const Dialog = withStyles((theme) => ({
  paper: {
    boxShadow: "var(--shadow-large)",
    borderRadius: "8px",
  },
}))(MuiDialog)

const ModalWrapper = styled(animated.div)`
  background: var(--geist-background);
  border-radius: 8px;
  box-shadow: var(--shadow-large);
  color: var(--geist-foreground);
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 420px;
  transform: translateZ(0);
  font-family: var(--font-sans);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;

  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
`
export const ModalBody = styled.div`
  display: block;
  padding: var(--geist-gap);
  max-height: 100vh;
  overflow-y: auto;
`

export const ModalActions = styled.footer`
  position: sticky;
  bottom: 0;
  border-top: 1px solid var(--accents-2);
  display: flex;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`

export const ModalAction = styled.button`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  outline: none;
  text-decoration: none;
  padding: var(--geist-gap) 0px;
  flex: 1 1 100%;
  background: var(--geist-background);
  color: var(--geist-foreground);
  transition: background 200ms ease-in-out;
  &:hover {
    background: var(--accents-1);
  }
  &:not(:only-child):not(:last-child) {
    border-right: 1px solid var(--accents-2);
  }
`
ModalAction.defaultProps = {
  type: "button",
}

/**
 * @see https://vercel.com/design/modal
 */
const Modal = {
  Modal: ({ children, open, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ModalWrapper>{children}</ModalWrapper>
    </Dialog>
  ),
  Body: ModalBody,
  Header: null,
  Title: null,
  SubTitle: null,
  Actions: ModalActions,
  Action: ModalAction,
}

export default Modal
