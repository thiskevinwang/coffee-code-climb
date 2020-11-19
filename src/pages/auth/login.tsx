import React from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { navigate, PageProps } from "gatsby"
import styled from "styled-components"
import _ from "lodash"
import { graphql } from "gatsby"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { Field, SubmitButton } from "components/Form"
import { Button } from "components/Button"
import { FacebookIcon } from "icons"

import { useVerifyTokenSet } from "utils"
import { useCognito } from "utils/Playground/useCognito"

const GATSBY_FACEBOOK_LOGIN_LINK = process.env.GATSBY_FACEBOOK_LOGIN_LINK

const GATSBY_COGNITO_REDIRECT_URI = process.env.GATSBY_COGNITO_REDIRECT_URI

const Error = styled.p`
  border: 3px solid #ff7979;
  border-radius: 0.25rem;
  color: #ffaaaa;
  background: #f00;
  max-width: 15rem;
  padding: 0.5rem 1rem;
  font-weight: 400;
`

type Values = {
  email: string
  password: string
}
const AuthLogin = ({ location }: PageProps) => {
  const { initiateAuth, errorMessage } = useCognito()
  const { isLoggedIn } = useVerifyTokenSet()
  if (isLoggedIn === true) {
    navigate("/app")
  }
  if (isLoggedIn === null) {
    return (
      <LayoutManager location={location}>
        <SEO title="Login" />
        ...
      </LayoutManager>
    )
  }

  return (
    <LayoutManager location={location}>
      <SEO title="Login" />
      <h1>Login</h1>
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
          if (!values.password) {
            errors.password = "Required"
          }
          return errors
        }}
        onSubmit={async (values) => {
          try {
            await initiateAuth(values.email, values.password)
          } catch (err) {
            console.log("THIS IS ERROR", err)
          }
        }}
      >
        {(props: FormikProps<Values>) => (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              props.handleSubmit(e)
            }}
          >
            {errorMessage && <Error>{errorMessage}</Error>}
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
            <SubmitButton
              type="submit"
              disabled={!props.isValid || props.isSubmitting}
            >
              Login
            </SubmitButton>
          </form>
        )}
      </Formik>
      <Button
        onClick={() => {
          window.location.href = GATSBY_COGNITO_REDIRECT_URI
        }}
      >
        Sign Up
      </Button>
      <span>&nbsp;— OR —&nbsp;</span>

      <br />
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        onClick={() => {
          window.location.href = GATSBY_FACEBOOK_LOGIN_LINK
        }}
      >
        <div>Login with Facebook</div> <FacebookIcon />
      </Button>
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
