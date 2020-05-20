import React, { memo, useState, useEffect, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import styled from "styled-components"
import {
  animated,
  useTransition,
  useSpring,
  config,
  interpolate,
} from "react-spring"
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

const checkIsMarkdownRemark = (node) => node.internal.type === `MarkdownRemark`
const checkIsContentfulBlogPost = (node) =>
  node.internal.type === `ContentfulBlogPost`

const PostsManager = memo(({ allPosts, location }) => {
  const postsVersion = useSelector((state) => state.postsVersion)
  /**
   * Combine Markdown & Contentful posts. Sort by newest Date.
   *
   * This is our source of truth that should never be mutated
   */
  const posts = useMemo(() => {
    const dateSorted = _.sortBy(allPosts, ({ node }) => {
      let date = new Date(
        node.internal.type === `MarkdownRemark`
          ? node.frontmatter.date
          : node.date
      )
      return -date
    })
    return dateSorted
  }, [allPosts])

  // contentful nodes don't have `.id`

  const [items, setItems] = useState(posts)
  const [columnCount, setColumnCount] = useState(4)
  const [cardHeight, setCardHeight] = useState(200)
  const [isRandom, setIsRandom] = useState(false)

  const windowLg = useMediaQuery("(max-width:768px)")
  const windowMd = useMediaQuery("(max-width:672px)")
  const windowSm = useMediaQuery("(max-width:480px)")

  useEffect(() => {
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

  const handleAnimation = useCallback(
    (item) => {
      const index = items.indexOf(item)
      const row = _.floor(index / columnCount)
      const offset = Math.log(columnCount + 1) * row * 5
      return {
        height: `${cardHeight}px`,
        left: `${(index % columnCount) * (100 / columnCount)}%`,
        top: `${row * cardHeight + offset}px`,
        width: `${(100 - columnCount) / columnCount}%`,
      }
    },
    [columnCount, cardHeight, items, windowSm, windowMd, windowLg]
  )

  const transitions = useTransition(
    items,
    ({ node }) => node.id ?? node.title,
    {
      from: (item) => {
        return {
          opacity: 0,
          ...handleAnimation(item),
          scale: 1,
          xy: [0, 0],
          deg: 0,
          rotateXY: [0, 0],
          transformOrigin: `50% 50% 0px`,
          center: [69, 69],
        }
      },
      enter: (item) => {
        return {
          opacity: 1,
          ...handleAnimation(item),
          scale: 1,
          xy: isRandom ? [_.random(-500, 500), _.random(-100, -1000)] : [0, 0],
          deg: isRandom ? _.random(-360, 360) : 0,
          rotateXY: isRandom
            ? [_.random(-500, 500), _.random(-1000, 1000)]
            : [0, 0],
          transformOrigin: `50% 50% 0px`,
          center: [69, 69],
        }
      },
      update: (item) => {
        return {
          opacity: 1,
          ...handleAnimation(item),
          scale: 1,
          xy: isRandom ? [_.random(-500, 500), _.random(-100, -1000)] : [0, 0],
          deg: isRandom ? _.random(-360, 360) : 0,
          rotateXY: isRandom
            ? [_.random(-500, 500), _.random(-1000, 1000)]
            : [0, 0],
          transformOrigin: `50% 50% 0px`,
          center: [69, 69],
        }
      },
      leave: (item) => {
        return {
          opacity: 0,
          ...handleAnimation(item),
          scale: 1,
          xy: [0, 0],
          deg: 0,
          rotateXY: [0, 0],
          transformOrigin: `50% 50% 0px`,
          center: [69, 69],
        }
      },
      config: config.default,
      trail: 80,
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

  const resize = useCallback(
    (_columnCount: number, _cardHeight: number = 250) => () => {
      setColumnCount(_columnCount)
      setCardHeight(_cardHeight)
    },
    [setColumnCount, setCardHeight]
  )

  useEffect(() => {
    /** resets the Cards' position / orientation */
    const resetPos = () => {
      setIsRandom(false)
    }

    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.keyCode) {
          case 82 /** "r" */:
            return resetPos()
          case 70 /** "f" */:
            return setIsRandom(true)
          default:
            return
        }
      }
    }

    /** add event listener */
    typeof window !== undefined && window.addEventListener("keyup", handleKeyUp)
    /** clean up event listener*/
    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // button handlers
  const handleDeleteFirst = () =>
    setItems((arr) => arr.filter((_, i) => i !== 0))
  const handleDeleteAll = () => setItems([])
  const handleReset = () => {
    setIsRandom(false)
    setItems(posts)
  }
  const handleSortByNewest = () =>
    setItems((arr) =>
      _.sortBy(arr, ({ node }) => {
        let date = new Date(
          node.internal?.type === `MarkdownRemark`
            ? node.frontmatter.date
            : node.date
        )
        return -date
      })
    )
  const handleSortByOldest = () =>
    setItems((arr) =>
      _.sortBy(arr, ({ node }) => {
        let date = new Date(
          node.internal?.type === `MarkdownRemark`
            ? node.frontmatter.date
            : node.date
        )
        return date
      })
    )
  if (postsVersion === 1) {
    return (
      <Manager>
        <Button onClick={handleDeleteFirst}>delete first</Button>
        <Button onClick={handleDeleteAll}>delete all</Button>
        <Button onClick={handleReset}>reset</Button>
        <Button onClick={handleSortByNewest}>newest</Button>
        <Button onClick={handleSortByOldest}>oldest</Button>
        <Button onClick={() => setIsRandom((s) => !s)}>randomize</Button>
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
                style={{
                  ...props,
                  transform: interpolate(
                    [props.xy, props.scale, props.deg, props.rotateXY],
                    ([x, y], scale, deg, [rX, rY]) =>
                      `perspective(500px) scale(${scale}) translate3D(${x}px, ${y}px, 0) rotate(${deg}deg) rotateX(${rX}deg) rotateY(${rY}deg)`
                  ),
                }}
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
})

export { PostsManager }
