import React from "react"
import { useTrail, animated } from "react-spring"

const PATHS = [
  ({ fillOpacity }) => (
    <animated.path
      fill="#FFD300"
      fillOpacity={fillOpacity}
      d="M19.783 20.217L14.52 25.48V14.52H5.48A5.48 5.48 0 0 0 0 19.998v.005a5.48 5.48 0 0 0 5.48 5.48h9.037l5.263-5.266z"
    />
  ),
  ({ fillOpacity }) => (
    <animated.path
      fill="#99BFBC"
      fillOpacity={fillOpacity}
      d="M19.783 20.217l5.698-5.698v10.96h9.04a5.48 5.48 0 1 0 0-10.96H25.49l-5.7 5.69z"
    />
  ),
  ({ fillOpacity }) => (
    <animated.path
      fill="#0F3C6C"
      fillOpacity={fillOpacity}
      d="M25.48 34.52V14.518l-5.697 5.697-5.264 5.264v9.032a5.48 5.48 0 1 0 10.96 0z"
    />
  ),
  ({ fillOpacity }) => (
    <animated.path
      fill="#EF4931"
      fillOpacity={fillOpacity}
      d="M19.783 20.217l5.698-5.698V5.48a5.48 5.48 0 0 0-10.96 0v20.002l5.27-5.263z"
    />
  ),
]

const CapsuleSvg = () => {
  const [trail] = useTrail(PATHS.length, () => ({
    from: { opacity: 0 },
    to: async (next) => {
      while (1) {
        await next({ opacity: 1 })
        await next({ opacity: 0.2 })
      }
    },
  }))
  return (
    <animated.svg
      baseProfile="tiny"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
    >
      <animated.path
        fill="none"
        d="M117.127 16.46c0-1.62-1.073-2.588-2.872-2.588h-2.95v5.126h2.95c1.798 0 2.872-.948 2.872-2.537zM91.54 14.99l-2.393 6.428h4.788z"
      />
      {trail.map(({ opacity }, i) => {
        const Path = PATHS[i]
        return <Path fillOpacity={opacity} key={i} />
      })}
    </animated.svg>
  )
}

export default CapsuleSvg
