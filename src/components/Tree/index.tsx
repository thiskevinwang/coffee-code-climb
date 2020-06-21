import {
  default as React,
  useRef,
  useEffect,
  useState,
  memo,
  MutableRefObject,
} from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"
import theme from "styled-theming"

import { useMeasure } from "hooks/useMeasure"

import { Icons } from "./Icons"

/**
 * usePrevious
 * @param {boolean} value
 */
export function usePrevious(value: boolean) {
  const ref: MutableRefObject<any> = useRef()
  useEffect(() => void (ref.current = value), [value])
  return ref.current
}

interface TreeProps {
  children: React.ReactChildren
  name: string
  style?: React.CSSProperties
  defaultOpen?: boolean
  onClick: () => void
}
/**
 * Tree
 */
export const Tree = memo(
  ({ children, name, style, defaultOpen = false, onClick }: TreeProps) => {
    const [isOpen, setOpen] = useState(defaultOpen)

    const previous = usePrevious(isOpen)

    const [bind, { height: viewHeight }] = useMeasure()

    const { height, opacity, transform } = useSpring({
      from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
      to: {
        height: isOpen ? viewHeight : 0,
        opacity: isOpen ? 1 : 0,
        transform: `translate3d(${isOpen ? 0 : 100}%,0,0)`,
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
      <Frame>
        <Icon
          style={{ ...toggle, opacity: children ? 1 : 0.3 }}
          onClick={() => setOpen(!isOpen)}
        />
        <Title style={style} onClick={onClick}>
          {name}
        </Title>
        <Content
          style={{
            opacity,
            height: isOpen && previous === isOpen ? "auto" : height,
          }}
        >
          <animated.div style={{ transform }} {...bind}>
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
`

const Title = styled("span")`
  vertical-align: middle;
`

const grey = theme("mode", {
  light: "rgb(0,0,0,0.1)",
  dark: "rgb(255,255,255,0.1)",
})
const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left-style: dashed;
  border-left-width: 1px;
  border-left-color: ${grey};
  overflow: hidden;
`

const toggle = {
  width: "1em",
  height: "1em",
  marginRight: 10,
  cursor: "pointer",
  verticalAlign: "middle",
}
