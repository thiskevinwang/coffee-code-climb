import * as React from "react"
import { Link as _ } from "gatsby"
import styled, { css } from "styled-components"

import { rhythm, scale } from "src/utils/typography"

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

/**
 * React function component for navigating between blog posts.
 * Shared between `blog-post.jsx` & `contentful-blog-post.jsx`
 * @function PrevNextNavigation
 */
export default function PrevNextNavigation({ previous, next }: Props) {
  return (
    <div
      style={{
        display: `flex`,
        justifyContent: `space-between`,
        marginBottom: rhythm(1),
      }}
    >
      {previous && (
        <Link to={getSlugFromNode(previous)} rel="prev" prev>
          <label>← older</label>
          <>{getTitleFromNode(previous)}</>
        </Link>
      )}

      {next && (
        <Link to={getSlugFromNode(next)} rel="next" next>
          <label>newer →</label>
          <>{getTitleFromNode(next)}</>
        </Link>
      )}
    </div>
  )
}

interface LinkProps {
  next?: boolean
  prev?: boolean
}
/**
 * Styled Link component
 * @const Link
 * @param {} props.next for styling the label
 **/
const Link = styled(_)<LinkProps>`
  /* rely on flex to set the "in-between-margin" */
  flex-basis: 48%;
  border-radius: 5px;
  box-shadow: var(--shadow) !important;
  background: var(--background);
  color: var(--text);
  padding: 0 ${rhythm(0.5)} ${rhythm(0.5)};
  transition: all 200ms ease-in-out;

  label {
    display: flex;
    width: 100%;

    ${(props) =>
      props.next &&
      css`
        justify-content: flex-end;
      `}

    ${scale(-0.5)}
  }

  ${(props) =>
    props.next &&
    css`
      text-align: right;
    `}

  :hover {
    transform: translate(0px, -5px) scale(1.05);
  }
`
