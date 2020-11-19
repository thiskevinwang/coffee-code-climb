import React, { useEffect } from "react"
import { useMutation, gql } from "@apollo/client"
import { graphql, navigate } from "gatsby"
import queryString from "query-string"
import { useDispatch } from "react-redux"

import { setCognito } from "_reduxState"
import SEO from "components/seo"
import { LoadingPage } from "components/LoadingPage"

const GATSBY_FACEBOOK_LOGIN_LINK = process.env.GATSBY_FACEBOOK_LOGIN_LINK

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

const RedirectUri = ({ location }: { location: Location }) => {
  const dispatch = useDispatch()

  // `error_description` is generated two ways
  // 1. By Cognito
  // 2. By my own lambda code
  // -  `callback("LINK_SUCCESS")
  const { code, error_description, error: cognito_error } = queryString.parse(
    location.search
  )
  console.log("error:", cognito_error)
  console.log("error_description;", error_description)

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
    window.location.href = GATSBY_FACEBOOK_LOGIN_LINK
  }

  const [getToken] = useMutation<GetTokenData, GetTokenVars>(GET_TOKEN, {
    onCompleted: (data) => {
      const result = { AuthenticationResult: { ...data.getToken } }
      dispatch(setCognito(result, null))
      navigate("/app/profile", {
        replace: true,
        state: { data: result, error: null },
      })
    },
    onError: (err) => {
      dispatch(setCognito(null, err))
      navigate("/auth/login", {
        replace: true,
        state: { data: null, error: err },
      })
    },
  })

  /**
   * @Warn this side effect will 'consume' the `code`
   * query param that is appended by Cognito's Hosted
   * UI redirect, and exchange it for Cognito Access, Id
   * and Refresh Tokens.
   */
  useEffect(() => {
    if (!code) {
      navigate("/auth/login", {
        replace: true,
        state: {
          data: null,
          error: { code, error_description, cognito_error },
        },
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

  return (
    <>
      <SEO title="Redirecting..." />
      <LoadingPage />
    </>
  )
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
