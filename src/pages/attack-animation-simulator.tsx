import React, { useState, useEffect, ReactElement } from "react"
import { graphql } from "gatsby"
import styled, { css } from "styled-components"
import {
  animated,
  useTransition,
  useSpring,
  config,
  AnimatedValue,
} from "react-spring"

import { CSSTransition, TransitionGroup } from "react-transition-group"
import random from "lodash/random"
import debounce from "lodash/debounce"
import uuid from "uuid"

import Layout from "../components/layout"
import SEO from "../components/seo"

import {
  MUIBoxShadow,
  MUIBoxShadowHover,
} from "@src/components/TemplateComponents/PrevNextNavigation"
import { rhythm, scale } from "@src/utils/typography"

const AnimatedPre = animated.pre
const AnimatedBar = animated.div
const AnimatedDescription = styled.div`
  border: 1px solid grey;
  border-radius: 5px;
  display: block;
  padding: ${rhythm(0.5)};
  margin: ${rhythm(0.5)};
`

// TODO: Extract this cool button
const NotUglyButton = styled.div`
  border: 1px solid grey;
  border-radius: 5px;
  box-shadow: ${MUIBoxShadow};
  color: grey;
  display: inline-block;
  padding: 0 ${rhythm(0.5)} ${rhythm(0.5)};
  margin: ${rhythm(0.5)};
  transition: all 200ms ease-in-out;

  label {
    display: flex;
    width: 100%;
    ${scale(-0.5)}
  }

  :hover {
    border: 1px solid black;
    box-shadow: ${MUIBoxShadowHover};
    color: black;
    transform: translate(0px, -5px) scale(1.05);
  }
`

/**
 * # AttackCounter
 * A `styled-component` that that updates style based on props
 *
 * @param {...*} props
 * @param {string|number} props.value some attack.damage value
 */
const AttackCounter = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform(-50%, -50%);
  ${props =>
    props.value &&
    css`
      font-size: ${36 + props.value}px;
      color: rgb(
        ${5 * props.value},
        ${250 / (props.value / 10)},
        ${250 / props.value}
      );
    `}
`
/**
 * # AnimatedAttackCounter
 * An `animated`, `styled-component`
 */
const AnimatedAttackCounter = animated(AttackCounter)

/**
 * # <Damage />
 * A container for using animated values to animate
 * total damage as a number and a visual bar.
 * @param {...*} props
 * @param {AnimatedValue} props.totalDamage
 *
 * @returns {ReactElement} ReactElement
 */
function Damage({
  totalDamage,
}: {
  totalDamage: AnimatedValue<{ number: number }>
}): ReactElement {
  return (
    <>
      <AnimatedDescription>Damage</AnimatedDescription>
      <AnimatedPre className="damage-dealt">
        {totalDamage.number.interpolate(x => x.toFixed(0))}
      </AnimatedPre>
      <AnimatedBar
        style={{
          display: "inline-block",
          minHeight: `30px`,
          minWidth: totalDamage.number,
          backgroundImage: totalDamage.number.interpolate({
            range: [0, 500, 1000],
            output: [
              `linear-gradient(130deg, #003a00, #009900)`,
              `linear-gradient(130deg, #00008a, #0000ff)`,
              `linear-gradient(130deg, #7a0000, #ff0000)`,
            ],
          }),
        }}
      />
    </>
  )
}

/**
 * # <Stamina />
 * A container for using animated values to animate
 * total stamina as a number and a visual bar.
 * @param {...*} props
 * @param {AnimatedValue} props.totalStamina
 *
 * @returns {ReactElement} ReactElement
 */
function Stamina({
  totalStamina,
}: {
  totalStamina: AnimatedValue<{ number: number }>
}): ReactElement {
  return (
    <>
      <AnimatedDescription>Stamina</AnimatedDescription>
      <AnimatedPre
        className="damage-dealt"
        /**
         * interpolate on the anivated value to return a string
         */
      >
        {totalStamina.number.interpolate(x => x.toFixed(0))}
      </AnimatedPre>
      <AnimatedBar
        style={{
          display: "inline-block",
          minHeight: `30px`,
          minWidth: totalStamina.number,
          backgroundImage: totalStamina.number.interpolate({
            range: [0, 500, 1000],
            output: [
              `linear-gradient(130deg, #7a0000, #ff0000)`,
              `linear-gradient(130deg, #7a7a00, #ffff00)`,
              `linear-gradient(130deg, #003a00, #009900)`,
            ],
          }),
        }}
      />
    </>
  )
}

