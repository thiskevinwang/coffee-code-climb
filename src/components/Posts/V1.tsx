import * as React from "react"
import { memo, useMemo } from "react"
import _ from "lodash"
import { Link } from "gatsby"
import Image from "gatsby-image"
import { animated, AnimatedValue } from "react-spring"
import styled from "styled-components"
import theme from "styled-theming"

import * as Colors from "consts/Colors"
import { rhythm } from "utils/typography"

const Card = styled(animated.div)`
  --geist-cyan: #79ffe1;
  --geist-purple: #f81ce5;

  border-style: solid;
  border-width: 1px;
  border-color: ${theme("mode", {
    light: props => props.theme.commentRenderer.borderColor,
    dark: props => props.theme.commentRenderer.borderColor,
  })};
  transition: border-color 200ms ease-in-out;

  :hover {
    border-color: ${theme("mode", {
      light: "var(--geist-cyan)",
      dark: "var(--geist-purple)",
    })};
  }

  position: absolute;
  border-radius: 5px;
  overflow: scroll;

  /* hide scroll bars */
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
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
    const kebabTags = useMemo(() => _.map(tags, tag => _.kebabCase(tag)), [])

    return (
      <Card
        index={index}
        className={"Card"}
        style={{
          ...style,
        }}
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
            <div style={{ display: "flex" }}>
              <small>{date}</small>
            </div>
            <small
              dangerouslySetInnerHTML={{
                __html: description || excerpt,
              }}
            />
          </Link>
          <br />
          {_.map(kebabTags, e => (
            <Badge key={e}>{e} </Badge>
          ))}
        </div>
      </Card>
    )
  }
)

export { V1 }

export const Badge = styled(animated.small)`
  --geist-cyan: #79ffe1;
  --geist-purple: #f81ce5;

  background: ${theme("mode", {
    light: "var(--geist-cyan)",
    dark: "var(--geist-purple)",
  })};
  box-shadow: none;
  border-width: 1px;
  border-style: solid;
  border-radius: 1rem / 80%;
  border-color: ${theme("mode", {
    light: Colors.greyLighter,
    dark: Colors.greyDarker,
  })};

  color: ${theme("mode", {
    light: Colors.greyLighter,
    dark: Colors.greyDarker,
  })};
  display: inline-block;
  padding: 0.05rem 0.5rem 0.1rem;
`
