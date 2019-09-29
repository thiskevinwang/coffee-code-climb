import * as ReactDOM from "react-dom"
import * as React from "react"
import { useEffect, memo, useRef } from "react"
import _ from "lodash"
import { Link } from "gatsby"
import * as ReactSpring from "react-spring"
import {
  animated,
  useSpring,
  AnimatedValue,
  config,
  interpolate,
} from "react-spring"
import { useGesture } from "react-use-gesture"
import styled from "styled-components"

import { useIO } from "hooks/useIO"
import * as Colors from "consts/Colors"
import { rhythm } from "utils/typography"

const Sentinel = styled(animated.div)`
  border: 1px solid red;
  height: 200vh;
`

const Content = styled(animated.div)`
  border: 1px solid blue;
  margin: ${rhythm(2 / 3)};
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  position: sticky;
  position: -webkit-sticky;
  transform: translateY(-50%);
  top: 50vh;
`

// To avoid <Post> rerenders when <BlogPostIndex> subscribes to redux
// state(like isDarkMode), add `memo()` here
const V2 = memo(
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
  }) => {
    const [isIntersecting, bind] = useIO({
      root: null,
      rootMargin: "0px",
      threshold: 0.35,
    })

    return (
      <Sentinel {...bind}>
        {isIntersecting ? "inter" : "no"}
        <Content>
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
        </Content>
      </Sentinel>
    )
  }
)

export { V2 }
