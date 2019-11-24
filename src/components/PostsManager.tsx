import * as React from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import moment from "moment"
import styled from "styled-components"
import { animated, useTransition } from "react-spring"

import { Button } from "components/Button"
import * as Posts from "components/Posts"

const CSSGrid = styled(animated.div)`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* grid-template-rows: repeat(auto-fill, minmax(9%, 1fr)); */
  /* grid-auto-rows: auto-fill; */
  /* grid-template-rows: 25% 100px auto; */

  row-gap: 30px;
  /* column-gap: 10px; */
`

const checkIsMarkdownRemark = node => node.internal.type === `MarkdownRemark`
const checkIsContentfulBlogPost = node =>
  node.internal.type === `ContentfulBlogPost`

const PostsManager = ({ allPosts, location }) => {
  const postsVersion = useSelector(state => state.postsVersion)
  /**
   * Combine Markdown & Contentful posts. Sort by newest Date.
   */
  const posts = React.useMemo(
    () =>
      _.sortBy(allPosts, ({ node }) => {
        let date = moment(
          node.internal.type === `MarkdownRemark`
            ? node.frontmatter.date
            : node.date
        )
        return -date
      }),
    []
  )

  // contentful nodes don't have `.id`

  const [items, setItems] = React.useState(() => posts)
  const [columnCount, setColumnCount] = React.useState(4)

  const transitions = useTransition(
    items,
    ({ node }) => {
      return node.internal.type === `MarkdownRemark`
        ? `${node.frontmatter.title}`
        : `${node.title}`
    },
    {
      from: { opacity: 0 },
      enter: item => {
        const index = items.indexOf(item)
        return {
          opacity: 1,
          left: `${(index % columnCount) * (100 / columnCount)}%`,
          top: `${Math.floor(index / columnCount) * 400}px`,
        }
      },
      update: item => {
        const index = items.indexOf(item)
        return {
          opacity: 1,
          left: `${(index % columnCount) * (100 / columnCount)}%`,
          top: `${Math.floor(index / columnCount) * 400}px`,
        }
      },
      leave: { opacity: 0 },
    }
  )

  if (postsVersion === 1) {
    /**
     * postsVersion-2 can scroll quite deep, and when toggling versions,
     * the `scrollTop` value is persisted.
     *
     * As a courtesy, scroll the window back to the top.
     */
    /**
     * @warn This is actually a huhge performance hinderance, when even
     * state updates.
     */
    // typeof window !== "undefined" &&
    //   window.scrollTo({
    //     top: 0,
    //     left: 0,
    //     behavior: "smooth",
    //   })
    return (
      <>
        <Button onClick={() => setItems(arr => arr.filter((_, i) => i !== 0))}>
          delete first
        </Button>
        <Button onClick={() => setItems([])}>delete all</Button>
        <Button onClick={() => setItems(allPosts)}>reset</Button>
        <Button onClick={() => setColumnCount(1)}>1</Button>
        <Button onClick={() => setColumnCount(2)}>2</Button>
        <Button onClick={() => setColumnCount(3)}>3</Button>
        <Button onClick={() => setColumnCount(4)}>4</Button>
        <Button onClick={() => setColumnCount(5)}>5</Button>
        <Button onClick={() => setColumnCount(6)}>6</Button>
        <Button onClick={() => setColumnCount(7)}>7</Button>
        <Button onClick={() => setColumnCount(8)}>8</Button>
        <Button onClick={() => setColumnCount(9)}>9</Button>
        <CSSGrid>
          {transitions.map(({ item: { node }, key, props }, index) => {
            const isMarkdownRemark = checkIsMarkdownRemark(node)
            const isContentfulBlogPost = checkIsContentfulBlogPost(node)

            const title =
              node.internal.type === `MarkdownRemark` &&
              (node.frontmatter.title || node.fields.slug)

            return (
              <Posts.V1
                style={props}
                key={isMarkdownRemark ? node.fields.slug : node.slug}
                linkTo={isMarkdownRemark ? node.fields.slug : node.slug}
                date={isMarkdownRemark ? node.frontmatter.date : node.date}
                title={isMarkdownRemark ? title : node.title}
                description={
                  isMarkdownRemark
                    ? node.frontmatter.description
                    : node.description
                }
                excerpt={isMarkdownRemark ? node.excerpt : null}
                tags={isMarkdownRemark ? node.frontmatter.tags : node.tags}
                origin={isMarkdownRemark ? location.origin : null}
                id={node.id}
                image={isMarkdownRemark ? node.frontmatter.image : node.image}
                index={index}
                nodeType={node.internal.type}
              />
            )
          })}
        </CSSGrid>
      </>
    )
  }
  if (postsVersion === 2)
    return posts.map(({ node }, index) => {
      const isMarkdownRemark = checkIsMarkdownRemark(node)
      const isContentfulBlogPost = checkIsContentfulBlogPost(node)

      const title =
        node.internal.type === `MarkdownRemark` &&
        (node.frontmatter.title || node.fields.slug)

      return (
        <Posts.V2
          key={isMarkdownRemark ? node.fields.slug : node.slug}
          linkTo={isMarkdownRemark ? node.fields.slug : node.slug}
          date={isMarkdownRemark ? node.frontmatter.date : node.date}
          title={isMarkdownRemark ? title : node.title}
          description={
            isMarkdownRemark ? node.frontmatter.description : node.description
          }
          excerpt={isMarkdownRemark ? node.excerpt : null}
          tags={isMarkdownRemark ? node.frontmatter.tags : node.tags}
          origin={isMarkdownRemark ? location.origin : null}
          id={node.id}
          image={isMarkdownRemark ? node.frontmatter.image : node.image}
          index={index}
          nodeType={node.internal.type}
        />
      )
    })
  return null
}

export { PostsManager }
