import React from "react"
import { Link } from "gatsby"

// import { makeStyles } from "@material-ui/styles"
import Drawer from "@material-ui/core/Drawer"
// import Button from "@material-ui/core/Button"
import Fab from "@material-ui/core/Fab"

import List from "@material-ui/core/List"
// import Divider from "@material-ui/core/Divider"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"

const useStyles = {
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}

export default function MobileDrawer({ buttonStyle }) {
  const classes = useStyles
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  const toggleDrawer = (side, open) => () => {
    setState({ ...state, [side]: open })
  }

  const sideList = (
    <div className={classes.list}>
      <List>
        {["All Tags"].map((text, index) => (
          <Link to="/tags" key={text} activeStyle={{ color: "red" }}>
            <ListItem button>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}

        <Link
          to="/attack-animation-simulator"
          activeStyle={{ color: "red", border: `1px solid black` }}
        >
          <ListItem button>
            <ListItemText primary={"Attack Animation Simulator ⚔️"} />
          </ListItem>
        </Link>
      </List>
      {/* <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  )

  // const fullList = (
  //   <div className={classes.fullList}>
  //     <List>
  //       {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
  //         <ListItem button key={text}>
  //           <ListItemIcon>
  //             {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
  //           </ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //     <List>
  //       {["All mail", "Trash", "Spam"].map((text, index) => (
  //         <ListItem button key={text}>
  //           <ListItemIcon>
  //             {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
  //           </ListItemIcon>
  //           <ListItemText primary={text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // )

  return (
    <div style={buttonStyle}>
      {/* <Button onClick={toggleDrawer("left", true)}>Navigate</Button> */}
      {/* <Button onClick={toggleDrawer("right", true)}>Open Right</Button> */}
      {/* <Button onClick={toggleDrawer("top", true)}>Open Top</Button> */}
      <Fab
        style={{ backgroundColor: "white" }}
        onClick={toggleDrawer("bottom", true)}
      >
        <div
          className={`button ${
            !state.bottom ? "button--show" : "button--hide"
          }`}
        >
          <div className={"caret caret-top"}>{caretSVG}</div>
          <div className={"caret caret-bottom"}>{caretSVG}</div>
        </div>
        <style>{`
            .button--hide .caret-top {
              transform: translateY(12.5px) rotate(180deg);
            }

            .button--hide .caret-bottom {
              transform: translateY(-12.5px);
            }

            .caret {
              transition: all 150ms ease-in-out;
            }
            
            .caret-top { 
              transform: rotate(180deg);
            }
          `}</style>
      </Fab>
      {/* <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer("left", false)}
          onKeyDown={toggleDrawer("left", false)}
        >
          {sideList}
        </div>
      </Drawer> */}
      {/* <Drawer
        anchor="top"
        open={state.top}
        onClose={toggleDrawer("top", false)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer("top", false)}
          onKeyDown={toggleDrawer("top", false)}
        >
          {fullList}
        </div>
      </Drawer> */}
      <Drawer
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
      {/* <Drawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer("right", false)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer("right", false)}
          onKeyDown={toggleDrawer("right", false)}
        >
          {sideList}
        </div>
      </Drawer> */}
    </div>
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
