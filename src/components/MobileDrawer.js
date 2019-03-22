import React from "react"
import { Link } from "gatsby"

// import { makeStyles } from "@material-ui/styles"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import Fab from "@material-ui/core/Fab"

import List from "@material-ui/core/List"
import Divider from "@material-ui/core/Divider"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Bookmarks from "@material-ui/icons/Bookmarks"
import UnfoldMore from "@material-ui/icons/UnfoldMore"
import UnfoldLess from "@material-ui/icons/UnfoldLess"

const useStyles = {
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}

export default function MobileDrawer({ style }) {
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
          <Link to="/tags">
            <ListItem button key={text}>
              <ListItemIcon>
                <Bookmarks />
              </ListItemIcon>

              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
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

  const fullList = (
    <div className={classes.fullList}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <div style={style}>
      {/* <Button onClick={toggleDrawer("left", true)}>Navigate</Button> */}
      {/* <Button onClick={toggleDrawer("right", true)}>Open Right</Button> */}
      {/* <Button onClick={toggleDrawer("top", true)}>Open Top</Button> */}
      <Fab onClick={toggleDrawer("bottom", true)}>
        {!state.bottom ? <UnfoldMore /> : <UnfoldLess />}
      </Fab>
      <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer("left", false)}
          onKeyDown={toggleDrawer("left", false)}
        >
          {sideList}
        </div>
      </Drawer>
      <Drawer
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
      </Drawer>
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
