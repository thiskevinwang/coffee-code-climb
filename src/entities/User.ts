import { Comment } from "./Comment"
import { Reaction } from "./Reaction"

export interface User {
  id: string
  created: Date
  updated: Date
  deleted?: Date
  username?: string
  email: string
  first_name?: string
  last_name?: string
  cognito_sub: string
  avatar_url?: string
  comments?: Comment[]
  reactions?: Reaction[]
}
