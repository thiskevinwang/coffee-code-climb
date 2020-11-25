import React from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { navigate, PageProps } from "gatsby"
import styled from "styled-components"
import { graphql } from "gatsby"
import Box from "@material-ui/core/Box"
import { useSelector } from "react-redux"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { Field, SubmitButton } from "components/Form"

import { useVerifyTokenSet, isBrowser } from "utils"
import { useCognito } from "utils/Playground/useCognito"
import { LoadingPage } from "components/LoadingPage"
import type { RootState } from "_reduxState"

const Error = styled.div`
  color: var(--geist-error);
`

const loader = (
  <>
    <SEO title="Verify" />
    <LoadingPage />
  </>
)
type Values = {
  code: string
}
const AuthVerify = ({ location }: PageProps) => {
  const { session, email } = useSelector((s: RootState) => ({
    session: s.cognito?.data?.Session,
    email: s.cognito?.data?.ChallengeParameters?.email,
  }))

  const { respondToAuthChallenge, errorMessage } = useCognito()

  const { isLoggedIn } = useVerifyTokenSet()
  if (isBrowser()) {
    if (isLoggedIn === true) {
      navigate("/app")
      return loader
    } else if (!session && !email) {
      navigate("/auth/login")
      return loader
    }
    if (isLoggedIn === null) {
      return loader
    }
  }

  return (
    <LayoutManager location={location}>
      <SEO title="Verify" />
      <Box display="flex" flexDirection="column" alignItems="center">
        <h1>Verify</h1>
        <p>Please check your email and enter the 6-digit verification code</p>
        <Formik
          initialValues={{ code: "" }}
          validateOnMount={false}
          validate={(values) => {
            const errors: FormikErrors<Values> = {}
            if (!values.code) {
              errors.code = "Required"
            } else if (!/^[0-9]{6}$/i.test(values.code)) {
              errors.code = "Must be 6 digits"
            }
            return errors
          }}
          onSubmit={async (values) => {
            try {
              await respondToAuthChallenge(email!, values.code, session!)
            } catch (err) {
              console.error("THIS IS ERROR", err)
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
                  id="code"
                  name="code"
                  type="code"
                  label="code"
                  placeholder="code"
                />
                <SubmitButton
                  type="submit"
                  disabled={!props.isValid || props.isSubmitting}
                >
                  Verify
                </SubmitButton>
                {errorMessage && <Error>{errorMessage}</Error>}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </LayoutManager>
  )
}

export default AuthVerify

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
