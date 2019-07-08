import { default as React, useRef, useEffect, useState, memo } from "react"
import styled, { css } from "styled-components"
import { useSpring, a, animated } from "react-spring"
import * as Colors from "src/consts/Colors"

const MinusSquareO = props => (
  <svg {...props} viewBox="64 -65 897 897">
    <g>
      <path
        d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 347h-442q-14 0 -25 10.5t-11 25.5v0q0 15 11 25.5t25 10.5h442q14 0 25 -10.5t11 -25.5v0
  q0 -15 -11 -25.5t-25 -10.5z"
      />
    </g>
  </svg>
)

const PlusSquareO = props => (
  <svg {...props} viewBox="64 -65 897 897">
    <g>
      <path
        d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 420h-184v183q0 15 -10.5 25.5t-25.5 10.5v0q-14 0 -25 -10.5t-11 -25.5v-183h-184
  q-15 0 -25.5 -11t-10.5 -25v0q0 -15 10.5 -25.5t25.5 -10.5h184v-183q0 -15 11 -25.5t25 -10.5v0q15 0 25.5 10.5t10.5 25.5v183h184q15 0 25.5 10.5t10.5 25.5v0q0 14 -10.5 25t-25.5 11z"
      />
    </g>
  </svg>
)

const CloseSquareO = props => (
  <svg {...props} viewBox="64 -65 897 897">
    <g>
      <path
        d="M717.5 589.5q-10.5 10.5 -25.5 10.5t-26 -10l-154 -155l-154 155q-11 10 -26 10t-25.5 -10.5t-10.5 -25.5t11 -25l154 -155l-154 -155q-11 -10 -11 -25t10.5 -25.5t25.5 -10.5t26 10l154 155l154 -155q11 -10 26 -10t25.5 10.5t10.5 25t-11 25.5l-154 155l154 155
  q11 10 11 25t-10.5 25.5zM888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0z"
      />
    </g>
  </svg>
)
export const Icons = { PlusSquareO, MinusSquareO, CloseSquareO }

/**
 * usePrevious
 * @param {boolean} value
 */
export function usePrevious(value: boolean) {
  const ref: MutableRefObject<any> = useRef()
  useEffect(() => void (ref.current = value), [value])
  return ref.current
}

/**
 * useMeasure
 */
export function useMeasure() {
  const ref = useRef()

  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })

  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  )

  // ro.observe on mount, and clean up
  useEffect(() => {
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [{ ref }, bounds]
}

/**
 * Tree
 */
export const Tree = memo(
  ({ children, name, style, defaultOpen = false, editable, onClick }) => {
    const [isOpen, setOpen] = useState(defaultOpen)

    const previous = usePrevious(isOpen)

    const [bind, { height: viewHeight }] = useMeasure()
    console.log("viewHeight", viewHeight)

    const { height, opacity, transform } = useSpring({
      from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
      to: {
        height: isOpen ? viewHeight : 0,
        opacity: isOpen ? 1 : 0,
        transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
      },
    })

    /**
     * Icon
     * If children:
     *   If isOpen: `MinusSquareO`
     *   If !isOpen: `PlusSquareO`
     * If !children: `CloseSquareO` aka X
     *
     * @note const Icons = { PlusSquareO, MinusSquareO, CloseSquareO }
     */
    const Icon =
      Icons[`${children ? (isOpen ? "Minus" : "Plus") : "Close"}SquareO`]

    return (
      <Frame isOpen={isOpen} editable={editable}>
        <Icon
          style={{ ...toggle, opacity: children ? 1 : 0.3 }}
          onClick={() => setOpen(!isOpen)}
        />
        <Title style={style} isOpen={isOpen} onClick={onClick}>
          {name}
        </Title>
        <Content
          style={{
            opacity,
            height: isOpen && previous === isOpen ? "auto" : height,
          }}
        >
          <animated.div style={{ transform }} {...bind} children={children}>
            {children}
          </animated.div>
        </Content>
      </Frame>
    )
  }
)

const Frame = styled("div")`
  position: relative;
  padding: 4px 0px 0px 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  vertical-align: middle;
  color: white;
  fill: ${props => (props.isOpen ? "red" : "green")};
  transition: background 150ms ease-in-out;

  ${props =>
    props.editable &&
    css`
      :hover {
        background: ${Colors.greyDarker};
      }
    `}
`

const Title = styled("span")`
  vertical-align: middle;
`

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
`

const toggle = {
  width: "1em",
  height: "1em",
  marginRight: 10,
  cursor: "pointer",
  verticalAlign: "middle",
}
