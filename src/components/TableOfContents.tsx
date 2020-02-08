import React, { useEffect, useCallback, useState } from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"
import { useScroll } from "react-use-gesture"
import { Link } from "gatsby"
import { parse } from "html-parse-stringify"

import { rhythm } from "utils/typography"

const Container = styled(animated.div)`
  position: absolute;
  right: 0;
  margin-right: 20px;
  max-width: ${rhythm(12)};

  @media (max-width: 1200px) {
    position: relative;
    top: 0 !important;
  }

  li {
    list-style: none;
  }
  * {
    font-size: 12px;
  }
`

interface LeafNode {
  type: "text"
  content: "↵"
}
interface ASTNode {
  type: string
  name: string
  voidElement: boolean
  attrs: any
  children: (LeafNode | ASTNode)[]
}

interface TableOfContentsProps {
  title: string
  __html: string
}
const TableOfContents: React.FC<TableOfContentsProps> = ({ title, __html }) => {
  const [{ top }, set] = useSpring(() => ({ top: 0 }))

  const bindScrollGesture = useScroll(
    state => {
      const scrollTop = state.values[1]

      set({
        top: scrollTop + 50,
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

  const ast: [ASTNode] = useCallback(parse(__html), [])

  /**
   * # generateTree
   * Recursive helper function, used to traverse the Abstract Syntax Tree returned by
   * { parse } from "html-parse-stringify", and then generate
   * a React Tree.
   *
   * @param nodes the ast returned by `html-parse-stringify`
   * @param depth just for fun
   */
  const generateTree = useCallback(
    (nodes: (ASTNode | LeafNode)[], depth: number = 0): React.ReactNode => {
      return nodes.map(node => {
        if (!node.children) return node.content

        // intercept "<a>" nodes, and create a gatsby Link instead
        if (node.name === "a") {
          const hash = node.attrs.href
            .replace(window.location.pathname, "")
            .replace("#", "")

          // this needs run after useEffect, aka after the browser
          // gets a chance to paint
          const anchorEl = document.getElementById(hash)
          const offset = anchorEl?.offsetTop

          // create a ref to attach to each TOC <a> tag
          const ref = React.createRef()
          const options = {
            root: null,
            rootMargin: "0px 0px -70%",
            threshold: 1.0,
          }

          // https://stackoverflow.com/questions/3870057/how-can-i-update-window-location-hash-without-jumping-the-document
          const updateHashTo = (hash: string) => {
            history.replaceState
              ? // IE10, Firefox, Chrome, etc
                window.history.replaceState?.(null, null, `#${hash}`)
              : // IE9, IE8, etc
                (window.location.hash = hash)
          }

          // create intersectionObservers to watch if the Header tags
          // are intersection with a specified area
          const observer = new IntersectionObserver(([entry], observer) => {
            if (entry.isIntersecting) {
              ref.current.className = "TOC TOC__FOCUS"
              entry.target.className = "HEADER HEADER__FOCUS"
              updateHashTo(hash)
            } else {
              ref.current.className = "TOC"
              entry.target.className = "HEADER"
            }
          }, options)
          observer.observe(anchorEl)

          return React.createElement(
            /** React.createElement(TYPE, _, _) */
            node.name,
            /** React.createElement(_, PROPS, _) */
            {
              ref,
              ...node.attrs,
              /**
               * @TODO style will only apply initially, and will not be dynamically updated
               */
              // style: {
              //   fontSize:
              //     window.location.pathname + window.location.hash ===
              //     node.attrs.href
              //       ? "20px"
              //       : "",
              // },
              onClick: e => {
                // prevent jumping - but also prevents updating window hash
                e.preventDefault()
                // https://stackoverflow.com/questions/3870057/how-can-i-update-window-location-hash-without-jumping-the-document
                updateHashTo(hash)
                window.scrollTo({
                  top: offset,
                  behavior: "smooth",
                })
              },
            },
            /** React.createElement(_, _, CHILDREN) */
            generateTree(node.children, depth + 1)
          )
        }

        return React.createElement(
          node.name,
          node.attrs,
          generateTree(node.children, depth + 1)
        )
      })
    },
    []
  )

  const [generated, setGenerated] = useState()
  useEffect(() => {
    /**
     * call `helper()` from within useEffect, so that the browser has a
     * chance to paint. This way we can do trickery like 'window.getDocumentById(hash)'
     * from within the `helper` function.
     */
    setGenerated(generateTree(ast))
  }, [])

  return (
    <Container style={{ top, zIndex: 10 }}>
      <p
        style={{
          fontWeight: 700,
          marginTop: 20,
          marginBottom: 20,
          letterSpacing: 1.5,
          fontSize: 16,
        }}
      >
        TABLE OF CONTENTS
      </p>
      <li>
        <Link to={typeof window !== "undefined" && window.location.pathname}>
          {title}
        </Link>
        {generated}
      </li>
    </Container>
  )
}

export { TableOfContents }
