import jwt, { JwtHeader, TokenExpiredError } from "jsonwebtoken"
import jwksClient, { JwksClient, SigningKeyNotFoundError } from "jwks-rsa"
import { promisify } from "util"
import ms from "ms"

import { useEffect, useState } from "react"

import { cognito } from "./Playground/AWS"
import { CognitoIdentityServiceProvider } from "aws-sdk"
import { useSelector, useDispatch } from "react-redux"
import { RootState, setCognito } from "_reduxState"

const JWKS_URI = process.env.GATSBY_JWKS_URI as string
const CLIENT_ID = process.env.GATSBY_COGNITO_CLIENT_ID as string

const client: JwksClient = jwksClient({
  jwksUri: JWKS_URI,
})

/**
 * A promisified version of `getKey` from the jsonwebtoken docs
 *
 * For `getKey`
 * - @see https://www.npmjs.com/package/jsonwebtoken
 *
 * For async version,
 * - @see https://github.com/auth0/node-jsonwebtoken/issues/111#issuecomment-592611392
 */
const getKeyAsync = async (header?: JwtHeader) => {
  const getPubKey = promisify(client.getSigningKey)
  const key = await getPubKey(header?.kid as string)
  const pubKey = key.getPublicKey()
  return pubKey
}

export interface AccessTokenPayload {
  /**
   * alias for username
   * @example '65a3f854-169b-48ab-b928-d5ddf747473c'
   */
  sub: string // '65a3f854-169b-48ab-b928-d5ddf747473c',
  /** @example 'b1f7f2cd-6783-429c-ba6a-7d067998cd9c' */
  event_id: string
  /** @example 'access' */
  token_use: string
  /** @example 'aws.cognito.signin.user.admin' */
  scope: string
  /** @example 1604461360 */
  auth_time: number
  /** @example 'https://cognito-idp.us-east-1.amazonaws.com/{pool_id}' */
  iss: string
  /** @example 1604461660 */
  exp: number
  /** @example 1604461360 */
  iat: number
  /** @example '0fb3f012-b2b4-4074-82c6-aae239f3b0ad' */
  jti: string
  /** @example '2u5s9kolnq57fe0on36rmp0ojq' */
  client_id: string
  /** @example '65a3f854-169b-48ab-b928-d5ddf747473c' */
  username: string
}

interface FederatedIdentity {
  dateCreated: string // number
  issuer: string | null
  primary: string // boolean
  providerName: string
  providerType: string
  userId: string // number
}
export interface IdTokenPayload {
  at_hash: string
  aud: string
  auth_time: number
  "cognito:username": string
  email: string
  email_verified: boolean
  exp: number
  iat: number
  identities: FederatedIdentity[]
  iss: string
  nonce: string
  sub: string // uuid
  token_use: string
  // potentially optional fields
  /** full name */
  name?: string
  /** last name */
  family_name?: string
  /**  name */
  given_name?: string
}

export const useVerifyTokenSet = () => {
  const dispatch = useDispatch()

  const cog = useSelector((state: RootState) => state.cognito)
  const accessToken = cog.data?.AuthenticationResult?.AccessToken
  const idToken = cog.data?.AuthenticationResult?.IdToken
  const refreshToken = cog.data?.AuthenticationResult?.RefreshToken

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [idTokenPayload, setIdTokenPayload] = useState<IdTokenPayload | null>(
    null
  )
  const [
    accessTokenPayload,
    setAccessTokenPayload,
  ] = useState<AccessTokenPayload | null>(null)

  useEffect(() => {
    const verifyAsync = async () => {
      if (!accessToken) {
        setIsLoggedIn(false)
        return
      }
      if (!idToken) {
        setIsLoggedIn(false)
        return
      }
      // for cognito
      let email: string
      let idTokenPayload: IdTokenPayload

      const decodedIdToken = jwt.decode(idToken, { complete: true })

      idTokenPayload = decodedIdToken?.payload
      email = idTokenPayload?.email
      const exp = idTokenPayload.exp
      const expDate = new Date(exp * 1000)
      console.log("IdToken expires")
      console.log("\tat:", expDate.toLocaleString())
      const nowMs = +new Date()
      console.log("\tin:", ms(exp * 1000 - nowMs))

      if (!email) {
        // idtoken is borked
        setIsLoggedIn(false)
        return
      }

      try {
        const decodedAccessToken = jwt.decode(accessToken, {
          complete: true,
        })
        setAccessTokenPayload(decodedAccessToken.payload)
        const tokenHeader: JwtHeader = decodedAccessToken?.header
        const pubKey = await getKeyAsync(tokenHeader)
        jwt.verify(accessToken, pubKey)

        const exp = decodedAccessToken?.payload?.exp
        const expDate = new Date(exp * 1000)
        console.log("AccessToken expires")
        console.log("\tat:", expDate.toLocaleString())
        const nowMs = +new Date()
        console.log("\tin:", ms(exp * 1000 - nowMs))

        setIdTokenPayload(idTokenPayload)
        setIsLoggedIn(true)
      } catch (err) {
        // Expect to be in this branch if the 2nd access token expires
        if (!refreshToken) {
          console.warn("Cannot refresh; Clearing Redux")
          dispatch(setCognito(null, null))
          setIdTokenPayload(null)
          setIsLoggedIn(false)
          return
        }
        console.warn(
          err instanceof TokenExpiredError ? "TokenExpiredError" : err
        )
        if (err instanceof TokenExpiredError) {
          console.warn("attempting to refresh")
          try {
            const params: CognitoIdentityServiceProvider.InitiateAuthRequest = {
              AuthFlow: "REFRESH_TOKEN",
              ClientId: CLIENT_ID,
              AuthParameters: {
                USERNAME: email,
                REFRESH_TOKEN: refreshToken,
              },
            }

            let data = await cognito.initiateAuth(params).promise()
            // copy over previous refresh token
            data.AuthenticationResult.RefreshToken = refreshToken

            console.warn("Refresh succeeded; Updating redux")
            dispatch(setCognito(data, null))

            const accessToken = data.AuthenticationResult?.AccessToken

            const decodedAccessToken = jwt.decode(accessToken, {
              complete: true,
            })
            const tokenHeader: JwtHeader = decodedAccessToken?.header
            const pubKey = await getKeyAsync(tokenHeader)
            jwt.verify(accessToken, pubKey) as AccessTokenPayload
            console.warn("verify refreshed token succeeded")

            setAccessTokenPayload(decodedAccessToken.payload)
            setIdTokenPayload(idTokenPayload)
            setIsLoggedIn(true)
            return
          } catch (err2) {
            setIdTokenPayload(null)
            setIsLoggedIn(false)
            return
          }
        }
        if (err instanceof SigningKeyNotFoundError) {
          setIdTokenPayload(null)
          setIsLoggedIn(false)
          return
        }
        throw new Error(`Something went wrong: ${err}`)
      }
    }
    verifyAsync()
  }, [accessToken, idToken, refreshToken])

  return { isLoggedIn, idTokenPayload, accessTokenPayload }
}
