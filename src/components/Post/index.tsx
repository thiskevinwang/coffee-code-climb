import * as React from "react"
import { useEffect, memo } from "react"
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

/**
 * # FROM_STYLE
 * - starting animated-style
 */
const FROM_STYLE = {
  boxShadow: `0px 15px 30px -15px ${Colors.blackDark}`,
}
/**
 * # MOUSEOVER_STYLE
 * - target animated-style
 */
const MOUSEOVER_STYLE = {
  boxShadow: `0px 17px 40px -13px ${Colors.blackDarker}`,
}
/**
 * # MOUSEDOWN_STYLE
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

    const [{ xy, scale, ...springProps }, set] = useSpring(() => {
      return {
        from: { ...FROM_STYLE, xy: [0, 0], scale: 1 },
        // to: { ...FROM_STYLE },
        config: config.wobbly,
      }
    })
    const bind = useGesture(
      {
        onDrag: ({ event, delta: [dX, dY], memo = xy.getValue() }) => {
          event.preventDefault()
          const [mX, mY] = memo
          set({ xy: [mX + dX, mY + dY] })
          return memo
        },
        onHover: ({ hovering }) => {
          set({
            ...(hovering ? MOUSEOVER_STYLE : FROM_STYLE),
            scale: hovering ? 1.02 : 1,
          })
        },
        onMove: ({ down, hovering, delta, memo = xy.getValue() }) => {
          set({
            ...(down && hovering
              ? MOUSEDOWN_STYLE
              : hovering
              ? MOUSEOVER_STYLE
              : FROM_STYLE),
            scale: down ? 0.98 : hovering ? 1.02 : 1,
            /** Turn this on for trolling */
            // xy: addVectors(memo, delta),
          })
        },
      },
      {
        event: {
          passive: false,
          // capture: true // this disables `onHover`
        },
      }
    )

    /**
     * updateStyles
     * - logging `idx` logs all the indices
     * - if the hovered index ===
     */
    const updateStyles = stylesObject => e => {
      set({ ...stylesObject })
    }

    /**
     * reset position
     */
    useEffect(() => {
      const resetPos = () => set({ xy: [0, 0] })
      const handleKeyPressR = e => {
        e.key === "r" && resetPos()
      }
      typeof window !== undefined &&
        window.addEventListener("keypress", handleKeyPressR)
      return () => {
        window.removeEventListener("keypress", handleKeyPressR)
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
          className={"Card"}
          style={{
            ...springProps,
            transform: interpolate(
              [xy, scale],
              ([x, y], scale) =>
                `scale(${scale}) translate3D(${x}px, ${y}px, 0)`
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
