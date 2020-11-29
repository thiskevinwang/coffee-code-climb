import React from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { Link, navigate, PageProps, graphql } from "gatsby"
import _ from "lodash"
import Box from "@material-ui/core/Box"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { LoadingPage } from "components/LoadingPage"
import { Field, SubmitButton } from "components/Form"
import { Button } from "components/Button"
import { Alert } from "components/Alert"
// Todo: extract Divider
import { Divider } from "components/Fieldset"

import { FacebookIcon, GoogleIcon } from "icons"
import { useVerifyTokenSet, isBrowser } from "utils"
import { useCognito } from "utils/Playground/useCognito"

const GATSBY_FACEBOOK_LOGIN_LINK = process.env.GATSBY_FACEBOOK_LOGIN_LINK!
const GATSBY_GOOGLE_LOGIN_LINK = process.env.GATSBY_GOOGLE_LOGIN_LINK!
const GATSBY_COGNITO_REDIRECT_URI = process.env.GATSBY_COGNITO_REDIRECT_URI!

type Values = {
  email: string
}

const loader = (
  <>
    <SEO title="Login" />
    <LoadingPage />
  </>
)
type LocationState = {
  isSuccess?: boolean
  isError?: boolean
  message?: string
}

const AuthLogin = ({ location }: PageProps<{}, {}, LocationState>) => {
  const { initiateAuthCustom } = useCognito()
  const { isLoggedIn } = useVerifyTokenSet()

  if (isBrowser()) {
    if (isLoggedIn === true) {
      navigate("/app")
      return loader
    }
    if (isLoggedIn === null) {
      return loader
    }
  }

  return (
    <LayoutManager location={location}>
      <SEO title="Login" />
      <Box display="flex" flexDirection="column" alignItems="center">
        <h1>Login</h1>

        <Formik<Values>
          initialValues={{ email: "" }}
          validateOnMount={false}
          validate={({ email }) => {
            const errors: FormikErrors<Values> = {}
            if (!email) {
              errors.email = "Required"
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
            ) {
              errors.email = "Invalid email address"
            }
            return errors
          }}
          onSubmit={async ({ email }, { setStatus, setFieldError }) => {
            try {
              await initiateAuthCustom(email)
              await navigate("/auth/verify")
            } catch (err) {
              // err.message => 'CreateAuthChallenge failed with error User not found.'
              if (err.message.includes("User not found")) {
                setStatus({ isError: true, message: "User not found" })
                setFieldError("email", " ")

                /* One-Click Flow? */
                // await signUpWithEmail(email, uuid())
                // await initiateAuthCustom(email)
                // await navigate("/auth/verify")
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
                {/* Display message successful redirect from /auth/signup */}
                {location.state?.isSuccess && (
                  <Box mb={3}>
                    <Alert
                      severity="success"
                      variant="standard"
                      style={{ width: "var(--geist-space-64x)" }}
                    >
                      <b>Success:</b>&nbsp;{location.state?.message}
                    </Alert>
                  </Box>
                )}
                {location.state?.isError && (
                  <Box mb={2}>
                    <Alert
                      severity="error"
                      variant="standard"
                      style={{ width: "var(--geist-space-64x)" }}
                    >
                      <b>Error:</b>&nbsp;{location.state?.message}
                    </Alert>
                  </Box>
                )}

                <p>Sign In with your social account</p>
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
                flexDirection="row"
                alignItems="center"
              >
                <Box flex={1}>
                  <Divider />
                </Box>
                <span
                  style={{
                    color: "var(--accents-4)",
                    padding: "0 var(--geist-gap)",
                    fontWeight: "bold",
                  }}
                >
                  OR
                </span>
                <Box flex={1}>
                  <Divider />
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center">
                <p>Request a one-time login code</p>
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

                {props.status?.message === "User not found" && (
                  <>
                    <Alert
                      severity="error"
                      style={{ width: "var(--geist-space-64x)" }}
                    >
                      <b>Error:</b> There is no account associated with this
                      email address. <Link to="/auth/signup">Sign up?</Link>
                    </Alert>
                  </>
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
