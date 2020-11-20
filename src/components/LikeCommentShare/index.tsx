import * as React from "react"
import { Link } from "gatsby"
import { useMutation } from "@apollo/client"
import { useMediaQuery, Popover } from "@material-ui/core"
import { gql } from "@apollo/client"
import styled, { BaseProps } from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"

// Hooks
import { useAuthentication } from "hooks/useAuthentication"

// Other
import * as Colors from "consts/Colors"
import { POSSIBLE_VARIANTS } from "entities/Reaction"

// Relative
import { FlexRow, Variant } from "../../pages/rds"

const REACT_TO_COMMENT = gql`
  mutation($variant: ReactionVariant!, $commentId: ID!) {
    reactToComment(variant: $variant, commentId: $commentId) {
      id
    }
  }
`

const ITEM_HEIGHT = 30
const popoverBackground = theme("mode", {
  // light: Colors.LIGHT_GRADIENTS[0],
  // dark: Colors.DARK_GRADIENTS[0],
  light: Colors.silverLighter,
  dark: Colors.blackLighter,
})

const Line = styled(animated.div)`
  height: 1px;
  background: ${theme("mode", {
    light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
    dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
  })};
`

const VariantButton = styled(animated.button)`
  background: none;
  display: flex;
  justify-content: center;
  border-radius: 0.2rem;
  height: ${ITEM_HEIGHT + 10}px;
  width: ${ITEM_HEIGHT + 10}px;
  padding: 0px;
  border: none;

  transition: background 150ms ease-in-out;
  :hover {
    background: ${theme("mode", {
      light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
      dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
    })};
  }
`

const PopoverContents = styled(animated.div)`
  color: ${theme("mode", {
    light: (props: BaseProps) => props.theme.formInput.color,
    dark: (props: BaseProps) => props.theme.formInput.color,
  })};
  background: ${popoverBackground};
  display: flex;
  flex-direction: row;
  padding: 1rem;

  :first-child > :not(:first-child) {
    /* border: 1px dotted red; */
    margin-left: 0.75rem;
  }
`

const FlexBoxButton = styled.div`
  align-items: center;
  border-radius: 0.2rem;
  cursor: pointer;
  display: flex;
  flex: 1;
  height: 3rem;
  justify-content: center;
  margin: 5px;

  transition: background 200ms ease-in-out;
  will-change: background;

  color: ${theme("mode", {
    light: (props: BaseProps) => props.theme.formInput.color,
    dark: (props: BaseProps) => props.theme.formInput.color,
  })};

  :hover {
    background: ${theme("mode", {
      light: (props: BaseProps) => props.theme.commentRenderer.borderColor,
      dark: (props: BaseProps) => props.theme.commentRenderer.borderColor,
    })};
  }
`

/**
 * This accepts a `commentId` prop and sends a `reactToComment` mutation.
 *
 * @usage
 * ```ts
 * import { LikeCommentShare } from "components/LikeCommentShare"
 *
 * // map through comments...
 * <LikeCommentShare commentId={_comment.id} />
 * ```
 */
export const LikeCommentShare = ({ commentId }) => {
  const { currentUserId } = useAuthentication()
  const windowSm = useMediaQuery("(max-width:480px)")
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const [reactToComment, { data, loading }] = useMutation(REACT_TO_COMMENT)
  const handleSelectReaction = ({ variant }) => (event) => {
    reactToComment({
      variables: { variant: variant, commentId },
    })
    handleClose()
  }

  return (
    <>
      <Line />
      <FlexRow>
        <FlexBoxButton onClick={handleClick}>React</FlexBoxButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <PopoverContents>
            {currentUserId ? (
              POSSIBLE_VARIANTS.map((variant, i) => (
                <VariantButton
                  key={variant}
                  onClick={handleSelectReaction({ variant: variant })}
                >
                  <Variant variant={variant} />
                </VariantButton>
              ))
            ) : (
              <>
                Please&nbsp;
                <Link to={"/auth/login"}>{"log in"}</Link>
                &nbsp;to react
              </>
            )}
          </PopoverContents>
        </Popover>
        <FlexBoxButton>Comment</FlexBoxButton>
        {!windowSm && <FlexBoxButton>Share</FlexBoxButton>}
      </FlexRow>
    </>
  )
}
