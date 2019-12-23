import { Comment } from "./Comment"
import { Reaction } from "./Reaction"

export type User = {
  id: string
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  created: Date
  updated?: Date
  last_password_request?: Date
  verified_date?: Date
  banned: boolean
  avatar_url: string
  comments: Comment[]
  reactions: Reaction[]
}
