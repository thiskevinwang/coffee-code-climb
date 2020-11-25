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
import { FacebookIcon, GoogleIcon } from "icons"

import { useVerifyTokenSet } from "utils"
import { useCognito } from "utils/Playground/useCognito"

const GATSBY_FACEBOOK_LOGIN_LINK = process.env.GATSBY_FACEBOOK_LOGIN_LINK!
const GATSBY_GOOGLE_LOGIN_LINK = process.env.GATSBY_GOOGLE_LOGIN_LINK!
const GATSBY_COGNITO_REDIRECT_URI = process.env.GATSBY_COGNITO_REDIRECT_URI!

const Error = styled.div`
  color: var(--geist-error);
`

type Values = {
  email: string
}
const AuthLogin = ({ location }: PageProps) => {
  const { initiateAuthCustom } = useCognito()
  const { isLoggedIn } = useVerifyTokenSet()
  if (isLoggedIn === true) {
    navigate("/app")
    return (
      <>
        <SEO title="Login" />
        <LoadingPage />
      </>
    )
  }
  if (isLoggedIn === null) {
    return (
      <>
        <SEO title="Login" />
        <LoadingPage />
      </>
    )
  }

  return (
    <LayoutManager location={location}>
      <SEO title="Login" />
      <Box display="flex" flexDirection="column" alignItems="center">
        <h1>Login</h1>

        <Formik
          initialValues={{ email: "" }}
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
          onSubmit={async (values, helpers) => {
            try {
              // await initiateAuth(values.email, values.password)
              await initiateAuthCustom(values.email)
              await navigate("/auth/verify")
            } catch (err) {
              // console.log(Object.getOwnPropertyNames(err))
              // console.log(err.message, err.code)
              if (err.message.includes("User not found")) {
                helpers.setStatus("User not found")
              }
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
              <Box
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Button
                  type="button"
                  background="#4267B2"
                  color="#fff"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "var(--geist-space-medium)",
                    width: "var(--geist-space-64x)",
                  }}
                  onClick={() => {
                    props.setSubmitting(true)
                    window.location.href = GATSBY_FACEBOOK_LOGIN_LINK
                  }}
                  disabled={props.isSubmitting}
                >
                  <Box mr={2} display="flex" alignItems="center">
                    <FacebookIcon />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    width="100%"
                  >
                    Continue with Facebook
                  </Box>
                </Button>
              </Box>

              <Box
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Button
                  type="button"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "var(--geist-space-medium)",
                    width: "var(--geist-space-64x)",
                  }}
                  onClick={() => {
                    props.setSubmitting(true)
                    window.location.href = GATSBY_GOOGLE_LOGIN_LINK
                  }}
                  disabled={props.isSubmitting}
                >
                  <Box mr={2} display="flex" alignItems="center">
                    <GoogleIcon />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    width="100%"
                  >
                    Continue with Google
                  </Box>
                </Button>
              </Box>

              <Box
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <span>—or—</span>
              </Box>

              <Box>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  label="email"
                  placeholder="email"
                  style={{ width: "var(--geist-space-64x)" }}
                />
                <SubmitButton
                  type="submit"
                  disabled={!props.isValid || props.isSubmitting}
                >
                  Continue
                </SubmitButton>

                {props.status === "User not found" && (
                  <Error>
                    <b>Error:</b> There is no account associated with this email
                    address. <Link href="/auth/signup">Sign up?</Link>
                  </Error>
                )}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
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
