import * as React from "react"
import { Link as _ } from "gatsby"
import { rhythm, scale } from "@src/utils/typography"
import styled, { css } from "styled-components"

const MUIBoxShadow = `rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px`

const MUIBoxShadowHover = `0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)`

/**
 * Describes the shape of the data passed to the PrevNextNavigation component's
 * `next` & `previous` props when the data is a MarkdownRemark node.
 * @interface MarkdownRemarkNode
 **/
interface MarkdownRemarkNode {
  internal: {
    type: string // `MarkdownRemark`
  }
  fields?: {
    slug: string
  }
  frontmatter?: {
    title: string
  }
}

/**
 * Describes the shape of the data passed to the PrevNextNavigation component's
 * `next` & `previous` props when the data is a ContentfulBlogPost node.
 * @interface ContentfulBlogPostNode
 **/
interface ContentfulBlogPostNode {
  internal: {
    type: string // `ContentfulBlogPost`
  }
  slug?: string
  title?: string
}

/**
 * Describes the expected types to be passed as PrevNextNavigation's props
 * @interface Props
 **/
interface Props {
  previous?: MarkdownRemarkNode | ContentfulBlogPostNode
  next?: MarkdownRemarkNode | ContentfulBlogPostNode
}

/**
 * Styled Link component
 * @const Link
 * @param {} props.next for styling the label
 **/
const Link = styled(_)`
  border: 1px solid grey;
  border-radius: 5px;
  box-shadow: ${MUIBoxShadow};
  color: grey;
  padding: 0 ${rhythm(0.5)} ${rhythm(0.5)};
  transition: all 200ms ease-in-out;

  label {
    display: flex;
    ${props =>
      props.next &&
      css`
        justify-content: flex-end;
      `}
    width: 100%;
    ${scale(-0.5)}
  }

  :hover {
    border: 1px solid black;
    box-shadow: ${MUIBoxShadowHover};
    color: black;
    transform: translate(0px, -5px) scale(1.05);
  }
`

/**
 * React function component for navigating between blog posts.
 * Shared between `blog-post.jsx` & `contentful-blog-post.jsx`
 * @function PrevNextNavigation
 */
export default function PrevNextNavigation({ previous, next }: Props) {
  const getSlugFromNode = (node): string => {
    switch (node.internal.type) {
      case `MarkdownRemark`:
        return node.fields.slug
      case `ContentfulBlogPost`:
        return node.slug
      default:
        return ""
    }
  }

  const getTitleFromNode = (node): string => {
    switch (node.internal.type) {
      case `MarkdownRemark`:
        return node.frontmatter.title
      case `ContentfulBlogPost`:
        return node.title
      default:
        return ""
    }
  }

  return (
    <ul
      style={{
        display: `flex`,
        flexWrap: `wrap`,
        justifyContent: `space-between`,
        listStyle: `none`,
      }}
    >
      {previous && (
        <Link to={getSlugFromNode(previous)} rel="prev" label="foo" prev>
          <label>older</label>← {getTitleFromNode(previous)}
        </Link>
      )}

      {next && (
        <Link to={getSlugFromNode(next)} rel="next" next>
          <label>newer</label>
          {getTitleFromNode(next)} →
        </Link>
      )}
    </ul>
  )
}
