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
        // onFrame: props => {
        //   window.scroll(0, scrollTop)
        // },
      })
    },
    { domTarget: typeof window !== "undefined" && window }
  )
  useEffect(bindScrollGesture, [bindScrollGesture])

  // console.time()
  const ast: [ASTNode] = useCallback(parse(__html), [])

  const helper = useCallback(
    (nodes: (ASTNode | LeafNode)[], depth = 0): React.ReactNode => {
      return nodes.map(node => {
        if (!node.children) return node.content
        // console.log(node)s

        // intercept "<a>" nodes, and create a gatsby Link instead
        if (node.name === "a") {
          const hash = node.attrs.href
            .replace(window.location.pathname, "")
            .replace("#", "")
          // this needs run after useEffect, aka after the browser
          // gets a chance to paint
          const anchor = document.getElementById(hash)
          return React.createElement(
            /** React.createElement(TYPE, _, _) */
            Link,
            /** React.createElement(_, PROPS, _) */
            {
              /**
               * node.attrs.href: "/feb-2-2020/#reminders-to-myself"
               * window.location.pathname: "/feb-2-2020/"
               * window.location.hash: "#reminders-to-myself"
               */
              to: node.attrs.href,
              activeStyle: { color: "red" },
              /**
               * style will only be instantiated, and not dynamically updated
               */
              // style: {
              //   fontSize:
              //     window.location.pathname + window.location.hash ===
              //     node.attrs.href
              //       ? "20px"
              //       : "",
              // },
              onClick: e => {
                // prevent jumping
                // but also prevents updating window hash
                e.preventDefault()

                // update the hash...
                const hash = e.target.href
                  ?.replace(window.location.origin, "")
                  .replace(window.location.pathname, "")
                  .replace("#", "")
                // https://stackoverflow.com/questions/3870057/how-can-i-update-window-location-hash-without-jumping-the-document
                if (history.pushState) {
                  // IE10, Firefox, Chrome, etc.
                  window.history.pushState(null, null, "#" + hash)
                } else {
                  // IE9, IE8, etc
                  window.location.hash = hash
                }

                // find the anchor element that corresponds to the hash
                const anchor = document.getElementById(hash)
                const offset = anchor?.offsetTop

                // scroll to that element
                window.scrollTo({
                  top: offset,
                  behavior: "smooth",
                })
              },
            },
            /** React.createElement(_, _, CHILDREN) */
            helper(node.children, depth + 1)
          )
        }

        return React.createElement(
          node.name,
          node.attrs,
          helper(node.children, depth + 1)
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
    setGenerated(helper(ast))
  }, [])
  // const generated = helper(ast)

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
