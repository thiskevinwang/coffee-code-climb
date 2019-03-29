import * as React from "react"

const MESSAGES: Array<string> = [
  "Sunday already?!",
  "Ugh, Monday",
  "Tuesdays... meh",
  "Humpday is here",
  "The week is almost over!",
  "FRIDAY!!! 🎉",
  "How's your weekend going?",
]

export interface HelloProps {
  date: Date
}

interface HelloState {
  isHovered: boolean
}

// 'HelloProps' describes the shape of props.
export class Hello extends React.Component<HelloProps, HelloState> {
  state = {
    isHovered: false,
  }

  _handleOnClick = (): void => {
    alert(`This message is my first TypeScript component!`)
  }

  render() {
    let { date }: { date: Date } = this.props
    let { isHovered } = this.state
    return (
      <span
        onClick={this._handleOnClick}
        onMouseEnter={() => {
          this.setState({ isHovered: !isHovered })
        }}
        onMouseLeave={() => {
          this.setState({ isHovered: !isHovered })
        }}
        style={{
          opacity: `${this.state.isHovered ? 0.5 : 1}`,
          transition: `opacity 322ms ease-in-out`,
        }}
      >
        <>{MESSAGES[date.getDay()]}</>
      </span>
    )
  }
}
