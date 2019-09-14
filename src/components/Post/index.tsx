import * as ReactDOM from "react-dom"
import * as React from "react"
import { useState, useEffect, memo, useRef } from "react"
import _ from "lodash"
import { Link } from "gatsby"
import Image from "gatsby-image"
import { CommentCount } from "disqus-react"
import { Grid, Tooltip } from "@material-ui/core"
import {
  animated,
  useSpring,
  AnimatedValue,
  config,
  interpolate,
} from "react-spring"
import { useGesture } from "react-use-gesture"
import styled from "styled-components"

import * as Colors from "consts/Colors"
import { rhythm } from "src/utils/typography"

type Vector2 = [number, number]
/**
 * Some util to calc mouse position relative to the center of an element
 * @param {Vector2} mouseCoordinates
 * @param {Vector2} centerCoordinates
 * @return {Vector2}
 *
 * @TODO find better way to handle skinny-wide objects
 */
const calc = (
  [mouseX, mouseY]: Vector2,
  [centerX, centerY]: Vector2,
  width: number,
  height: number
) => {
  const xy = [
    -((mouseY - centerY) / (width / 2)) * 20,
    ((mouseX - centerX) / (height / 2)) * 10,
  ]
  return xy
}
/**
 * # FROM_STYLE
 * - starting animated-style
 * - currently just used for boxShadow
 */
const FROM_STYLE = {
  boxShadow: `0px 15px 30px -15px ${Colors.blackDark}`,
}
/**
 * # MOUSEOVER_STYLE
 * - target animated-style
 * - currently just used for boxShadow
 */
const MOUSEOVER_STYLE = {
  boxShadow: `0px 17px 40px -13px ${Colors.blackDarker}`,
}
/**
 * # MOUSEDOWN_STYLE
 * - currently just used for boxShadow
 */
const MOUSEDOWN_STYLE = {
  boxShadow: `0px 15px 20px -17px ${Colors.blackDarker}`,
}

