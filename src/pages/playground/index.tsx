import React, { useState, useReducer } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"

import { InitiateAuthResponse } from "aws-sdk/clients/cognitoidentityserviceprovider"

import SEO from "components/seo"
import { LayoutManager } from "components/layoutManager"

import { useCognito } from "utils/Playground/useCognito"

const Styles = styled.div`
  width: 100%;

  button,
  input,
  pre,
  label {
    font-size: 12px;
    margin-right: 5px;
  }
  pre {
    cursor: copy;
    background-color: var(--blockquote-background);
    text-overflow: ellipsis;
    overflow: hidden;
  }
  fieldset {
    padding: 10px;
    min-width: 0;
  }
  legend {
    color: var(--text);
  }
`

enum FormNames {
  CODE = "code",
  EMAIL = "email",
  PASSWORD = "password",
}

const initialState = {
  [FormNames.CODE]: "",
  [FormNames.EMAIL]: "",
  [FormNames.PASSWORD]: "",
}
type Action = {
  name: FormNames
  value: string
}
function reducer(state: typeof initialState, action: Action) {
  return { ...state, [action.name]: action.value }
}

const Playground = ({ location }: { location: Location }) => {
  const cognito = useCognito()
  const [{ code, email, password }, dispatch] = useReducer(
    reducer,
    initialState
  )
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name)
    dispatch({
      name: e.target.name as FormNames,
      value: e.target.value,
    })
  }

  const [accessToken, setAccessToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")
  const [idToken, setIdToken] = useState("")

  const getCognitoFromLocalStorage = () => {
    const cognitoResponse = JSON.parse(
      localStorage.getItem("cognito") ?? "{}"
    ) as InitiateAuthResponse
    setAccessToken(
      cognitoResponse?.AuthenticationResult?.AccessToken ??
        "no access token found"
    )
    setRefreshToken(
      cognitoResponse?.AuthenticationResult?.RefreshToken ??
        "no refresh token found"
    )
    setIdToken(
      cognitoResponse?.AuthenticationResult?.IdToken ?? "no id token found"
    )
  }

  // MUI Helpers
  const [open, setOpen] = useState(false)
  const handleClose = (event: any, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  const saveToClipboard = (e: React.MouseEvent<HTMLPreElement, MouseEvent>) => {
    navigator.clipboard
      .writeText(e.currentTarget?.innerText ?? "nothing")
      .then(() => setOpen(true))
  }

  return (
    <LayoutManager location={location}>
      <SEO title="Playground" />
      <h1>Playground</h1>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert
          onClose={(e) => handleClose(e, undefined)}
          elevation={6}
          variant="filled"
          severity="success"
        >
          Copied to clipboard!
        </MuiAlert>
      </Snackbar>

      <Styles>
        <fieldset>
          <legend>Local Storage:</legend>
          <button onClick={getCognitoFromLocalStorage}>
            COGNITO LOCAL STORAGE
          </button>
          <br />
          <span>AccessToken</span>
          <pre onClick={saveToClipboard}>{accessToken}</pre>
          <span>RefreshToken</span>
          <pre onClick={saveToClipboard}>{refreshToken}</pre>
          <span>IdToken</span>
          <pre onClick={saveToClipboard}>{idToken}</pre>
        </fieldset>

        {/* ----------------------------
                    COGNITO
           ----------------------------*/}
        <fieldset>
          <legend>Cognito Only:</legend>
          <input
            name={FormNames.EMAIL}
            placeholder={`${FormNames.EMAIL}/username`}
            onChange={handleInputChange}
            value={email}
          />
          <input
            name={FormNames.PASSWORD}
            placeholder={FormNames.PASSWORD}
            onChange={handleInputChange}
            value={password}
          />
          <input
            name={FormNames.CODE}
            placeholder={FormNames.CODE}
            onChange={handleInputChange}
            value={code}
          />
          <br />

          <button onClick={() => cognito.signUpWithEmail(email, password)}>
            COG SIGN UP
          </button>
          <br />
          <pre>
            {cognito.ops.signUpWithEmail.data
              ? JSON.stringify(cognito.ops.signUpWithEmail.data, null, 2)
              : cognito.ops.signUpWithEmail.error}
          </pre>
          <br />

          <button onClick={() => cognito.confirmSignUp(email, code)}>
            COG CONFIRM SIGN UP
          </button>
          <br />
          <pre>
            {cognito.ops.confirmSignUp.data
              ? JSON.stringify(cognito.ops.confirmSignUp.data, null, 2)
              : cognito.ops.confirmSignUp.error}
          </pre>
          <br />

          <button onClick={() => cognito.initiateAuth(email, password)}>
            COG INITIATE AUTH (USER_PASSWORD_AUTH)
          </button>
          <br />
          <pre>
            {cognito.ops.initiateAuth.data
              ? JSON.stringify(cognito.ops.initiateAuth.data, null, 2)
              : cognito.ops.initiateAuth.error}
          </pre>

          <br />

          <button
            onClick={() =>
              cognito.initiateAuthForRefreshToken(email, refreshToken)
            }
          >
            COG INITIATE AUTH (REFRESH_TOKEN)
          </button>
          <br />
          <pre>
            {cognito.ops.initiateAuthForRefreshToken.data
              ? JSON.stringify(
                  cognito.ops.initiateAuthForRefreshToken.data,
                  null,
                  2
                )
              : cognito.ops.initiateAuthForRefreshToken.error}
          </pre>
        </fieldset>

        {/* ----------------------------
                    VERIFY TOKENS
           ----------------------------*/}
        <fieldset>
          <legend>Verify Tokens</legend>
          <button
            onClick={() =>
              cognito.verifyToken(
                JSON.parse(localStorage.getItem("cognito") ?? "{}")
                  ?.AuthenticationResult?.AccessToken
              )
            }
          >
            Verify AccessToken
          </button>
          <button
            onClick={() =>
              cognito.verifyToken(
                JSON.parse(localStorage.getItem("cognito") ?? "{}")
                  ?.AuthenticationResult?.RefreshToken
              )
            }
          >
            Verify RefreshToken
          </button>
          <button
            onClick={() =>
              cognito.verifyToken(
                JSON.parse(localStorage.getItem("cognito") ?? "{}")
                  ?.AuthenticationResult?.IdToken
              )
            }
          >
            Verify IdToken
          </button>
          <pre>{JSON.stringify(cognito.decodedToken, null, 2)}</pre>
        </fieldset>
      </Styles>
    </LayoutManager>
  )
}

export default Playground

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
