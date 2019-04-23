import * as React from "react"
import { animated } from "react-spring"
import { Link } from "gatsby"
import { rhythm } from "@src/utils/typography"

const MUIBoxShadow = `rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px`

const MUIBoxShadowHover = `0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)`

/**
 * CSS styling for the `next` & `prev` Links. Accounts for :hover,
 * which cannot be handled by inline JSX styling.
 * @const LinksStyleTag
 */
const LinksStyleTag: JSX.Element = (
  <style>{`
  .Link {
    border-radius: 3px;
    box-shadow: ${MUIBoxShadow};
    color: inherit;
    padding: ${rhythm(0.4)};
    transition:
      all 100ms ease-in-out;
  }
  .Link:hover {
    box-shadow: ${MUIBoxShadowHover};
  }
  .Link__next {
    color: white;
  }
  .Link__next:hover {
  }
  .Link__prev {
    background: white;
  }
  .Link__prev:hover {
  }
`}</style>
)

/**
 * Describes the shape of the data passed to the PrevNextNavigation component's
 * `next` & `previous` props when the data is a MarkdownRemark node.
 * @interface MarkdownRemarkNode
 **/
interface MarkdownRemarkNode {
  internal: {
    type: `MarkdownRemark`
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
    type: `ContentfulBlogPost`
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
  nextGradient?: React.Key
}

/**
 * React function component for navigating between blog posts.
 * Shared between `blog-post.jsx` & `contentful-blog-post.jsx`
 * @function PrevNextNavigation
 */
export default function PrevNextNavigation({
  previous,
  next,
  nextGradient,
}: Props) {
  /**
   * This is a react-spring wrapper for Gatsby's link component.
   * It enables useSpring() values to be passed to the CSS properties in its
   * style props.
   * @const AnimatedLink
   */
  const AnimatedLink = animated(Link)

  return (
    <ul
      style={{
        display: `flex`,
        flexWrap: `wrap`,
        justifyContent: `space-between`,
        listStyle: `none`,
        padding: 0,
      }}
    >
      <li>
        {previous && (
          <Link
            className={"Link Link__prev"}
            to={
              previous.internal.type === `MarkdownRemark`
                ? previous.fields.slug
                : previous.slug
            }
            rel="prev"
          >
            ←{" "}
            {previous.internal.type === `MarkdownRemark`
              ? previous.frontmatter.title
              : previous.title}
          </Link>
        )}
      </li>
      <li>
        {next && (
          <AnimatedLink
            style={{ background: nextGradient }}
            className={"Link Link__next"}
            to={
              next.internal.type === `MarkdownRemark`
                ? next.fields.slug
                : next.slug
            }
            rel="next"
          >
            {next.internal.type === `MarkdownRemark`
              ? next.frontmatter.title
              : next.title}{" "}
            →
          </AnimatedLink>
        )}
      </li>
      {LinksStyleTag}
    </ul>
  )
}
