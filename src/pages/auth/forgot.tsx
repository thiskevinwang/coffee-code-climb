import React, { useState } from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import _ from "lodash"
import { graphql, Link } from "gatsby"
import { animated } from "react-spring"
import styled from "styled-components"
import { useMutation } from "@apollo/client"
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

type Values = {
  email: string
}

const AuthForgotPassword = ({ location }: { location: Location }) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [requestPasswordResetLink, { data, loading }] = useMutation(
    REQUEST_PASSWORD_RESET_LINK,
    {
      onCompleted: (data) => {
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
      <Formik
        initialValues={{ email: "", password: "" }}
        validateOnMount={false}
        validate={(values) => {
          const errors: FormikErrors<Values> = {}
          if (!values.email) {
            errors.email = "Required"
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address"
          }

          return errors
        }}
        onSubmit={async (values, actions) => {
          requestPasswordResetLink({ variables: values })
        }}
      >
        {(props: FormikProps<Values>) => (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              props.handleSubmit(e)
            }}
          >
            <Field
              id="email"
              name="email"
              type="email"
              label="email"
              placeholder="email"
            />
            {successMessage ? (
              <Success>{successMessage}</Success>
            ) : (
              <SubmitButton
                type="submit"
                disabled={!props.isValid || props.isSubmitting}
              >
                {loading ? <LoadingIndicator /> : "Submit"}
              </SubmitButton>
            )}

            {errorMessage && <Error>{errorMessage}</Error>}
          </form>
        )}
      </Formik>
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
