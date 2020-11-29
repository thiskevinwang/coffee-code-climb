import React from "react"
import { Formik, FormikProps, FormikErrors } from "formik"
import { navigate, PageProps, graphql } from "gatsby"
import Box from "@material-ui/core/Box"
import { useSelector } from "react-redux"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"
import { Field, SubmitButton } from "components/Form"
import { Alert } from "components/Alert"
import { LoadingPage } from "components/LoadingPage"

import { useVerifyTokenSet, isBrowser } from "utils"
import { useCognito } from "utils/Playground/useCognito"
import type { RootState } from "_reduxState"

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

  const { respondToAuthChallenge } = useCognito()

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

        <Box mb={3} style={{ width: "var(--geist-space-64x)" }}>
          <Alert variant="standard" severity="info">
            Please check your email and enter the 6-digit verification code here
          </Alert>
        </Box>

        <Formik<Values>
          initialValues={{ code: "" }}
          validateOnMount={false}
          validate={({ code }) => {
            const errors: FormikErrors<Values> = {}
            if (!code) {
              errors.code = "Required"
            } else if (!/^[0-9]{6}$/i.test(code)) {
              errors.code = "Must be 6 digits"
            }
            return errors
          }}
          onSubmit={async ({ code }, { setFieldError }) => {
            try {
              const result = await respondToAuthChallenge(
                email!,
                code,
                session!
              )
              if (result.Session) {
                // failed attempt 1-2
                // failed attempt 3 will be a 400
                setFieldError("code", "Incorrect code")
              }
            } catch (err) {
              // err.code => 'InvalidParameterException' | 'NotAuthorizedException'
              // err.message => 'Missing required parameter USERNAME' | 'Incorrect username or password.'
              if (
                err.code.includes("NotAuthorizedException") ||
                err.message.includes("Incorrect username or password")
              ) {
                await navigate("/auth/login", {
                  state: {
                    isError: true,
                    message:
                      "You failed to verify too many times. Please request another code and try again.",
                  },
                })
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
                display="flex"
                flexDirection="column"
                alignItems="center"
                style={{ width: "var(--geist-space-64x)" }}
              >
                <Field
                  id="code"
                  name="code"
                  type="code"
                  label="code"
                  placeholder="code"
                  autoComplete="off"
                  style={{ width: "var(--geist-space-64x)" }}
                />
                <SubmitButton
                  type="submit"
                  disabled={!props.isValid || props.isSubmitting}
                >
                  Verify
                </SubmitButton>
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

const START_CUSTOM_AUTH_200 = {
  ChallengeName: "CUSTOM_CHALLENGE",
  ChallengeParameters: {
    USERNAME: "e88f055c-94ba-49b4-bf61-70b384defa83",
    email: "kwang@capsule.com",
  },
  Session:
    "AYABeKa_3pL80y5GxaKslB1_yywAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo3NDU2MjM0Njc1NTU6a2V5L2IxNTVhZmNhLWJmMjktNGVlZC1hZmQ4LWE5ZTA5MzY1M2RiZQC4AQIBAHiLkiKzk0KWxEdNk0fwRzzj_Pea0omkehAYgJbz07nTZgF_vO8B5uRh7GyxSZHaVnUvAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMQjcnLs_ZTRHfotLtAgEQgDsaWrCvKKJ7slM9R8l5pQu53o0-WvPnOn3RKbl5ofDfmat8bLbKkrWVqspkh4Se7wZIiIFLIgheKajXBwIAAAAADAAAEAAAAAAAAAAAAAAAAAAhCL1jnFIe338clX3Zg3fL_____wAAAAEAAAAAAAAAAAAAAAEAAAEnzZ8QEV4QJWZYwk6-Hm5MKPdtKCErLzEL_cTYkMcGWvThoUHxleu3Nqz3v-W5_CVENvcOOIpg1bbQJln8usGtrUCO1uDN1wyKIsxDYRlcLhuZ7sM9uu_lcWXpcKVvGOz-1pIfgMEmbK_UL5Z91FyPfPLrz6SsSAyBftJ2koh1oXgZeENX3GWCwyOcpIZPS5HZpY6ntRVmpAmXHuRUp_lXwEHW-tPsXQDFHk1R2fXcmXVDJb8FH8KC-IhgwrrUk_hb2z3LgcEBUABRmHxY-SviJODHIHeT58vI4F_DpkcgSKqA3CqxiFZ4j4TaPrExVPSptEsa8DFcLvB0yuxACZwxQ-mcXs-TcBCJT8HcD2vHaJEwi551hiMdkb3dQdGLJxb3Ss3omOyJBYk955BNnEwF7qJcJ8XOZ6Y",
}

// On incorrect auth challenge, Cognito returns 200
const FIRST_FAIL_200 = {
  ChallengeName: "CUSTOM_CHALLENGE",
  ChallengeParameters: { email: "kwang@capsule.com" },
  Session:
    "AYABeGaSdoSRso6bpzEdm4njGDkAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo3NDU2MjM0Njc1NTU6a2V5L2IxNTVhZmNhLWJmMjktNGVlZC1hZmQ4LWE5ZTA5MzY1M2RiZQC4AQIBAHiLkiKzk0KWxEdNk0fwRzzj_Pea0omkehAYgJbz07nTZgFBGy7KHw-nkVwzsXbKXGmHAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMjIQgfk3GCS-3HYfdAgEQgDs-TlomxbouxmkCZHK0-1qt7RBjV7lPIIDDK2_z6mOHWmBppjE8QyQlt0pV8XkgepFfbbKjWWrmdIpK0AIAAAAADAAAEAAAAAAAAAAAAAAAAACx8_C3WspRnC3ewKrvI5CZ_____wAAAAEAAAAAAAAAAAAAAAEAAAFrDdW42mXubDNrFWw5DozRLt8Fiirvub6yGiku9z9DTky3s5JrArJvQO7jdxQIA8v4P7Na7pIsUWl7aR8QJ4meYzpDW4O3UBXSJ_eyMYGsgMS8VBYhdZewtHcDoFbOEzL4kvub23y21wI7Y8ShbJs45mLEKEKJFr5gKBVDqRg8dvE4hw1OyXqI9Wtlrf9xJjkzatdptp8P5h-N3mbLKHh91KJCYgyP-rJuI6owQb3q61Wx8cEX7dgrGuTW5pixpOx6paxXt2rJX8Z4EJfcT1e3vAyj24ElonTunKh0zAv0cK--YnbHmYD7tOzUXIeNyvLcUnMXELCDDgFW7AnouAcW1DR6RWxYB31moW3HaZUmz_WkvfJEz9DvOpTg-bp9mBHtknkYaWH-Wgr1Y0IRMdLcjmlQ76WlUntJdB1hxDNHVJgn-rUSpv8cIDprpchsLetJ1FvHvS-3QczngIDXucTfJjEEHWAcwEUFRZ87Hl12fdNEWBhBPO1I3u5fBQ",
}

const SECOND_FAIL_200 = {
  ChallengeName: "CUSTOM_CHALLENGE",
  ChallengeParameters: { email: "kwang@capsule.com" },
  Session:
    "AYABeA5O69wf5-UgEaneKqedkQAAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo3NDU2MjM0Njc1NTU6a2V5L2IxNTVhZmNhLWJmMjktNGVlZC1hZmQ4LWE5ZTA5MzY1M2RiZQC4AQIBAHiLkiKzk0KWxEdNk0fwRzzj_Pea0omkehAYgJbz07nTZgHScvhgBJ-AYD8-DpG46zbxAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMntkT2zDocbVgrLq9AgEQgDuaO3ZT0jEdNiJ-jMq_3llSoW25NSZ-W7tVNUMyZ8UKsUJ0hHI7AJrNtN6UwLcoCGtaytoeYLye65RK6gIAAAAADAAAEAAAAAAAAAAAAAAAAACODFqdH0LFW5gLF7Z3R3V5_____wAAAAEAAAAAAAAAAAAAAAEAAAGP719Jkp4gxdWyeDkxZK9A-zeKTzoAMsvIFVBc20HTU-Pzg4C5vWu7jU7wk6mmlantaDJaq3i3TI-QOCqwayRLaLeUSKpvDq2Dw466VofZkmfNst_8_KUyIkOZUMa_SkNIEuOEPjmu6eMPFZUSJVP9fDXcC9cy267BRY9usAOoIRNThUP06lX5a1SF8rCnzp4_iCn88W9O9P1BBbZeX2LS1vJY90-F2j2DdnhR5rI5pd5Q1AzfYWUZVQgq57AhY-6BtWNs_H4kj0om4hvoYQpLlhjnMogcCudkIxWmzLA-YitgSPJedEsSu9DqRRW198p-6nTzlYl7RWTSMAmN4t4IqjfZuieXgIf2hdcAy8qpk3a5v73zQwBSz2ZY98pF7dKb1lfXGFCyqT-15sceOX8sNoCaS4yM1x-XRcbkBMIU2vdrnLFWoj96vhalcCWo1XQY5w4MLw82jKwtSxhIW0Ucy-ewRmdpqMuvhFE0K_TyF4WRnXaJdDyadhCQSXSrWeqZRxp9REUHH4Tx2F3mh2DUZDxROmGDgEXvgc8EVhpNMQ",
}

const THIRD_FAIL_400 = {
  __type: "NotAuthorizedException",
  message: "Incorrect username or password.",
}
