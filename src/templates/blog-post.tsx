import React, { useState, memo } from "react"
import { Link, graphql } from "gatsby"
import _ from "lodash"
import styled, { css } from "styled-components"
import theme from "styled-theming"
import { animated, useTransition } from "react-spring"
import { Skeleton } from "@material-ui/lab"
import uuid from "uuid"

// Components
import Bio from "components/bio"
import SEO from "components/seo"
import { TableOfContents } from "components/TableOfContents"
import { LayoutManager } from "components/layoutManager"
import { PrevNextNavigation } from "components/TemplateComponents"
import { CreateComment } from "components/Comments/Create"
import { CommentsByUrl } from "components/Comments/Display/ByUrl"
import { Tag } from "components/Posts/V1"

// Other
import { rhythm, scale } from "utils/typography"
import { Colors } from "consts/Colors"
import { useFetch } from "hooks/useFetch"
import { useOptimisticClaps } from "hooks/useOptimisticClaps"

const URI = `${process.env.GATSBY_LAMBDA_ENDPOINT}/sandbox/claps`

/**
 * An arbitrary limit on the number of times a viewer can 'clap'
 */
const CLAP_LIMIT = 20

export default function BlogPostTemplate({ data, pageContext, location }) {
  const post = data.markdownRemark
  const { title: siteTitle } = data.site.siteMetadata
  const {
    previous,
    next,
    postTitle,
    tableOfContents,
    imagePublicURL,
  } = pageContext

  const { data: res, error } = useFetch<QueryClapsResponse, any>(
    `${URI}/query?slug=${location.pathname}`
  )
  const isLoading = !res && !error

  // The remaining number of claps that the viewer can commit.
  const remainingClaps = CLAP_LIMIT - res?.viewerClapCount

  const {
    incrementClaps,
    clapsCount,
    clapLimitReached,
  } = useOptimisticClaps(URI, { remainingClaps })

  const viewerHasClapped: boolean = res?.viewerClapCount >= 1 || clapsCount >= 1

  const clapsToDisplay: number = res?.total + clapsCount

  const [items, setItems] = useState<{ id: string }[]>([])
  const transitions = useTransition(items, (item) => item.id, {
    from: () => {
      return { opacity: 0, transform: `translate3d(0%,0%,0)` }
    },
    enter: () => ({
      opacity: 1,
      transform: `translate3d(${_.random(-50, 50)}%,-${_.random(50, 250)}%,0)`,
    }),
    leave: {
      opacity: 0,
      transform: `translate3d(0%,-30%,0)`,
    },
  })

  const handleClick = () => {
    /**
     * when incrementClaps executes successfully, this
     * callback will get called
     */
    const cb = () => {
      setItems((items) => [...items, { id: uuid() }])
    }
    incrementClaps(cb)
  }
  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        meta={
          imagePublicURL
            ? [
                {
                  property: `og:image`,
                  content: "https://coffeecodeclimb.com" + imagePublicURL,
                },
                {
                  property: `og:image:secure_url`,
                  content: "https://coffeecodeclimb.com" + imagePublicURL,
                },
                {
                  name: `twitter:image`,
                  content: "https://coffeecodeclimb.com" + imagePublicURL,
                },
              ]
            : []
        }
      />

      {
        /** only Markdown pages have tableOfContents*/
        tableOfContents && (
          <TableOfContents title={postTitle} __html={tableOfContents} />
        )
      }
      <h1>{post.frontmatter.title}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {post.frontmatter.date}
      </p>

      <article
        style={{ clear: "both" }}
        className={"blog-content"}
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <div className={"blog-tags"} style={{ marginBottom: `2rem` }}>
        {post.frontmatter.tags.map((tag, index) => (
          <Tag key={index}>
            <Link to={`/tags/${_.kebabCase(tag)}/`}>{tag}</Link>
          </Tag>
        ))}
      </div>
      <ClapsLayoutContainer>
        <Claps>
          {transitions.map(({ item, props, key }, i) => (
            <Remover key={key}>
              <PlusCounter style={props} widthPx={100}>
                +1
              </PlusCounter>
            </Remover>
          ))}
          {isLoading ? (
            <Skeleton animation="wave"></Skeleton>
          ) : (
            <>
              <div style={{ display: "flex" }}>
                <span>{clapsToDisplay}</span>
                <div onClick={handleClick}>
                  <ThumsUp viewerHasClapped={viewerHasClapped} />
                </div>
              </div>

              <small>{clapLimitReached && "Limit Reached"}</small>
            </>
          )}
        </Claps>
      </ClapsLayoutContainer>
      <ClapsFixedContainer>
        <Claps>
          {transitions.map(({ item, props, key }) => (
            <Remover key={key}>
              <PlusCounter style={props}>+1</PlusCounter>
            </Remover>
          ))}
          {isLoading ? (
            <Skeleton animation="wave"></Skeleton>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: `center` }}>
                <span>{clapsToDisplay}</span>
                <div onClick={handleClick}>
                  <ThumsUp viewerHasClapped={viewerHasClapped} />
                </div>
              </div>

              <small>{clapLimitReached && "Limit Reached"}</small>
            </>
          )}
        </Claps>
      </ClapsFixedContainer>
      <Hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      <PrevNextNavigation previous={previous} next={next} />
      <Hr />
      <h3>Comments</h3>
      <CreateComment url={location.pathname} />
      <CommentsByUrl url={location.pathname} />
    </LayoutManager>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
    }
  }
