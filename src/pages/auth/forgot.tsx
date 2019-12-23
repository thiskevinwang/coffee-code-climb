import React, { useState, useReducer } from "react"
import _ from "lodash"
import { graphql, Link } from "gatsby"
import { animated } from "react-spring"
import styled from "styled-components"
import { useMutation } from "@apollo/react-hooks"
import { gql, ApolloError } from "apollo-boost"

import { LayoutManager } from "components/layoutManager"
import { LoadingIndicator } from "components/LoadingIndicator"
import SEO from "components/seo"

import { SubmitButton, Field } from "components/Form"

const Error = styled(animated.div)`
  border: 3px solid #ff7979;
  border-radius: 0.25rem;
  color: #ffaaaa;
  background: #f00;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`
const Success = styled(animated.div)`
  border: 3px solid #bfb;
  border-radius: 0.25rem;
  color: #bfb;
  background: #292;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`

const REQUEST_PASSWORD_RESET_LINK = gql`
  mutation RequestPasswordResetLink($email: String!) {
    requestPasswordResetLink(email: $email) {
      message
    }
  }
`

type AuthState = {
  email: string
}

const authReducer = (state: AuthState, action: any): AuthState => {
  return { ...state, ...action }
}

const AuthForgotPassword = ({ location }: { location: Location }) => {
  /**
   * Form state
   */
  const [state, dispatch] = useReducer(authReducer, { email: "" })
  const assignFormProps = (fieldName: string) => {
    switch (fieldName) {
      case "submit":
        return {
          type: "submit",
          onClick: async (e: React.SyntheticEvent<HTMLButtonElement>) => {
            e.preventDefault()
            await requestPasswordResetLink()
          },
          disabled: !state.email,
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
  const [successMessage, setSuccessMessage] = useState("")

  const [requestPasswordResetLink, { data, loading }] = useMutation(
    REQUEST_PASSWORD_RESET_LINK,
    {
      variables: { ...state },
      onCompleted: data => {
        const { message } = data.requestPasswordResetLink
        setSuccessMessage(message)
      },
      onError: (error: ApolloError) => {
        setErrorMessage(error.message)
      },
    }
  )

  return (
    <LayoutManager location={location}>
      <SEO title="Forgot Password" />
      <h1>Forgot Password</h1>
      <form>
        <Field {...assignFormProps("email")} />
        {successMessage ? (
          <Success>{successMessage}</Success>
        ) : (
          <SubmitButton {...assignFormProps("submit")}>
            {loading ? <LoadingIndicator /> : "Submit"}
          </SubmitButton>
        )}

        {errorMessage && <Error>{errorMessage}</Error>}
      </form>
      <small>
        <Link to="/auth/login">Login</Link>
      </small>
    </LayoutManager>
  )
}

export default AuthForgotPassword

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
