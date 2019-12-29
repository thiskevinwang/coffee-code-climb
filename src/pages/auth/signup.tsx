import React, { useState, useEffect } from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
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

const SIGN_UP = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $username: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(
      email: $email
      password: $password
      username: $username
      firstName: $firstName
      lastName: $lastName
    ) {
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

type Values = {
  email: string
  password: string
  username: string
  firstName: string
  lastName: string
}
const AuthLogin = ({ location }: { location: Location }) => {
  const [errorMessage, setErrorMessage] = useState("")

  const token = typeof window !== "undefined" && localStorage.getItem("token")
  useEffect(() => {
    jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
      const userId = decoded?.userId
      if (userId) {
        navigate("/rds/", {
          replace: true,
        })
      }
    })
  }, [])

  const [signup, { data, loading }] = useMutation(SIGN_UP, {
    onCompleted: data => {
      const { token } = data.signup
      localStorage.setItem("token", data.signup.token)

      jwt.verify(token, process.env.GATSBY_APP_SECRET, (err, decoded) => {
        /**
         * @TODO Set an error, if the JWT isn't decoded correctly
         * - ex. app secret is incorrect, or something
         *
         */
        const userId = decoded?.userId
        if (userId) {
          navigate("/auth/login/", {
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
      <h1>Sign up</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
          username: "",
          firstName: "",
          lastName: "",
        }}
        validateOnMount={false}
        validate={values => {
          const errors: FormikErrors<Values> = {}

          if (!values.email) {
            errors.email = "Required"
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address"
          }

          if (!values.password) {
            errors.password = "Required"
          } else if (values.password.length < 8) {
            errors.password = "Must be 8 or more characters"
          }

          if (!values.username) {
            errors.username = "Required"
          } else if (!/^[a-z]/i.test(values.username)) {
            errors.username = "Must begin with a letter"
          } else if (/\s/.test(values.username)) {
            errors.username = "No whitespaces allowed"
          } else if (!/^[a-z][a-z0-9_-]*$/i.test(values.username)) {
            errors.username = "No special characters, except: _ -"
          }

          if (!values.firstName) errors.firstName = "Required"
          if (!values.lastName) errors.lastName = "Required"

          return errors
        }}
        onSubmit={async (values, actions) => {
          signup({ variables: values })
        }}
      >
        {(props: FormikProps<Values>) => (
          <form
            onSubmit={e => {
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
            <Field
              id="password"
              name="password"
              type="password"
              label="password"
              placeholder="password"
            />
            <Field
              id="username"
              name="username"
              type="text"
              label="username"
              placeholder="username"
            />
            <Field
              id="firstName"
              name="firstName"
              type="text"
              label="first name"
              placeholder="first name"
            />
            <Field
              id="lastName"
              name="lastName"
              type="text"
              label="last name"
              placeholder="last name"
            />
            <SubmitButton
              type="submit"
              disabled={!props.isValid || props.isSubmitting}
            >
              {loading ? <LoadingIndicator /> : "Submit"}
            </SubmitButton>
            {errorMessage && <Error>{errorMessage}</Error>}
          </form>
        )}
      </Formik>
      <small>
        <Link to="/auth/login">Login</Link>
        &nbsp;|&nbsp;
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
