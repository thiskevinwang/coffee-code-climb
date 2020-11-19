// attack-animation-simulator.tsx
import React, {
  memo,
  useState,
  useEffect,
  ReactElement,
  useCallback,
} from "react"
import { useSelector } from "react-redux"
import { graphql } from "gatsby"
import styled, { css } from "styled-components"
import {
  a,
  animated,
  useTransition,
  useSpring,
  config,
  AnimatedValue,
} from "react-spring"

import { CSSTransition, TransitionGroup } from "react-transition-group"
import random from "lodash/random"
import debounce from "lodash/debounce"
import throttle from "lodash/throttle"
import uuid from "uuid"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { rhythm, scale } from "utils/typography"
import { Button } from "components/Button"
import * as Colors from "consts/Colors"

const AnimatedPre = a(styled.pre`
  transition: color 200ms ease-in-out;
  color: ${(props) =>
    props.isDarkMode ? Colors.silverLight : Colors.blackLight};
`)
const AnimatedBar = memo(
  animated(styled.div`
    max-width: 100%;
  `)
)
const StyledDescription = memo(styled.div`
  border: 1px solid grey;
  border-radius: 5px;
  display: block;
  padding: ${rhythm(0.5)};
  margin: ${rhythm(0.5)};
`)

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
  ${(props) =>
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

const AnimatedAttackCounter = memo(animated(AttackCounter))

/**
 * # <Damage />
 * A container for using animated values to animate
 * total damage as a number and a visual bar.
 * @param {...*} props
 * @param {AnimatedValue} props.totalDamage
 *
 * @returns {ReactElement} ReactElement
 */
const Damage = memo(
  ({
    totalDamage,
    isDarkMode,
  }: {
    totalDamage: AnimatedValue<{ number: number }>
    isDarkMode: boolean
  }): ReactElement => {
    return (
      <>
        <StyledDescription>
          <>Damage</>
          <AnimatedPre isDarkMode={isDarkMode}>
            {totalDamage.number.interpolate((x) => x.toFixed(0))}
          </AnimatedPre>
          <AnimatedBar
            style={{
              display: "inline-block",
              minHeight: `30px`,
              minWidth: totalDamage.number,
              maxWidth: `100%`,
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
        </StyledDescription>
      </>
    )
  }
)

/**
 * # <Stamina />
 * A container for using animated values to animate
 * total stamina as a number and a visual bar.
 * @param {...*} props
 * @param {AnimatedValue} props.totalStamina
 *
 * @returns {ReactElement} ReactElement
 */
const Stamina = memo(
  ({
    totalStamina,
    isDarkMode,
  }: {
    totalStamina: AnimatedValue<{ number: number }>
    isDarkMode
  }): ReactElement => {
    return (
      <>
        <StyledDescription>
          <>Stamina</>
          <AnimatedPre isDarkMode={isDarkMode}>
            {/* interpolate on the anivated value to return a string */}
            {totalStamina.number.interpolate((x) => x.toFixed(0))}
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
        </StyledDescription>
      </>
    )
  }
)

/**
 * # AttackAnimationSimulator
 * Cool thing
 */
function AttackAnimationSimulator(props) {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title

  const isDarkMode = useSelector((state) => state.isDarkMode)

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
  const [maxStamina, setMaxStamina] = useState(1000)

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
   * Note: attaching this to the window, **once**, in `useEffect`, will cause
   * the same instance of `attack` to be called every time for that event listener.
   *
   * However, for the case of a button's `onClick` event, if the
   * component rerenders, onClick will be calling a new instance
   * of `attack`.
   *
   * This can be fixed with `useCallback`, which returns a memoized
   * version of the function.
   */
  const attack = useCallback(() => {
    const dmg = random(5, 50)

    // Add attack to array of attacks
    setItems((items) => [...items, { id: uuid(), text: dmg }])
    // CSSTransition.onEntered() will remove the attack when finisehd animating

    setTotalDamage({ number: totalDamage.number.getValue() + dmg })
    setTotalStamina({ number: totalStamina.number.getValue() - dmg })

    debouncedResetStamina()
  }, [])

  /**
   * # `reset`
   * ### aka 'handleReset'
   */
  const reset = () => {
    debouncedResetStamina.flush()
    setItems([]) // This causes a rerender
    setTotalDamage({ number: 0 })
    // setTotalStamina({ number: maxStamina })
  }

  /**
   *  # `debouncedResetStamina`
   * For this to be `.cancel`-able, it must be memoized with
   * `useCallback` so that a new instance doesn't get created
   * when the component rerenders.
   * - this gets called inside `attack()`
   * - wait time is 2000 ms
   * - this gets canceled inside `reset()`
   */
  const debouncedResetStamina = useCallback(
    debounce(() => {
      setTotalStamina({ number: maxStamina })
    }, 2000),
    []
  )

  /**
   * # Transitions
   * Applies transitions to the `items` array.
   * ```
   * type Item: {
   *   text: number|string
   *   id: string // uuid()
   * }>
   * ```
   * `config:` can be a callback, with the specific `{item}` and `state`
   * as 1st and 2nd args, respectively.
   */
  const transitions = useTransition(items, (item) => item.id, {
    from: ({ text }) => {
      return { opacity: 0, transform: `translate3d(0%,0%,0)` }
    },
    enter: ({ text }) => ({
      opacity: 1,
      transform: `translate3d(${random(-50, 50)}%,-${100 + text}%,0)`,
    }),
    leave: {
      opacity: 0,
      transform: `translate3d(0%,-30%,0)`,
    },
    // onDestroyed: e => {
    //   debouncedResetStamina()
    // },
    config: ({ text }, state) => {
      return text <= 20
        ? config.slow
        : text <= 40
        ? config.gentle
        : state === "leave"
        ? { ...config.molasses, duration: 2000 }
        : config.stiff
    },
    /**
     * same thing as CSSTransition.onEntered
     */
    // onRest: item => {
    //   setItems(items => items.filter(e => e.id !== item.id))
    // },
  })

  /**
   * Attach event listeners
   */
  useEffect(() => {
    const handleKeyPress = throttle((e) => {
      e.key === "a" ? attack() : e.key === "r" ? reset() : null
    }, 100)

    typeof window !== "undefined" &&
      window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [])

  return (
    <LayoutManager location={props.location} title={siteTitle}>
      <SEO title="Attack Animation Simulator" />
      <h1>Attack Animation Simulator</h1>
      <div className="container" style={{ height: `100vh` }}>
        <Button onClick={attack}>
          <label>(Press A)</label>
          <span>Attack</span>
        </Button>
        <Button onClick={reset}>
          <label>(Press R)</label>
          <span>Reset</span>
        </Button>

        <Damage totalDamage={totalDamage} isDarkMode={isDarkMode} />

        <Stamina totalStamina={totalStamina} isDarkMode={isDarkMode} />

        {/* <AnimatedPre className="damage-dealt">{d}</AnimatedPre> */}

        {/* <pre>{JSON.stringify(totalDamage, null, 2)}</pre> */}

        <TransitionGroup className="attacks">
          {transitions.map(({ item, props, key }, i) => (
            <CSSTransition
              key={key}
              timeout={600 + item.text * 10}
              classNames="item"
              onEntered={() =>
                setItems((items) => items.filter((e) => e.id !== item.id))
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
    </LayoutManager>
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
