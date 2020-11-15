import React, { useEffect } from "react"
import { useMutation, gql } from "@apollo/client"
import { graphql, navigate } from "gatsby"
import { Skeleton } from "@material-ui/lab"
import queryString from "query-string"
import { useDispatch } from "react-redux"

import { setCognito } from "_reduxState"
import SEO from "components/seo"
import { LayoutManager } from "components/layoutManager"

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
  const { code, error_description, error: cognito_error } = queryString.parse(
    location.search
  )
  const [getToken, { data, error }] = useMutation<GetTokenData, GetTokenVars>(
    GET_TOKEN,
    {
      onCompleted: (data) => {
        const result = { AuthenticationResult: { ...data.getToken } }
        dispatch(setCognito(result, null))
        navigate("/app/profile", {
          replace: true,
          state: { data: result, error: null },
        })
      },
      onError: (err) => {
        const result = {}
        dispatch(setCognito(null, err))
        navigate("/auth/login", {
          replace: true,
          state: { data: null, error: err },
        })
      },
    }
  )

  /**
   * @Warn this side effect will 'consume' the `code`
   * query param that is appended by Cognito's Hosted
   * UI redirect, and exchange it for Cognito Access, Id
   * and Refresh Tokens.
   */
  useEffect(() => {
    console.log("code", code)
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
    <LayoutManager location={location}>
      <SEO title="Redirecting..." />
      <h3>{code}</h3>
      <h3>{cognito_error}</h3>
      <h4>{error_description}</h4>

      {!data && !error && (
        <>
          <h1>Redirecting...</h1>
          <Loaders />
        </>
      )}

      {error && (
        <>
          <h2>ERROR</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </>
      )}

      {data && (
        <>
          <h2>Data</h2>
          <pre>{data.getToken.AccessToken}</pre>
          <pre>{data.getToken.IdToken}</pre>
          <pre>{data.getToken.RefreshToken}</pre>
        </>
      )}
    </LayoutManager>
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

const Loaders = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Skeleton
          animation="wave"
          variant={"circle"}
          style={{ marginRight: "20px", width: "50px", height: "50px" }}
        />
        <Skeleton animation="wave" height={"50px"} width={"60%"} />
      </div>

      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </>
  )
}
