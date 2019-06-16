import React, { useState } from "react"
import { graphql } from "gatsby"
import styled, { css } from "styled-components"
import { animated, useTransition, useSpring, config } from "react-spring"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import random from "lodash/random"
import uuid from "uuid"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AttackCounter = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform(-50%, -50%);
  ${props =>
    props.value &&
    css`
      font-size: ${36 + props.value}px;
    `}
`
const AnimatedAttackCounter = animated(AttackCounter)

function AttackAnimationSimulator(props) {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title

  // list of attacks
  const [items, setItems] = useState([])
  // local state for total damage
  const [d, setD] = useState(0)
  // animated value for total damage
  const [totalDamage, setTotalDamage] = useSpring(() => ({
    number: 0,
  }))

  const attack = () => {
    const dmg = random(5, 50)

    // Add attack to array of attacks
    setItems(items => [...items, { id: uuid(), text: dmg }])
    // CSSTransition.onEntered() will remove the attack when finisehd animating

    // Local state to keeptrack of total damage
    setD(d + dmg)

    // Animated total damage "spring"
    setTotalDamage({ number: d + dmg })
  }
  const reset = () => {
    setItems([])
    setD(0)
    setTotalDamage({ number: 0 })
  }

  const AnimatedtotalDamage = animated.pre
  const AnimatedDamageBar = animated.div

  const transitions = useTransition(items, item => item.id, {
    from: ({ text }) => {
      return { opacity: 0, transform: `translate3d(0%,0%,0)` }
    },
    enter: ({ text }) => {
      return {
        opacity: 1,
        transform: `translate3d(${random(-50, 50)}%,-${100 + text}%,0)`,
      }
    },
    leave: {
      opacity: 0,
      transform: `translate3d(0%,-30%,0)`,
    },
    // onDestroyed: e => {
    //   console.log("onDestroyed - e", e)
    // },
    config: ({ text }) => {
      console.log("text", text)
      return text <= 20
        ? config.slow
        : text <= 40
        ? config.gentle
        : config.stiff
    },
  })

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="Attack Animation Simulator" />
      <h1>Attack Animation Simulator</h1>
      <div className="container" style={{ height: `100vh` }}>
        <button onClick={attack}>Attack</button>
        <button onClick={reset}>Reset</button>

        <AnimatedtotalDamage
          className="damage-dealt"
          // dangerouslySetInnerHTML={{ __html: totalDamage.number }}
        >
          {totalDamage.number}
        </AnimatedtotalDamage>
        <AnimatedDamageBar
          style={{
            display: "inline-block",
            minHeight: `30px`,
            minWidth: totalDamage.number,
            background: totalDamage.number.interpolate({
              range: [0, 500, 1000],
              output: ["#009a00", "#f9ff00", "#ff0000"],
            }),
          }}
        />

        {/* <AnimatedtotalDamage className="damage-dealt">{d}</AnimatedtotalDamage> */}

        {/* <pre>{JSON.stringify(totalDamage, null, 2)}</pre> */}

        <TransitionGroup className="attacks">
          {transitions.map(({ item, props, key }) => (
            <CSSTransition
              key={key}
              timeout={600 + item.text * 10}
              classNames="item"
              onEntered={() =>
                setItems(items => items.filter(e => e.id !== item.id))
              }
            >
              <React.Fragment>
                <AnimatedAttackCounter
                  value={item.text}
                  style={{
                    ...props,
                    // color: props.interpolate({
                    //   range: [0, 1],
                    //   output: ["red", "#ffaabb"],
                    // }),
                  }}
                >
                  {item.text}
                </AnimatedAttackCounter>
              </React.Fragment>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </Layout>
  )
}

export default AttackAnimationSimulator

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

// color: props.text.interpolate({
//   range: [0, 35, 50],
//   output: ["#18af1b", "#ffc300", "#ff3f3f"],
// }),