const Card = styled(animated.div)`
  border-radius: 5px;
  /* box-shadow: 0px 10px 40px -10px ${Colors.blackDark}; */
  /* This clips the square top corners of the child image */
  overflow: hidden;
`
type BoundingClientRect = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}
interface Props {
  key: string
  linkTo: string
  date: string
  title: string
  description: string
  excerpt: string
  tags: Array<string>
  id: string
  image: { fluid: { any } }
  index: number
  nodeType: string
  animatedStyles: AnimatedValue<any>
  showBlogImage: boolean
}
// To avoid <Post> rerenders when <BlogPostIndex> subscribes to redux
// state(like isDarkMode), add `memo()` here
const Post = memo(
  ({
    linkTo,
    date,
    title,
    description,
    excerpt,
    tags, // origin,
    id,
    image,
    index,
    nodeType,
    showBlogImage,
  }: Props) => {
    //_.map + _.kebabCase each tag in frontmatter.tags
    let kebabTags = _.map(tags, tag => _.kebabCase(tag))

    const disqusShortname = "coffeecodeclimb"
    const disqusConfig = {
      url: "https://coffeecodeclimb.com" + linkTo,
      identifier: id,
      title: title,
    }

    /** All spring props, aka AnimatedValues */
    const [
      { xy, scale, deg, rotateXY, center, width, height, ...springProps },
      set,
    ] = useSpring(() => {
      return {
        from: {
          ...FROM_STYLE,
          xy: [0, 0],
          scale: 1,
          deg: 0,
          /**
           * rotateXY
           * combines the values for:
           * - rotateX
           * - rotateY
           * @see https://codesandbox.io/embed/rj998k4vmm
           */
          rotateXY: [0, 0],
          transformOrigin: `50% 50% 0px`,
          /**
           * center / width / height
           * - this ges overwritten on mount
           * - do not update/reset it
           */
          center: [69, 69],
          width: 0,
          height: 0,
        },
        // to: { ...FROM_STYLE },
        config: config.wobbly,
      }
    })

    /**
     * ref
     * to access `getBoundingClientRect()`
     */
    const ref = useRef(null)
    useEffect(() => {
      /**
       * Find own bounds & update spring props
       * @FIXME this doesn't update when 'transformXY' is applied
       */

      const bounds: BoundingClientRect = ReactDOM.findDOMNode(
        ref.current
      ).getBoundingClientRect()
      const center: Vector2 = [
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
      ]
      const { width, height } = bounds
      set({ center, width, height })
    })

    const bind = useGesture(
      {
        /** drag */
        onDrag: ({ event, delta: [dX, dY], memo = xy.getValue() }) => {
          event.preventDefault()

          const [mX, mY] = memo
          /**
           * movement (will be introduced in V6)
           * - memo + delta
           * @see https://github.com/react-spring/react-use-gesture/issues/45#issuecomment-531008361
           */
          const movement: Vector2 = [mX + dX, mY + dY]
          set({
            xy: movement,
          })
          return memo
        },
        /** hover */
        onHover: ({ hovering, ...hover }) => {
          set({
            ...(hovering ? MOUSEOVER_STYLE : FROM_STYLE),
          })
        },
        /** move */
        onMove: ({ down, hovering, event, memo, last }) => {
          set({
            ...(down && hovering
              ? MOUSEDOWN_STYLE
              : hovering
              ? MOUSEOVER_STYLE
              : FROM_STYLE),
            scale: down ? 0.98 : hovering ? 1.02 : 1,
            rotateXY: hovering
              ? calc(
                  /**
                   * when `last` is true, a synthetic event gets reused.
                   * I'm not sure what those pageX/pageY are.
                   *
                   * So use the memoized values instead.
                   */
                  last ? memo : [event.pageX, event.pageY],
                  center.getValue(),
                  width.getValue(),
                  height.getValue()
                )
              : [0, 0],
          })
          /** return these to update `memo` */
          return [event.pageX, event.pageY]
        },
      },
      {
        event: {
          passive: false,
          /** TRUE disables `onHover` */
          capture: false,
        },
      }
    )
    /**
     * reset position
     */
    useEffect(() => {
      const resetPos = () => set({ xy: [0, 0], deg: 0, scale: 1 })

      /**
       * This function is dedicated to
       * [@kengz](https://github.com/kengz)
       * - When I was a receptionist, he introduced me to rock climbing.
       * - We later became roommates.
       * - We ate tasty foods errday.
       *   - So many banhmis. RIP BBM
       * - Then he moved away, and I did a cri.
       */
      const fuckMyShitUpFam = () =>
        set({
          xy: [_.random(-500, 500), _.random(-1000, 1000)],
          deg: _.random(-360, 360),
          config: { friction: 26 },
        })

      const handleKeyPress = e => {
        e.key === "r" && resetPos()
        e.key === "f" && fuckMyShitUpFam()
      }

      /** add event listener */
      typeof window !== undefined &&
        window.addEventListener("keypress", handleKeyPress)
      /** clean up event listener*/
      return () => {
        window.removeEventListener("keypress", handleKeyPress)
      }
    }, [])

    return (
      <Grid
        item
        lg={!showBlogImage ? 12 : index === 0 ? 12 : 3}
        md={!showBlogImage ? 12 : index === 0 ? 12 : 4}
        sm={!showBlogImage ? 12 : index === 0 ? 12 : 6}
        xs={12}
      >
        <Card
          ref={ref}
          className={"Card"}
          style={{
            ...springProps,
            transform: interpolate(
              [xy, scale, deg, rotateXY],
              ([x, y], scale, deg, [rX, rY]) =>
                `perspective(500px) scale(${scale}) translate3D(${x}px, ${y}px, 0) rotate(${deg}deg) rotateX(${rX}deg) rotateY(${rY}deg)`
            ),
          }}
          {...bind()}
        >
          <Link style={{ boxShadow: `none` }} to={linkTo}>
            {showBlogImage && image && (
              <Image
                fluid={
                  nodeType === `MarkdownRemark`
                    ? image.childImageSharp.fluid
                    : image.fluid
                }
                alt={linkTo}
                style={{}}
                imgStyle={{}}
              />
            )}
          </Link>
          <div
            style={{
              margin: rhythm(2 / 3),
            }}
          >
            <Link style={{ color: `inherit`, boxShadow: `none` }} to={linkTo}>
              <h3
                style={{
                  marginTop: rhythm(1 / 2),
                  marginBottom: rhythm(1 / 2),
                }}
              >
                {title}
              </h3>
              <small>{date}</small>
              <br />
              <small
                dangerouslySetInnerHTML={{
                  __html: description || excerpt,
                }}
              />
            </Link>
            <br />
            {_.includes(kebabTags, "coffee") && (
              <Tooltip title={`tagged with "coffee"`}>
                <Link style={{ boxShadow: `none` }} to={"/tags/coffee/"}>
                  <span role="img" aria-label="tagged with coffee">
                    ☕️
                  </span>
                </Link>
              </Tooltip>
            )}
            {_.includes(kebabTags, "code") && (
              <Tooltip title={`tagged with "code"`}>
                <Link style={{ boxShadow: `none` }} to={"/tags/code/"}>
                  <span role="img" aria-label="tagged with code">
                    💻
                  </span>
                </Link>
              </Tooltip>
            )}
            {_.includes(kebabTags, "climbing") && (
              <Tooltip title={`tagged with "climbing"`}>
                <Link style={{ boxShadow: `none` }} to={"/tags/climbing/"}>
                  <span role="img" aria-label="tagged with climbing">
                    🧗🏻‍♂️
                  </span>
                </Link>
              </Tooltip>
            )}{" "}
            <code>
              <small>
                <Link
                  style={{ color: `inherit`, boxShadow: `none` }}
                  to={`${linkTo}#disqus_thread`}
                >
                  <CommentCount
                    shortname={disqusShortname}
                    config={disqusConfig}
                  >
                    Comments
                  </CommentCount>
                </Link>
              </small>
            </code>
          </div>
        </Card>
      </Grid>
    )
  }
)

export { Post }
