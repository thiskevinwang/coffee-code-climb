import React, { useEffect, memo, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import { Link } from "gatsby"
import Image from "gatsby-image"
import { animated, useSpring, useChain, AnimatedValue } from "react-spring"
import styled from "styled-components"

import { useIO } from "hooks/useIO"
import { Colors } from "consts/Colors"
import { rhythm } from "utils/typography"
import { QuestionCircle } from "icons"

import { Tag } from "./V1"

const Sentinel = styled(animated.div)`
  /* border: 1px dotted red; */
  height: 120vh;
`

const GridImage = styled.div`
  grid-column-start: 1;
  grid-column-end: 7;
  grid-row-start: 2;
`
const GridDescription = styled.div`
  grid-column-start: 6;
  grid-column-end: 13;
  grid-row-start: 1;

  z-index: 1;
  text-align: right;
`
const DescriptionText = styled(animated.div)`
  display: inline-block;
  border-radius: 5px;
  padding: ${rhythm(1)};
`

const ContentContainer = styled(animated.div)`
  /* border: 1px dashed green; */

  margin: ${rhythm(2 / 3)};
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(24)};
  position: sticky;
  position: -webkit-sticky;
  transform: translateY(-50%);
  top: 50%;
`

const Grid = styled(animated.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(auto-fill, 20px);
  column-gap: 10px;
  row-gap: 10px;
`

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
  image: { fluid: any } | { childImageSharp: { fluid: any } }
  index: number
  nodeType: string
  animatedStyles: AnimatedValue<any>
}
// To avoid <Post> rerenders when <BlogPostIndex> subscribes to redux
// state(like isDarkMode), add `memo()` here
const V2Unmemoized: React.FC<Props> = ({
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
}) => {
  const kebabTags = useMemo(() => _.map(tags, (tag) => _.kebabCase(tag)), [])

  const isDarkMode = useSelector((state) => state.isDarkMode)
  const [isIntersecting, bind] = useIO({
    root: null,
    rootMargin: "0px",
    threshold: [0.35],
  })

  const {
    transform,
    background,
    backgroundDark,
    opacity,
  } = useFadeGrowEntrance(isIntersecting)

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
          color: isDarkMode ? Colors.GREY_DARKER : Colors.GREY_LIGHTER,
        }}
      >
        {date}
      </animated.h1>
      <ContentContainer>
        <Grid style={{ opacity, transform }}>
          {image ? (
            <GridImage>
              <Image
                fluid={
                  nodeType === `MarkdownRemark`
                    ? image.childImageSharp.fluid
                    : image.fluid
                }
                alt={linkTo}
                style={{
                  background: backgroundDark,
                  borderRadius: `5px`,
                  minHeight: `200px`,
                }}
                imgStyle={{}}
                loading={"lazy"}
              />
            </GridImage>
          ) : (
            <GridImage>
              <animated.div
                // this is an image placeholder
                style={{
                  background: backgroundDark,
                  borderRadius: `5px`,
                  height: `200px`,
                  display: `flex`,
                  justifyContent: `center`,
                  alignItems: `center`,
                }}
              >
                <QuestionCircle />
              </animated.div>
            </GridImage>
          )}
          <GridDescription>
            <Link to={linkTo} style={{ boxShadow: `none` }}>
              <h3>{title}</h3>

              <DescriptionText
                style={{
                  background,
                  boxShadow: `0px 15px 30px -15px ${
                    isDarkMode ? Colors.SILVER_DARKER : Colors.BLACK_DARK
                  }`,
                  marginBottom: 10,
                }}
              >
                <small
                  dangerouslySetInnerHTML={{
                    __html: description || excerpt,
                  }}
                />
              </DescriptionText>
              <br />
              {_.map(kebabTags, (e) => (
                <Tag key={e}>{e} </Tag>
              ))}
            </Link>
          </GridDescription>
        </Grid>
      </ContentContainer>
    </Sentinel>
  )
}

export const V2 = memo(V2Unmemoized)

/**
 * a hook to abstract out orchestrated animations
 */
const useFadeGrowEntrance = (isIntersecting: boolean) => {
  const isDarkMode = useSelector((state) => state.isDarkMode)
  const [didIntersect, setDidIntersect] = useState(false)
  useEffect(() => {
    if (isIntersecting) setDidIntersect(true)
  }, [isIntersecting])

  const springRef1 = useRef()
  const { transform, background, backgroundDark } = useSpring({
    ref: springRef1,
    from: {
      background: isDarkMode ? Colors.BLACK : Colors.SILVER_LIGHTER,
      backgroundDark: isDarkMode ? Colors.BLACK_DARK : Colors.SILVER_LIGHT,
      transform: `scale(0)`,
    },
    to: {
      background: isDarkMode ? Colors.BLACK : Colors.SILVER_LIGHTER,
      backgroundDark: isDarkMode ? Colors.BLACK_DARK : Colors.SILVER_LIGHT,
      transform: didIntersect ? `scale(1)` : `scale(0)`,
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

  useChain([springRef2, springRef1], [0, 0.7])

  return { transform, background, backgroundDark, opacity }
}
