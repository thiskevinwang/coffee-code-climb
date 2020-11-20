import React, { useState, useEffect } from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { navigate, Link } from "gatsby"
import qs from "query-string"
import _ from "lodash"
import { graphql } from "gatsby"
import { animated } from "react-spring"
import styled from "styled-components"
import { gql, ApolloError, useMutation } from "@apollo/client"
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

const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!) {
    resetPassword(password: $password) {
      id
    }
  }
`

type Values = {
  password: string
}

function usePasswordResetLink(
  location: Location
): { token?: string; error?: string } {
  const { token } = qs.parse(location.search)
  const [error, setError] = useState("")
  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
      if (err) {
        console.error(err)
        setError(err)
      }
    })
  }, [])

  return { token, error }
}

const AuthResetPassword = ({ location }: { location: Location }) => {
  const { token, error } = usePasswordResetLink(location)
  console.log({ token, error })

  const [errorMessage, setErrorMessage] = useState("")

  const [resetPassword, { data, loading }] = useMutation(RESET_PASSWORD, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    onCompleted: (data) => {
      const { id } = data.resetPassword

      if (id) {
        navigate("/auth/login/", {
          replace: true,
        })
      }
    },
    onError: (error: ApolloError) => {
      setErrorMessage(error.message)
    },
  })

  return (
    <LayoutManager location={location}>
      <SEO title="Reset Password" />
      <h1>Reset Password</h1>
      {error?.name === "TokenExpiredError" ? (
        <>
          <p>
            Your link has expired. Click <Link to={"/auth/forgot"}>here</Link>{" "}
            to request a new one.
          </p>
        </>
      ) : (
        <Formik
          initialValues={{ password: "" }}
          validateOnMount={false}
          validate={(values) => {
            const errors: FormikErrors<Values> = {}
            if (!values.password) {
              errors.password = "Required"
            }
            return errors
          }}
          onSubmit={async (values, actions) => {
            resetPassword({ variables: values })
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
                id="password"
                name="password"
                type="password"
                label="password"
                placeholder="password"
              />
              <SubmitButton type="submit">
                {loading ? <LoadingIndicator /> : "Reset"}
              </SubmitButton>
              {errorMessage && <Error>{errorMessage}</Error>}
            </form>
          )}
        </Formik>
      )}
    </LayoutManager>
  )
}

export default AuthResetPassword

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
