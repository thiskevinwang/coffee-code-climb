import React, { useEffect, useState } from "react"
import { useMutation, gql } from "@apollo/client"
import { graphql, navigate } from "gatsby"
import queryString from "query-string"
import { useDispatch } from "react-redux"

import { setCognito } from "_reduxState"
import SEO from "components/seo"
import { LoadingPage } from "components/LoadingPage"

const GATSBY_FACEBOOK_LOGIN_LINK = process.env.GATSBY_FACEBOOK_LOGIN_LINK!
const GATSBY_GOOGLE_LOGIN_LINK = process.env.GATSBY_GOOGLE_LOGIN_LINK!

const GET_TOKEN = gql`
  mutation GetToken($code: String!) {
    getToken(code: $code) {
      AccessToken
      IdToken
      RefreshToken
      ExpiresIn
      TokenType
    }
  }
`
interface GetTokenData {
  getToken: {
    AccessToken: string
    IdToken: string
    RefreshToken: string
    ExpiresIn: number
    TokenType: string
  }
}

interface GetTokenVars {
  code: string
}

const loader = (
  <>
    <SEO title="Redirecting..." />
    <LoadingPage />
  </>
)

const RedirectUri = ({ location }: { location: Location }) => {
  // `error_description` is generated two ways
  // 1. By Cognito
  // 2. By my own lambda code
  // -  `callback("LINK_SUCCESS")
  const [{ code, error_description, cognito_error }] = useState(() => {
    const { code, error_description, error: cognito_error } = queryString.parse(
      location.search
    )
    console.log(`%cRedirectUri`, `color:#f5a623; font-size:20px`)
    console.log("\tcode:", code)
    console.log("\terror:", cognito_error)
    console.log("\terror_description:", error_description)
    return { code, error_description, cognito_error }
  })

  const dispatch = useDispatch()

  /**
   * @warn Login with facebook button link, causes the native Cognito user's
   * `email_verified` to BECOME `false`, even if it was originally true...
   *
   * for "Already found an entry for username..." issue
   * @see https://stackoverflow.com/questions/47815161/cognito-auth-flow-fails-with-already-found-an-entry-for-username-facebook-10155
   */
  if (
    error_description?.includes?.("LINK_SUCCESS") ||
    error_description?.includes?.("Already found an entry for username")
  ) {
    if (error_description?.includes?.("facebook")) {
      console.log(`%c=> Facebook`, `color:lightblue; font-size:16px`)
      window.location.href = GATSBY_FACEBOOK_LOGIN_LINK
    }
    if (error_description?.includes?.("google")) {
      console.log(`%c=> Google`, `color:lightblue; font-size:16px`)
      window.location.href = GATSBY_GOOGLE_LOGIN_LINK
    }
    return loader
  }

  const [getToken] = useMutation<GetTokenData, GetTokenVars>(GET_TOKEN, {
    onCompleted: (data) => {
      console.log(`%cgetToken::success`, `color:#0070f3; font-size:16px`)
      const result = { AuthenticationResult: { ...data.getToken } }
      dispatch(setCognito(result, null))

      console.log(`redirecting to /app/profile`)
      navigate("/app/profile", {
        replace: true,
        state: { data: result, error: null },
      })
    },
    onError: (err) => {
      console.log(`%cgetToken::error`, `color:#e00; font-size:16px`)
      console.log(err)
      dispatch(setCognito(null, err))

      console.log(`redirecting to /auth/login`)
      navigate("/auth/login", {
        replace: true,
        state: { data: null, error: err },
      })
    },
  })

  useEffect(() => {
    if (!code && !error_description && !cognito_error) {
      console.log(
        `%cOops, something went wrong`,
        `color:yellow; font-size:16px`
      )
      navigate("/auth/login", {
        replace: true,
      })
    } else {
      const variables: GetTokenVars = {
        code: code as string,
      }
      getToken({
        variables,
      })
    }
    return () => {}
  }, [code, getToken])

  return loader
}

export default RedirectUri

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
