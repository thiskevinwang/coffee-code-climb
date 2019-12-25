import * as React from "react"
import { useEffect, memo, useRef } from "react"
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
import { useGesture, addV } from "react-use-gesture"
import styled from "styled-components"

import * as Colors from "consts/Colors"
import { rhythm } from "utils/typography"

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
  const x = -((mouseY - centerY) / (width / 2)) * 20
  const y = ((mouseX - centerX) / (height / 2)) * 10
  const xy = [_.clamp(x, -10, 10), _.clamp(y, -10, 10)]
  return xy
}

/**
 * # FROM_STYLE
 * - starting animated-style
 * - currently just used for boxShadow
 */
const FROM_STYLE = {
  boxShadow: `0px 15px 30px -15px ${Colors.grey}`,
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
  border: 1px solid grey;
  :hover {
    border: 1px dashed white;
  }
  position: absolute;
  border-radius: 5px;
  /* box-shadow: 0px 10px 40px -10px ${Colors.blackDark}; */
  /* This clips the square top corners of the child image */
  overflow: scroll;

  /* hide scroll bars */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
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
  style: any // AnimatedValues
  key: string
  linkTo: string
  date: string
  title: string
  description: string
  excerpt: string
  tags: Array<string>
  id: string
  image: { fluid: { any } } | { childImageSharp: { fluid: { any } } }
  index: number
  nodeType: string
  animatedStyles: AnimatedValue<any>
}
// To avoid <Post> rerenders when <BlogPostIndex> subscribes to redux
// state(like isDarkMode), add `memo()` here
const V1 = memo(
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
    style,
  }: Props) => {
    //_.map + _.kebabCase each tag in frontmatter.tags
    let kebabTags = _.map(tags, tag => _.kebabCase(tag))

    const disqusShortname = "coffeecodeclimb"
    const disqusConfig = {
      url: "https://coffeecodeclimb.com" + linkTo,
      identifier: id,
      title: title,
    }

    /** slowMo instance variable */
    const slowMoRef: React.MutableRefObject<any> = useRef(false)

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
      }
    })

    /**
     * ref
     * to access `getBoundingClientRect()`
     */
    const ref: React.MutableRefObject<any> = useRef(null)
    /**
     * update center / width / height
     * on every render
     */
    useEffect(() => {
      /**
       * Find own bounds & update spring props
       * @FIXME this doesn't update when 'transformXY' is applied
       */
      const bounds: BoundingClientRect = ref.current?.getBoundingClientRect()
      const center: Vector2 = [
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
      ]
      const { width, height } = bounds
      set({ center, width, height })
    })

    /**
     * bind all gesture handlers
     *  @usage
     * ```ts
     * <Component
     *   {...bind()}
     * />
     * ```
     */
    const bind = useGesture(
      {
        /** drag */
        onDrag: ({ movement, event, memo = xy.getValue() }) => {
          set({
            xy: addV(movement, memo),
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
          return !last && [event.pageX, event.pageY]
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

    /** Attach keypress event listeners to the `window`*/
    useEffect(() => {
      /** resets the Cards' position / orientation */
      const resetPos = () =>
        set({
          xy: [0, 0],
          deg: 0,
          scale: 1,
          rotateXY: [0, 0],
        })

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
          // randomize up/left/right, but not down
          xy: [_.random(-500, 500), _.random(-100, -1000)],
          deg: _.random(-360, 360),
          rotateXY: [_.random(-500, 500), _.random(-1000, 1000)],
        })

      const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.ctrlKey) {
          switch (e.keyCode) {
            /** ONLY SET CONFIG HERE!, otherwise it is config.default */
            case 83 /** "s" */:
              slowMoRef.current = !slowMoRef.current
              set({
                config: slowMoRef.current
                  ? { ...config.molasses, mass: 10, friction: 400 }
                  : config.default,
              })
              return
            case 82 /** "r" */:
              return setTimeout(resetPos, index * 50)
            case 70 /** "f" */:
              return setTimeout(fuckMyShitUpFam, index * 50)
            default:
              return
          }
        }
      }

      /** add event listener */
      typeof window !== undefined &&
        window.addEventListener("keyup", handleKeyUp)
      /** clean up event listener*/
      return () => {
        window.removeEventListener("keyup", handleKeyUp)
      }
    }, [])

    return (
      <Card
        index={index}
        ref={ref}
        className={"Card"}
        style={{
          ...style,
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
          {image && (
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
                <CommentCount shortname={disqusShortname} config={disqusConfig}>
                  ...
                </CommentCount>
              </Link>
            </small>
          </code>
        </div>
      </Card>
    )
  }
)

export { V1 }