function AttackAnimationSimulator(props) {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title

  // list of attacks
  const [items, setItems] = useState([])

  // https://www.react-spring.io/docs/hooks/use-spring
  /**
   * # Either:
   * ## overwrite values to change the animation
   * - If you re-render the component with changed props, the animation will update.
   * @see #1
   *
   * # Or:
   * ## pass a function that returns values, and update using "set"
   * - You will get an updater function back.
   * - It will not cause the component to render like an overwrite would (still the animation executes of course).
   * - Handling updates like this is useful for fast-occurring updates, but you should generally prefer it.
   * - Optionally there's also a stop function as a third argument.
   * @see #2
   */

  // #1
  // const totalDamage = useSpring({
  //   number: d,
  // })

  // #2
  const [totalDamage, setTotalDamage] = useSpring(() => ({
    number: 0,
  }))

  // stateful value, with unused updater
  const [maxStamina, __setMaxStamina] = useState(1000)

  // Animated value for <Stamina />
  const [totalStamina, setTotalStamina, stop] = useSpring(() => ({
    number: maxStamina,
    // config: config.gentle,
  }))

  // const totalStamina = useSpring({
  //   // from: { number: 0 },
  //   /**
  //    * script
  //    */
  //   // to: async next => {
  //   //   // cancelMap.set(item, cancel)
  //   //   await next({ number: d - r })
  //   //   await next({ number: 0 })
  //   // },
  //   /**
  //    * chain
  //    */
  //   // to: [{ number: r }],
  // })

  /**
   * # `attack`
   * ### aka 'handleAttack'
   */
  const attack = () => {
    const dmg = random(5, 50)

    // Add attack to array of attacks
    setItems(items => [...items, { id: uuid(), text: dmg }])
    // CSSTransition.onEntered() will remove the attack when finisehd animating

    setTotalDamage({ number: totalDamage.number.getValue() + dmg })
    setTotalStamina({ number: totalStamina.number.getValue() - dmg })

    debouncedResetStamina()
  }

  /**
   * # `reset`
   * ### aka 'handleReset'
   */
  const reset = () => {
    setItems([])
    setTotalDamage({ number: 0 })
    setTotalStamina({ number: maxStamina })
  }

  /**
   *  # `debouncedResetStamina`
   * - this gets called on every attack
   * - wait time is 2000 ms
   */
  const debouncedResetStamina = debounce(() => {
    console.log("debouncedResetStamina fired")
    setTotalStamina({ number: maxStamina })
  }, 2000)

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
    //   debouncedResetStamina()
    // },
    config: ({ text }) => {
      return text <= 20
        ? config.slow
        : text <= 40
        ? config.gentle
        : config.stiff
    },

    /**
     * same thing as CSSTransition.onEntered
     */
    // onRest: item => {
    //   setItems(items => items.filter(e => e.id !== item.id))
    // },
    // wtf, config has item and state...
    // config: (item, state) => {
    //   console.log(item)
    //   console.log(state)
    //   return state === "leave"
    //     ? {
    //         duration: 1000 + item.text * 10,
    //       }
    //     : config
    // },
  })

  /**
   * Attach event listeners
   */
  useEffect(() => {
    const handleKeyPress = e => {
      e.key === "a" ? attack() : e.key === "r" ? reset() : null
    }

    typeof window !== "undefined" &&
      window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [])

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="Attack Animation Simulator" />
      <h1>Attack Animation Simulator</h1>
      <div className="container" style={{ height: `100vh` }}>
        <NotUglyButton onClick={attack}>
          <label>(Press A)</label>Attack
        </NotUglyButton>
        <NotUglyButton onClick={reset}>
          <label>(Press R)</label>Reset
        </NotUglyButton>

        <Damage totalDamage={totalDamage} />

        <Stamina totalStamina={totalStamina} />

        {/* <AnimatedPre className="damage-dealt">{d}</AnimatedPre> */}

        {/* <pre>{JSON.stringify(totalDamage, null, 2)}</pre> */}

        <TransitionGroup className="attacks">
          {transitions.map(({ item, props, key }, i) => (
            <CSSTransition
              key={key}
              timeout={600 + item.text * 10}
              classNames="item"
              onEntered={() =>
                setItems(items => items.filter(e => e.id !== item.id))
              }
            >
              <AnimatedAttackCounter
                value={item.text}
                style={{
                  ...props,
                }}
              >
                {item.text}
              </AnimatedAttackCounter>
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
