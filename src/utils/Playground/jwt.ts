import jwksClient, { JwksClient, CertSigningKey, RsaSigningKey } from "jwks-rsa"
import jwt, { JwtHeader } from "jsonwebtoken"
import { promisify } from "util"

const client: JwksClient = jwksClient({
  jwksUri: process.env.GATSBY_JWKS_URI as string,
})

const getKey: jwt.GetPublicKeyOrSecret = function (header, callback) {
  client.getSigningKey(header.kid as string, (err, key) => {
    const signingKey =
      (key as CertSigningKey).publicKey || (key as RsaSigningKey).rsaPublicKey
    callback(null, signingKey)
  })
}

type Callback = (...args: any[]) => void
type MakeCbByName = (name?: string, cb?: Callback) => jwt.VerifyCallback
const makeCbByName: MakeCbByName = (name, cb) =>
  function (err, decoded) {
    console.group(name ?? "unknown")
    if (err) {
      console.error("err", err)
      cb?.(err)
    } else if (decoded) {
      console.log("decoded", decoded)
      cb?.(decoded)
    }
    console.groupEnd()
  }

export const verifyToken = (token: string, cb?: Callback) => {
  jwt.verify(token, getKey, makeCbByName("VERIFY:: ACCESS TOKEN", cb))
}

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

export const verifyTokenAsync = async (token: string) => {
  try {
    const tokenHeader: JwtHeader = (jwt.decode(token, {
      complete: true,
    }) as any)?.header
    const pubKey = await getKeyAsync(tokenHeader)
    const decoded = jwt.verify(token, pubKey)
    return decoded
  } catch (err) {
    return err
  }
}
