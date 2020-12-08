import React from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { Link, navigate, PageProps, graphql } from "gatsby"
import _ from "lodash"
import { v4 as uuid } from "uuid"
import Box from "@material-ui/core/Box"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { LoadingPage } from "components/LoadingPage"
import { Field, SubmitButton } from "components/Form"
import { Alert } from "components/Alert"

import { useVerifyTokenSet, isBrowser } from "utils"
import { useCognito } from "utils/Playground/useCognito"

const loader = (
  <>
    <SEO title="Signup" />
    <LoadingPage />
  </>
)

type Values = {
  email: string
}
const AuthSignup = ({ location }: PageProps) => {
  const { signUpWithEmail } = useCognito()
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
      <SEO title="Signup" />
      <Box display="flex" flexDirection="column" alignItems="center">
        <h1>Signup</h1>
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
              await signUpWithEmail(email, uuid())
              await navigate("/auth/login", {
                state: {
                  isSuccess: true,
                  message:
                    "Your account was created! Request a login code to verify your email.",
                },
              })
            } catch (err) {
              setStatus({ isError: true, message: err.message })
              setFieldError("email", " ")
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
              <Box display="flex" flexDirection="column" alignItems="center">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  label="email"
                  placeholder="email"
                  style={{ width: "var(--geist-space-64x)" }}
                  disabled={props.isSubmitting || props.status?.isSuccess}
                />
              </Box>

              <Box display="flex" flexDirection="column" alignItems="center">
                <SubmitButton
                  style={{ marginBottom: "var(--geist-gap)" }}
                  type="submit"
                  disabled={
                    !props.isValid ||
                    props.isSubmitting ||
                    props.status?.isSuccess
                  }
                >
                  Signup
                </SubmitButton>
                {props.status?.isError && (
                  <Alert
                    severity="error"
                    style={{ width: "var(--geist-space-64x)" }}
                  >
                    <b>Error:</b>&nbsp;{props.status?.message}&nbsp;
                    <Link to="/auth/login">Login?</Link>
                  </Alert>
                )}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
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
