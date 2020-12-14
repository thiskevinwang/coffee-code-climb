export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

/**
 * The typical response shape from AWS Cognito
 * - expect this from the /oauth2/token endpoint
 */
export type AuthResponse = {
  __typename?: "AuthResponse"
  IdToken: Scalars["String"]
  AccessToken: Scalars["String"]
  RefreshToken?: Maybe<Scalars["String"]>
  ExpiresIn: Scalars["Int"]
  TokenType: Scalars["String"]
}

/** Implemented by every 'row' in the Dynamo table */
export type Base = {
  id: Scalars["ID"]
  PK: Scalars["String"]
  SK?: Maybe<Scalars["String"]>
  created?: Maybe<Scalars["Date"]>
  updated?: Maybe<Scalars["Date"]>
}

export type Comment = Base & {
  __typename?: "Comment"
  id: Scalars["ID"]
  PK: Scalars["String"]
  SK: Scalars["String"]
  created: Scalars["Date"]
  updated?: Maybe<Scalars["Date"]>
  content: Scalars["String"]
  authorId: Scalars["String"]
  replyToId?: Maybe<Scalars["String"]>
  replies?: Maybe<Array<Maybe<Comment>>>
}

export type CommentReaction = Base & {
  __typename?: "CommentReaction"
  id: Scalars["ID"]
  PK: Scalars["String"]
  SK: Scalars["String"]
  created: Scalars["Date"]
  updated?: Maybe<Scalars["Date"]>
  reaction: Scalars["String"]
}

export type CreateCommentInput = {
  content: Scalars["String"]
  discussionId: Scalars["String"]
  /** The id of another comment */
  authorId: Scalars["String"]
  replyToId?: Maybe<Scalars["String"]>
}

export type CreateDiscussionInput = {
  title: Scalars["String"]
  content: Scalars["String"]
  authorId: Scalars["String"]
}

export type Discussion = Base & {
  __typename?: "Discussion"
  id: Scalars["ID"]
  PK: Scalars["String"]
  SK: Scalars["String"]
  created: Scalars["Date"]
  updated?: Maybe<Scalars["Date"]>
  title: Scalars["String"]
  content: Scalars["String"]
  authorId: Scalars["String"]
  comments?: Maybe<Array<Maybe<Comment>>>
}

export type FederatedIdentity = {
  __typename?: "FederatedIdentity"
  dateCreated?: Maybe<Scalars["String"]>
  issuer?: Maybe<Scalars["String"]>
  primary?: Maybe<Scalars["String"]>
  providerName?: Maybe<Scalars["String"]>
  providerType?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
}

export type FederatedIdentityInput = {
  dateCreated?: Maybe<Scalars["String"]>
  issuer?: Maybe<Scalars["String"]>
  primary?: Maybe<Scalars["String"]>
  providerName?: Maybe<Scalars["String"]>
  providerType?: Maybe<Scalars["String"]>
  userId?: Maybe<Scalars["String"]>
}

export type GetDiscussionsKey = {
  __typename?: "GetDiscussionsKey"
  PK?: Maybe<Scalars["String"]>
  SK?: Maybe<Scalars["String"]>
  created?: Maybe<Scalars["Date"]>
}

export type GetDiscussionsQueryResult = {
  __typename?: "GetDiscussionsQueryResult"
  items?: Maybe<Array<Maybe<Discussion>>>
  lastEvaluatedKey?: Maybe<GetDiscussionsKey>
}

export type LastEvaluatedKey = {
  PK?: Maybe<Scalars["String"]>
  SK?: Maybe<Scalars["String"]>
  created?: Maybe<Scalars["Date"]>
}

export type Mutation = {
  __typename?: "Mutation"
  /** 🔒 This field requires you to be authenticated */
  s3GetSignedPutObjectUrl: S3Payload
  createDiscussion?: Maybe<Discussion>
  createComment?: Maybe<Comment>
  /** Trade a code—appended by the Cognito Hosted UI—for Cognito Tokens */
  getToken?: Maybe<AuthResponse>
  /** 🔒 This field requires you to be authenticated */
  updateUsername: User
  /** 🔒 This field requires you to be authenticated */
  updateAvatarUrl: User
}

export type MutationS3GetSignedPutObjectUrlArgs = {
  fileName: Scalars["String"]
  fileType: Scalars["String"]
}

export type MutationCreateDiscussionArgs = {
  input: CreateDiscussionInput
}

export type MutationCreateCommentArgs = {
  input: CreateCommentInput
}

export type MutationGetTokenArgs = {
  code: Scalars["String"]
}

export type MutationUpdateUsernameArgs = {
  id: Scalars["ID"]
  username: Scalars["String"]
}

export type MutationUpdateAvatarUrlArgs = {
  id: Scalars["ID"]
  avatarUrl: Scalars["String"]
}

export type Query = {
  __typename?: "Query"
  getDiscussions?: Maybe<GetDiscussionsQueryResult>
  getDiscussionById?: Maybe<Discussion>
  /** 🔒 This field requires you to be authenticated */
  getOrCreateUser: User
  /** 🔒 This field requires you to be authenticated */
  getUsers?: Maybe<Array<Maybe<User>>>
}

export type QueryGetDiscussionsArgs = {
  lastEvaluatedKey?: Maybe<LastEvaluatedKey>
}

export type QueryGetDiscussionByIdArgs = {
  id: Scalars["ID"]
}

export type QueryGetOrCreateUserArgs = {
  userInput: UserInput
}

export type QueryGetUsersArgs = {
  limit?: Maybe<Scalars["Int"]>
}

export type S3Payload = {
  __typename?: "S3Payload"
  /**
   * #### Example
   * https://<bucket-name>.s3.amazonaws.com/<somefile.png>
   *
   * ?AWSAccessKeyId=...
   *
   * &Content-Type=jpg
   *
   * &Expires=1576639181
   *
   * &Signature=somehash
   *
   * &x-amz-acl=public-read
   */
  signedPutObjectUrl: Scalars["String"]
  /**
   * #### Example
   * https://<bucket-name>.s3.amazonaws.com/<somefile.png>
   */
  objectUrl: Scalars["String"]
}

export type User = Base & {
  __typename?: "User"
  id: Scalars["ID"]
  PK: Scalars["String"]
  SK?: Maybe<Scalars["String"]>
  created: Scalars["Date"]
  updated?: Maybe<Scalars["Date"]>
  /** This maps to a cognito idTokenPayload's `cognito:username` */
  cognitoUsername?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
  email_verified?: Maybe<Scalars["Boolean"]>
  identities?: Maybe<Array<Maybe<FederatedIdentity>>>
  sub?: Maybe<Scalars["String"]>
  name?: Maybe<Scalars["String"]>
  family_name?: Maybe<Scalars["String"]>
  given_name?: Maybe<Scalars["String"]>
  preferred_username?: Maybe<Scalars["String"]>
  avatar_url?: Maybe<Scalars["String"]>
}

export type UserInput = {
  cognitoUsername?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
  email_verified?: Maybe<Scalars["Boolean"]>
  identities?: Maybe<Array<Maybe<FederatedIdentityInput>>>
  sub?: Maybe<Scalars["String"]>
  name?: Maybe<Scalars["String"]>
  family_name?: Maybe<Scalars["String"]>
  given_name?: Maybe<Scalars["String"]>
  preferred_username?: Maybe<Scalars["String"]>
}
