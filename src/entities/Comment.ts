import { User } from "./User"
import { Reaction } from "./Reaction"

export type Comment = {
  id: string
  body: string
  url: string
  created: Date
  updated?: Date
  deleted?: Date
  user: User
  reactions: Reaction[]
}
