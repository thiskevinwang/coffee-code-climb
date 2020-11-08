import * as React from "react"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"
import { Popover } from "@material-ui/core"
import { useMutation } from "@apollo/client"
import _ from "lodash"

import * as Colors from "consts/Colors"

import {
  GET_COMMENTS_BY_URL_QUERY,
  CommentOrderByInput,
} from "../Display/ByUrl/query"
import { DELETE_COMMENT_BY_ID } from "./deleteCommentById"

const PopoverContents = styled(animated.div)`
  color: ${theme("mode", {
    light: (props: BaseProps) => props.theme.formInput.color,
    dark: (props: BaseProps) => props.theme.formInput.color,
  })};
  border: ${theme("mode", {
    light: "none",
    dark: `1px solid ${Colors.greyDarker}`,
  })};
  background: ${theme("mode", {
    /* light: Colors.LIGHT_GRADIENTS[0], */
    // dark: Colors.DARK_GRADIENTS[0],
    light: Colors.silverLighter,
    dark: Colors.blackDarker,
  })};
  display: flex;
  flex-direction: row;
  padding: 0.5rem 1rem;
`
const Option = styled(animated.div)`
  cursor: pointer;
  color: #999999;
  transition: color 150ms ease-in-out;
  will-change: color;
  :hover {
    color: ${theme("mode", {
      light: (props: BaseProps) => props.theme.formInput.color,
      dark: (props: BaseProps) => props.theme.formInput.color,
    })};
  }
`

const Container = styled(animated.div)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 1.5rem;

  > svg > rect {
    transition: fill 200ms ease-in-out;
    will-change: fill;
  }
  :hover > svg > rect {
    fill: ${theme("mode", {
      light: (props: BaseProps) => props.theme.formInput.color,
      dark: (props: BaseProps) => props.theme.formInput.color,
    })};
  }
`
export const Overflow = ({
  commentId,
  url, // This gets prop-juggled, 2 levels
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const [deleteCommentById, {}] = useMutation(DELETE_COMMENT_BY_ID, {
    update: (cache, mutationResult) => {
      const { deleteCommentById } = mutationResult?.data

      /**
       * @NOTE_TO_SELF
       * All dis shiet has to match a previous query, EXACTLY.
       * You need to include the exact used variables, etc.
       */
      const { getCommentsByUrl } = cache.readQuery({
        query: GET_COMMENTS_BY_URL_QUERY,
        variables: { url, filter: CommentOrderByInput.created_DESC },
      })

      cache.writeQuery({
        query: GET_COMMENTS_BY_URL_QUERY,
        variables: { url, filter: CommentOrderByInput.created_DESC },
        data: {
          getCommentsByUrl: _.filter(
            getCommentsByUrl,
            (e) => e.id !== deleteCommentById.id
          ),
        },
      })
    },
  })
  return (
    <>
      <Container onClick={handleClick}>
        <svg width="13" height="3" viewBox="0 0 13 3" fill="none">
          <rect width="3" height="3" rx="1.5" fill="#999999"></rect>
          <rect x="5" width="3" height="3" rx="1.5" fill="#999999"></rect>
          <rect x="10" width="3" height="3" rx="1.5" fill="#999999"></rect>
        </svg>
      </Container>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <PopoverContents>
          <Option
            onClick={() => {
              deleteCommentById({
                variables: {
                  id: commentId,
                },
              })
              handleClose()
            }}
          >
            Delete
          </Option>
        </PopoverContents>
      </Popover>
    </>
  )
}
