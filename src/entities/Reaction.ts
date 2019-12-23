import { User } from "./User"
import { Comment } from "./Comment"

enum ReactionVariant {
  Like,
  Love,
  Haha,
  Wow,
  Sad,
  Angry,
  None,
}

export type Reaction = {
  id: string
  variant: ReactionVariant
  created: Date
  updated?: Date
  comment: Comment
  user: User
}
