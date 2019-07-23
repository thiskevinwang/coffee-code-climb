import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { useSelector } from "react-redux"

import Drawer from "@material-ui/core/Drawer"
import Fab from "@material-ui/core/Fab"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"

import * as Colors from "consts/Colors"

// Overwrite MUI styles
// https://material-ui.com/api/drawer#css
const useStyles = makeStyles({
  paperAnchorBottom: {
    background: `none`,
    boxShadow: `none`,
  },
  margin: {
    margin: `30px`,
  },
  root: {
    width: `100vw`,
  },
})

const activeStyle = {
  color: "rebeccapurple",
}

const FabContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  transform: translate(-100%, -100%);
  z-index: 999999;

  .hide .caret-top {
    transform: translateY(12.5px) rotate(180deg);
  }

  .hide .caret-bottom {
    transform: translateY(-12.5px);
  }

  .caret {
    transition: all 200ms ease-in-out;
    color: ${props => (props.isDarkMode ? Colors.silverLight : Colors.black)};
  }

  .caret-top {
    transform: rotate(180deg);
  }
`

export default function ButtonAndDrawer() {
  const classes = useStyles()
  const [state, setState] = useState({
    bottom: false,
  })
  const isDarkMode = useSelector(state => state.isDarkMode)

  const toggleDrawer = (side, bool) => () => {
    bool
      ? // If the second arg is specified, use that,
        setState({ ...state, [side]: bool })
      : // Otherwise, 'toggle'
        setState({ ...state, [side]: !state[side] })
  }

  /**
   * In order to get some styling like margin: `60px`, the
   * classes[propertyName] needs to be added here to
   * props.className
   */
  const sideList = (
    <div className={classes.margin}>
      <List
        style={{
          background: isDarkMode ? Colors.black : Colors.silver,
          borderRadius: 10,
        }}
      >
        <Link to="/tags" activeStyle={activeStyle}>
          <ListItem button>
            <ListItemText primary={"All Tags"} />
          </ListItem>
        </Link>

        <Link to="/attack-animation-simulator" activeStyle={activeStyle}>
          <ListItem button>
            <ListItemText primary={"Attack Animation Simulator"} />
          </ListItem>
        </Link>

        <Link to="/filetree" activeStyle={activeStyle}>
          <ListItem button>
            <ListItemText primary={"File Tree"} />
          </ListItem>
        </Link>
      </List>
    </div>
  )

  return (
    <>
      <FabContainer isDarkMode={isDarkMode}>
        <Fab
          style={{
            background: isDarkMode ? Colors.blackLighter : Colors.silverLighter,
          }}
          onClick={toggleDrawer("bottom")}
        >
          <div className={`${state.bottom && "hide"}`}>
            <div className={"caret caret-top"}>{caretSVG}</div>
            <div className={"caret caret-bottom"}>{caretSVG}</div>
          </div>
        </Fab>
      </FabContainer>
      <Drawer
        classes={{ paperAnchorBottom: classes.paperAnchorBottom }}
        anchor="bottom"
        open={state.bottom}
        onClose={toggleDrawer("bottom", false)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer("bottom", false)}
          onKeyDown={toggleDrawer("bottom", false)}
        >
          {sideList}
        </div>
      </Drawer>
    </>
  )
}

const caretSVG = (
  <svg
    viewBox="0 0 926.23699 573.74994"
    version="1.1"
    x="0px"
    y="0px"
    width="15"
    height="15"
  >
    <g transform="translate(904.92214,-879.1482)">
      <path
        d="
m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
-55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
-174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
-174.68583 0.6895,0 26.281,25.03215 56.8701,
55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
-231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
-104.0616 -231.873,-231.248 z
"
        fill="currentColor"
      />
    </g>
  </svg>
)
