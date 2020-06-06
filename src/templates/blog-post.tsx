import React, { useCallback, useState } from "react"
import { Link, graphql } from "gatsby"
import _ from "lodash"
import styled from "styled-components"
import theme from "styled-theming"
import { animated } from "react-spring"
import { Skeleton } from "@material-ui/lab"
import axios from "axios"

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
import * as Colors from "consts/Colors"
import { useFetch } from "hooks/useFetch"

export const Hr = styled(animated.div)`
  min-height: 1px;
  margin-bottom: 2px;
  background: ${theme("mode", {
    light: Colors.greyLighter,
    dark: Colors.greyDarker,
  })};
`

const Claps = styled(animated.div)``
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
      light: Colors.greyLighter,
      dark: Colors.greyDarker,
    })};
  }

  color: ${theme("mode", {
    light: Colors.black,
    dark: Colors.silver,
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
      light: Colors.greyLighter,
      dark: Colors.greyDarker,
    })};

    margin-bottom: 1rem;
  }
`

const URI = `${process.env.GATSBY_LAMBDA_ENDPOINT}/sandbox/claps`

export default function BlogPostTemplate({ data, pageContext, location }) {
  const post = data.markdownRemark
  const { title: siteTitle } = data.site.siteMetadata
  const { previous, next, postTitle, tableOfContents } = pageContext

  const { data: res, error } = useFetch<GetClapsResponse, any>(
    `${URI}?slug=${location.pathname}`
  )
  const isLoading = !res && !error

  const [claps, setClaps] = useState(0)
  const [clapLimitReached, setClapLimitReached] = useState(false)
  const upTick = useCallback(
    _.debounce(async () => {
      if (clapLimitReached) return
      try {
        const res = await axios.post(`${URI}?slug=${location.pathname}`)
        setClaps((c) => c + 1)
        // console.log("RESPONSE", res)
      } catch (err) {
        // Object.getOwnPropertyNames(err)
        // ["stack", "message", "config", "request", "response", "isAxiosError", "toJSON"]
        // console.log("ERROR", err.response?.status)
        if (err.response?.status === 500) {
          setClapLimitReached(true)
        }
      }
    }, 500),
    [clapLimitReached, setClapLimitReached]
  )
  const handleClick = () => {
    upTick()
  }

  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
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

      <div dangerouslySetInnerHTML={{ __html: post.html }} />

      <div style={{ marginBottom: `2rem` }}>
        {post.frontmatter.tags.map((tag, index) => (
          <Tag>
            <Link to={`/tags/${_.kebabCase(tag)}/`} key={index}>
              {tag}
            </Link>
          </Tag>
        ))}
      </div>
      <ClapsLayoutContainer>
        <Claps>
          {isLoading ? (
            <Skeleton animation="wave"></Skeleton>
          ) : (
            <>
              <p>
                <span>{parseInt(res?.Item?.claps.N ?? "0") + claps}</span>
                <div onClick={handleClick}>
                  <ThumsUp />
                </div>
              </p>

              <small>{clapLimitReached && "Limit Reached"}</small>
            </>
          )}
        </Claps>
      </ClapsLayoutContainer>
      <ClapsFixedContainer>
        <Claps>
          {isLoading ? (
            <Skeleton animation="wave"></Skeleton>
          ) : (
            <>
              <p>
                <span>{parseInt(res?.Item?.claps.N ?? "0") + claps}</span>
                <div onClick={handleClick}>
                  <ThumsUp />
                </div>
              </p>

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

interface GetClapsResponse {
  Item: Item
}

interface Item {
  PK: Key
  SK: Key
  claps: Claps
}

interface Claps {
  N: string
}

interface Key {
  S: string
}

const Svg = styled.svg`
  cursor: pointer;
  transition: color 50ms ease-in-out, transform 100ms ease-in-out;
  will-change: color;
  :hover&:not(:active) {
    color: ${theme("mode", {
      light: Colors.greyLighter,
      dark: Colors.greyDarker,
    })};
  }
  :active {
    color: ${theme("mode", {
      light: Colors.greyDarker,
      dark: Colors.greyLighter,
    })};
    transform: scale(1.2);
  }
`

const ThumsUp = () => {
  return (
    <Svg
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
}
