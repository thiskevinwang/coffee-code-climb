import React, { useState, useEffect, useReducer } from "react"
import { navigate } from "gatsby"
import moment from "moment"
import _ from "lodash"
import { graphql } from "gatsby"
import { useSpring, animated } from "react-spring"
import styled from "styled-components"
import { useMediaQuery } from "@material-ui/core"
import { useMutation, useApolloClient } from "@apollo/react-hooks"
import { gql, ApolloError } from "apollo-boost"
import jwt from "jsonwebtoken"

import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "components/seo"
import { Button } from "components/Button"
import { useIO } from "hooks/useIO"

const Field = styled(animated.div)`
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  margin-bottom: 2rem;
  position: relative;

  > input {
    border: 1px solid lightgray;
    border-radius: 0.25rem;
    padding-left: 0.2rem;
  }

  > input::placeholder {
    transition: opacity 200ms ease-in-out;
    will-change: opacity;
  }
  > input:focus::placeholder {
    opacity: 0;
  }

  > input:focus + label,
  > input:not(:placeholder-shown) + label {
    transform: translateY(-2rem) scale(0.8);
    opacity: 1;
  }

  > label {
    opacity: 0;
    transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
    will-change: opacity transform;
    position: absolute;
    left: 2px;
    top: 2px;
  }
`
// const Button = styled(animated.button)`
//   border: 1px solid lightgray;
//   border-radius: 0.25rem;
//   width: 10rem;
//   margin-bottom: 2rem;
// `
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
      <SEO title="RDS" />
      <h1>Login</h1>
      <form>
        <Field>
          <input {...assignFormProps("email")} />
          <label for={"email"}>email</label>
        </Field>
        <Field>
          <input {...assignFormProps("password")} />
          <label for={"password"}>password</label>
        </Field>
        <Button widthRem={10} {...assignFormProps("submit")}>
          {loading ? <LoadingIndicator /> : "Login"}
        </Button>
        {errorMessage && <Error>{errorMessage}</Error>}
      </form>
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