`

interface QueryClapsResponse {
  /**
   * The current slug
   */
  slug: string
  /**
   * The total number of of claps for a given slug
   */
  total: number
  /**
   * The number of claps that the current user has committed
   */
  viewerClapCount: number
  /**
   * The total number of unique voters
   */
  voterCount: number
}

interface SvgProps {
  viewerHasClapped?: boolean
}
const Svg = styled(animated.svg).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !["viewerHasClapped"].includes(prop),
})<SvgProps>`
  cursor: pointer;
  transition: color 100ms ease-in-out, transform 100ms ease-in-out;
  will-change: color;
  color: ${theme("mode", {
    light: Colors.BLACK_DARKER,
    dark: Colors.SILVER_LIGHTER,
  })};
  :hover&:not(:active) {
    color: ${theme("mode", {
      light: Colors.GREY_LIGHTER,
      dark: Colors.GREY_DARKER,
    })};
  }
  :active {
    transform: scale(1.2);
  }
  ${(p) =>
    p.viewerHasClapped &&
    css`
      fill: ${theme("mode", {
        light: Colors.CYAN,
        dark: Colors.PURPLE,
      })};
    `}
`

const ThumsUp = memo(({ viewerHasClapped }: { viewerHasClapped?: boolean }) => {
  return (
    <Svg
      viewerHasClapped={viewerHasClapped}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      // style="color:var(--geist-foreground)"
    >
      <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </Svg>
  )
})

interface PlusCounterProps {
  widthPx?: number
}

/**
 * @see https://styled-components.com/releases#v5.1.0
 *
 * Fix ERROR:
 * > Warning: React does not recognize the `widthPx` prop on a DOM element.
 * > If you intentionally want it to appear in the DOM as a custom attribute,
 * > spell it as lowercase `widthpx` instead. If you accidentally passed it
 * > from a parent component, remove it from the DOM element.
 */
const PlusCounter = styled(animated.div).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["widthPx"].includes(prop),
})<PlusCounterProps>`
  pointer-events: none;

  color: ${theme("mode", {
    light: Colors.CYAN,
    dark: Colors.PURPLE,
  })};
  width: ${(p) => (p.widthPx ? `${p.widthPx}px` : `100%`)};
  text-align: center;
  position: absolute;

  text-shadow: 1px 1px 0px var(--table-border);
`

const Remover = memo(({ children }) => {
  return <>{children}</>
})

export const Hr = styled(animated.div)`
  min-height: 1px;
  margin-bottom: 2px;
  background: ${theme("mode", {
    light: Colors.GREY_LIGHTER,
    dark: Colors.GREY_DARKER,
  })};
`

// Match TableOfContents.tsx
const background = theme("mode", {
  light: "rgba(0,0,0,0.1)",
  dark: "rgba(255,255,255,0.1)",
})
const Claps = styled(animated.div)`
  position: relative;
  background: ${background};
`
const ClapsFixedContainer = styled(animated.div)`
  --blog-width: 42rem;
  --blog-padding-x: 1.3125rem;
  --max-width: 1192px;

  /* allow click through */
  pointer-events: none;

  margin-left: calc(
    (min(100vw, var(--max-width)) - var(--blog-width) + var(--blog-padding-x)) /
      -2
  );

  position: fixed;
  top: 30%;
  height: 50px;
  width: 100vw;
  max-width: var(--max-width);

  ${Claps} {
    /* capture clicks */
    pointer-events: all;
    span {
      user-select: none;
      margin-right: 1rem;
    }
    > p,
    > small {
      user-select: none;
      display: flex;
      justify-content: center;
      margin: 0;
    }
    width: 145px;
    padding: 1rem;

    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: ${theme("mode", {
      light: Colors.GREY_LIGHTER,
      dark: Colors.GREY_DARKER,
    })};
  }

  color: ${theme("mode", {
    light: Colors.BLACK,
    dark: Colors.SILVER,
  })};

  @media (max-width: 1200px) {
    display: none;
  }
`

const ClapsLayoutContainer = styled(animated.div)`
  ${Claps} {
    span {
      user-select: none;
      margin-right: 1rem;
    }
    > p,
    > small {
      user-select: none;
      display: flex;
      margin: 0;
    }
    padding: 1rem;

    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: ${theme("mode", {
      light: Colors.GREY_LIGHTER,
      dark: Colors.GREY_DARKER,
    })};

    margin-bottom: 1rem;
  }
`
