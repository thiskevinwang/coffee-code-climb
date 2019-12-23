import React, { useState, useEffect, useReducer } from "react"
import { navigate, Link } from "gatsby"
import _ from "lodash"
import { graphql } from "gatsby"
import { animated } from "react-spring"
import styled from "styled-components"
import { useMutation } from "@apollo/react-hooks"
import { gql, ApolloError } from "apollo-boost"
import jwt from "jsonwebtoken"

import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "components/seo"
import { Field, SubmitButton } from "components/Form"

const Error = styled(animated.div)`
  border: 3px solid #ff7979;
  border-radius: 0.25rem;
  color: #ffaaaa;
  background: #f00;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        username
        password
        last_name
        first_name
      }
      token
    }
  }
`

type AuthState = {
  email: string
  password: string
}

const authReducer = (state: AuthState, action: any): AuthState => {
  return { ...state, ...action }
}

const AuthLogin = ({ location }: { location: Location }) => {
  /**
   * Form state
   */
  const [state, dispatch] = useReducer(authReducer, { email: "", password: "" })
  const assignFormProps = (fieldName: string) => {
    switch (fieldName) {
      case "submit":
        return {
          type: "submit",
          onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => {
            e.preventDefault()
            login()
          },
          disabled: !state.email || !state.password,
        }
      default:
        return {
          id: fieldName /* need this for <label for=""> */,
          name: fieldName,
          type: fieldName,
          placeholder: fieldName,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setErrorMessage("")
            dispatch({ [fieldName]: e.target.value })
          },
        }
    }
  }
  const [errorMessage, setErrorMessage] = useState("")

  const token = typeof window !== "undefined" && localStorage.getItem("token")
  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
      const userId = decoded?.userId
      if (userId) {
        navigate("/rds", {
          replace: true,
        })
      }
    })
  }, [])

  const [login, { data, loading }] = useMutation(LOGIN, {
    variables: { ...state },
    onCompleted: data => {
      const { token } = data.login
      localStorage.setItem("token", data.login.token)

      jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
        /**
         * @TODO Set an error, if the JWT isn't decoded correctly
         * - ex. app secret is incorrect, or something
         *
         */
        const userId = decoded?.userId
        if (userId) {
          navigate("/rds", {
            replace: true,
          })
        }
      })
    },
    onError: (error: ApolloError) => {
      setErrorMessage(error.message)
    },
  })

  return (
    <LayoutManager location={location}>
      <SEO title="Login" />
      <h1>Login</h1>
      <form>
        <Field {...assignFormProps("email")} />
        <Field {...assignFormProps("password")} />
        <SubmitButton {...assignFormProps("submit")}>
          {loading ? <LoadingIndicator /> : "Login"}
        </SubmitButton>
        {errorMessage && <Error>{errorMessage}</Error>}
      </form>
      <small>
        <Link to="/auth/forgot">Forgot your password?</Link>
      </small>
    </LayoutManager>
  )
}

export default AuthLogin

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

// TODO: move these out

function getListOfUniqueVariants(reactions: Reaction[]) {
  return reactions ? _.uniq(reactions.map(e => e.variant)) : []
}

function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return "just now"
  }

  if (elapsed < milliSecondsPerMinute) {
    return "less than 1 min ago"
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + " min ago"
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + " h ago"
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + " days ago"
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + " mo ago"
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + " years ago"
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime()
  const updated = new Date(date).getTime()
  return timeDifference(now, updated)
}
