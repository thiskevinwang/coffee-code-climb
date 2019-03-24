import React from "react"
import auth from "../utils/auth"
// import { getUser } from "../services/auth"

import Grid from "@material-ui/core/Grid"
import Avatar from "@material-ui/core/Avatar"

/* NOTE:
  {
    "sub": "twitter|79905213",
    "nickname": "Kevin Wang",
    "name": "Kevin Wang",
    "picture": "https://pbs.twimg.com/profile_images/1007418389088866304/9j_16LvA_normal.jpg",
    "updated_at": "2019-03-24T18:30:21.971Z"
  }

  {
  	"sub": "facebook|10161496967135006",
  	"given_name": "Kevin",
  	"family_name": "Wang",
  	"nickname": "Kevin Wang",
  	"name": "Kevin Wang",
  	"picture": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10161496967135006&height=50&width=50&ext=1556044365&hash=AeTY-nu-gEEVkbcR",
  	"updated_at": "2019-03-24T18:32:45.287Z",
  	"email_verified": true
  }
*/

const Profile = () => {
  const user = auth.getUser()
  return (
    <>
      <h1>Your profile</h1>

      <Avatar alt={user.name} src={user.picture} />

      <ul>
        <li>
          Name: <code>{auth.getUserName()}</code>
        </li>
        <li>
          Logged in with: <code>{user.sub.split("|")[0]}</code>
        </li>
      </ul>
    </>
  )
}

export default Profile
