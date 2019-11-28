import * as React from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import moment from "moment"
import styled from "styled-components"
import { animated, useTransition, useSpring, config } from "react-spring"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import { Button } from "components/Button"
import * as Posts from "components/Posts"

const Manager = styled(animated.div)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
`
const CardHolder = styled(animated.div)`
  /* border: ${process.env.NODE_ENV === "development" && `1px dotted green`}; */
  position: relative;
`

const checkIsMarkdownRemark = node => node.internal.type === `MarkdownRemark`
const checkIsContentfulBlogPost = node =>
  node.internal.type === `ContentfulBlogPost`

const PostsManager = ({ allPosts, location }) => {
  const postsVersion = useSelector(state => state.postsVersion)
  /**
   * Combine Markdown & Contentful posts. Sort by newest Date.
   *
   * This is our source of truth that should never be mutated
   */
  const posts = React.useMemo(() => {
    const dateSorted = _.sortBy(allPosts, ({ node }) => {
      let date = moment(
        node.internal.type === `MarkdownRemark`
          ? node.frontmatter.date
          : node.date
      )
      return -date
    })
    return dateSorted
  }, [allPosts])

  // contentful nodes don't have `.id`

  const [items, setItems] = React.useState(posts)
  const [columnCount, setColumnCount] = React.useState(4)
  const [cardHeight, setCardHeight] = React.useState(200)

  const windowLg = useMediaQuery("(max-width:768px)")
  const windowMd = useMediaQuery("(max-width:672px)")
  const windowSm = useMediaQuery("(max-width:480px)")

  React.useEffect(() => {
    if (windowSm) {
      setColumnCount(1)
    } else if (windowMd) {
      setColumnCount(2)
    } else if (windowLg) {
      setColumnCount(3)
    } else {
      setColumnCount(4)
    }
  }, [windowSm, windowMd, windowLg])

  const handleAnimation = React.useCallback(
    item => {
      const index = items.indexOf(item)
      const row = _.floor(index / columnCount)
      const offset = Math.log(columnCount + 1) * row * 5
      return {
        height: `${cardHeight}px`,
        opacity: 1,
        left: `${(index % columnCount) * (100 / columnCount)}%`,
        top: `${row * cardHeight + offset}px`,
        width: `${(100 - columnCount) / columnCount}%`,
      }
    },
    [columnCount, cardHeight, items, windowSm, windowMd, windowLg]
  )
  const transitions = useTransition(
    items,
    ({ node }) => {
      return node.internal.type === `MarkdownRemark`
        ? `${node.frontmatter.title}`
        : `${node.title}`
    },
    {
      from: { opacity: 0 },
      enter: handleAnimation,
      update: handleAnimation,
      leave: {
        opacity: 0,
      },
      config: config.default,
    }
  )

  /**
   * @IMPORTANT
   * CardHolder height equation
   *
   * CardHeight === 300
   * CardCount === 24
   * ColumnCount === n [1...6]
   * RowCount === Math.ceil(CardCount / ColumnCount)
   *
   * height = CardHeight * RowCount
   */
  const cardHolderProps = useSpring({
    height: `${cardHeight * Math.ceil(items.length / columnCount)}px`,
  })

  const resize = (_columnCount: number, _cardHeight: number = 250) => () => {
    setColumnCount(_columnCount)
    setCardHeight(_cardHeight)
  }
  if (postsVersion === 1) {
    return (
      <Manager>
        <Button onClick={() => setItems(arr => arr.filter((_, i) => i !== 0))}>
          delete first
        </Button>
        <Button onClick={() => setItems([])}>delete all</Button>
        <Button onClick={() => setItems(posts)}>reset</Button>
        <Button
          onClick={() =>
            setItems(arr =>
              _.sortBy(arr, ({ node }) => {
                let date = moment(
                  node.internal?.type === `MarkdownRemark`
                    ? node.frontmatter.date
                    : node.date
                )
                return -date
              })
            )
          }
        >
          newest
        </Button>
        <Button
          onClick={() =>
            setItems(arr =>
              _.sortBy(arr, ({ node }) => {
                let date = moment(
                  node.internal?.type === `MarkdownRemark`
                    ? node.frontmatter.date
                    : node.date
                )
                return date
              })
            )
          }
        >
          oldest
        </Button>
        <Button onClick={resize(1)}>1</Button>
        <Button onClick={resize(2)}>2</Button>
        <Button onClick={resize(3)}>3</Button>
        <Button onClick={resize(4)}>4</Button>
        <Button onClick={resize(5)}>5</Button>
        <Button onClick={resize(6)}>6</Button>

        <CardHolder style={cardHolderProps}>
          {transitions.map(({ item: { node }, key, props }, index) => {
            const isMarkdownRemark = checkIsMarkdownRemark(node)
            const isContentfulBlogPost = checkIsContentfulBlogPost(node)

            const title =
              node.internal.type === `MarkdownRemark` &&
              (node.frontmatter.title || node.fields.slug)

            return (
              <Posts.V1
                style={props}
                // key={isMarkdownRemark ? node.fields.slug : node.slug}
                key={key}
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
        </CardHolder>
      </Manager>
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
