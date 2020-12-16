import React, { CSSProperties } from "react"
import { Link } from "gatsby"
import { useApolloClient } from "@apollo/client"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"

import { User } from "types"

interface Props {
  id?: string
}

const MapIdToUsername: React.ComponentType<Props> = ({ id }) => {
  const client = useApolloClient()

  const {
    preferred_username,
    name,
    given_name,
    family_name,
    avatar_url,
  } = (client?.cache?.data?.data?.[`User:${id}`] ?? {}) as User

  const UserTooltip = () => (
    <Box p="var(--geist-gap-half)">
      <Avatar src={avatar_url} />
      <Box flexDirection="row">
        <h3>{name}</h3>
        <b>{preferred_username ? `@${preferred_username}` : id}</b>
        <p></p>
      </Box>
    </Box>
  )
  return (
    <Tooltip arrow title={<UserTooltip />}>
      <Box display="flex" alignItems="center">
        <Link to={`/u/${id}`}>
          {preferred_username ||
            name ||
            (given_name && family_name ? `${given_name} ${family_name}` : id)}
        </Link>
      </Box>
    </Tooltip>
  )
}

interface MapIdToAvatarProps {
  id?: string
  style?: CSSProperties
}
export const MapIdToAvatar: React.ComponentType<MapIdToAvatarProps> = ({
  id,
  style = {},
}) => {
  const client = useApolloClient()

  const {
    preferred_username,
    name,
    given_name,
    family_name,
    avatar_url,
  } = (client?.cache?.data?.data?.[`User:${id}`] ?? {}) as User

  const UserTooltip = () => (
    <Box p="var(--geist-gap-half)">
      <Avatar src={avatar_url} />
      <Box flexDirection="row">
        <h3>{name}</h3>
        <b>{preferred_username ? `@${preferred_username}` : id}</b>
        <p></p>
      </Box>
    </Box>
  )
  return (
    <Tooltip arrow title={<UserTooltip />}>
      <Link to={`/u/${id}`}>
        <Avatar src={avatar_url} style={{ height: 28, width: 28, ...style }}>
          {
            (preferred_username ||
              name ||
              (given_name && family_name
                ? `${given_name} ${family_name}`
                : id))[0]
          }
        </Avatar>
      </Link>
    </Tooltip>
  )
}

/**
 * These components map a user uuid to their associated
 * user data.
 *
 * These rely on user data already being present in the
 * apollo InMemory cache.
 */
export const MapIdToUser = {
  Username: MapIdToUsername,
  Avatar: MapIdToAvatar,
}
