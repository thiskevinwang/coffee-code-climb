import React from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { Link, navigate, PageProps } from "gatsby"
import styled from "styled-components"
import _ from "lodash"
import { graphql } from "gatsby"
import Box from "@material-ui/core/Box"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { LoadingPage } from "components/LoadingPage"
import { Field, SubmitButton } from "components/Form"
import { Button } from "components/Button"

import { useVerifyTokenSet } from "utils"
import { useCognito } from "utils/Playground/useCognito"

const Error = styled.div`
  color: var(--geist-error);
`

type Values = {
  email: string
  password: string
}
const AuthSignup = ({ location }: PageProps) => {
  const { signUpWithEmail, errorMessage } = useCognito()
  const { isLoggedIn } = useVerifyTokenSet()

  if (isLoggedIn === true) {
    navigate("/app")
    return (
      <>
        <SEO title="Signup" />
        <LoadingPage />
      </>
    )
  }
  if (isLoggedIn === null) {
    return (
      <>
        <SEO title="Signup" />
        <LoadingPage />
      </>
    )
  }

  return (
    <LayoutManager location={location}>
      <SEO title="Signup" />
      <h1>Signup</h1>
      <Formik<Values>
        initialValues={{
          email: "",
          password: "",
        }}
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
          } else if (values.password.length < 8) {
            errors.password = "Must be 8 or more characters"
          }
          return errors
        }}
        onSubmit={async (values, helpers) => {
          try {
            await signUpWithEmail(values.email, values.password)
            navigate("/auth/login")
          } catch (err) {
            console.log("ERR!!!!", err)
            helpers.setStatus(err.toString())
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
              Signup
            </SubmitButton>
            {errorMessage && (
              <Error>
                <b>Error:</b>&nbsp;{errorMessage}&nbsp;{" "}
                <Link to="/auth/login">Login?</Link>
              </Error>
            )}
          </form>
        )}
      </Formik>
    </LayoutManager>
  )
}

export default AuthSignup

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
