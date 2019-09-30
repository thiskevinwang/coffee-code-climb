import React, { useEffect, memo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import { Link } from "gatsby"
import * as ReactSpring from "react-spring"
import {
  animated,
  useSpring,
  useChain,
  config,
  interpolate,
} from "react-spring"
import { useGesture } from "react-use-gesture"
import styled from "styled-components"

import { useIO } from "hooks/useIO"
import * as Colors from "consts/Colors"
import { rhythm } from "utils/typography"

const Sentinel = styled(animated.div)`
  /* border: 1px solid red; */
  height: 150vh;
`

const ContentContainer = styled(animated.div)`
  /* border: 1px solid blue; */
  margin: ${rhythm(2 / 3)};
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  position: sticky;
  position: -webkit-sticky;
  transform: translateY(-50%);
  top: 50vh;
`
const InnerContent = styled(animated.div)``
const InnerContainer = styled(animated.div)`
  border-radius: 10px / 15px;
  padding: ${rhythm(1)};
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
    const isDarkMode = useSelector(state => state.isDarkMode)
    const [isIntersecting, bind] = useIO({
      root: null,
      rootMargin: "0px",
      threshold: [0.35],
    })
    const [didIntersect, setDidIntersect] = useState(false)
    useEffect(() => {
      if (isIntersecting) setDidIntersect(true)
    }, [isIntersecting])

    const springRef1 = useRef()
    const { transform, background } = useSpring({
      ref: springRef1,
      from: {
        background: isDarkMode ? Colors.black : Colors.silverLighter,
        transform: "scale(0)",
      },
      to: {
        background: isDarkMode ? Colors.black : Colors.silverLighter,
        transform: didIntersect ? `scale(1)` : "scale(0)",
      },
    })

    const springRef2 = useRef()
    const { opacity } = useSpring({
      ref: springRef2,
      from: { opacity: 0 },
      to: {
        opacity: didIntersect ? 1 : 0,
      },
    })

    useChain(
      didIntersect ? [springRef1, springRef2] : [springRef2, springRef1],
      [0, didIntersect ? 0.4 : 0.7]
    )

    const dateProps = useSpring({
      opacity: isIntersecting ? 1 : 0,
      transform: isIntersecting ? `translateX(0%)` : `translateX(-100%)`,
    })
    return (
      <Sentinel {...bind}>
        <animated.h1
          style={{
            transform: dateProps.transform,
            opacity: dateProps.opacity,
            position: "fixed",
            bottom: `15%`,
            left: `15%`,
            // zIndex: -1,
            color: isDarkMode ? Colors.greyDarker : Colors.greyLighter,
            textAlign: ``,
          }}
        >
          {date}
        </animated.h1>
        <ContentContainer>
          <InnerContainer
            style={{
              boxShadow: `0px 15px 30px -15px ${
                isDarkMode ? Colors.silverDarker : Colors.blackDark
              }`,
              transform,
              background,
            }}
          >
            <InnerContent
              style={{
                opacity,
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
            </InnerContent>
          </InnerContainer>
        </ContentContainer>
      </Sentinel>
    )
  }
)

export { V2 }
