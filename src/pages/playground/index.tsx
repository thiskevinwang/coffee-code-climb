import React, { useState, useReducer } from "react"
import { useSelector } from "react-redux"
import { graphql } from "gatsby"
import styled from "styled-components"
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"

import SEO from "components/seo"
import { LayoutManager } from "components/layoutManager"

import { useCognito } from "utils/Playground/useCognito"
import { useNewAuthentication } from "hooks/useAuthentication"
import { RootState } from "_reduxState"

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
    /* border-color: var(--text); */
  }
  legend {
    color: var(--text);
  }
  hr {
    /* silver is the default border-color for fieldset, so match it */
    background-color: silver;
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
  const { decodedAccessToken, decodedIdToken } = useNewAuthentication()

  const cognito = useCognito()
  const [{ code, email, password }, dispatch] = useReducer(
    reducer,
    initialState
  )
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      name: e.target.name as FormNames,
      value: e.target.value,
    })
  }

  const cog = useSelector((state: RootState) => state.cognito)
  const cogErr = cog.error
  const accessToken = cog?.data?.AuthenticationResult?.AccessToken
  const refreshToken = cog?.data?.AuthenticationResult?.RefreshToken
  const idToken = cog?.data?.AuthenticationResult?.IdToken

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
      <h2>Location</h2>
      <pre>
        {JSON.stringify(location.state?.data ?? location.state?.error, null, 2)}
      </pre>
      <p>
        <b>Username: </b>
        {decodedAccessToken?.username ??
          decodedAccessToken?.sub ??
          decodedAccessToken?.name}
      </p>
      <p>
        <b>Email: </b>
        {decodedIdToken?.email ?? "_"}
      </p>

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
          {/* <button onClick={getCognitoFromLocalStorage}>
            COGNITO LOCAL STORAGE
          </button>
          <br /> */}
          <span>AccessToken</span>
          <pre onClick={saveToClipboard}>{accessToken}</pre>
          <span>RefreshToken</span>
          <pre onClick={saveToClipboard}>{refreshToken}</pre>
          <span>IdToken</span>
          <pre onClick={saveToClipboard}>{idToken}</pre>
          <hr />

          <div>
            <div>
              <span>Data</span>
              <pre>{JSON.stringify(cog.data, null, 2)}</pre>
            </div>
            <div>
              <span>Error</span>
              <pre>{JSON.stringify(cogErr, null, 2)}</pre>
            </div>
          </div>
        </fieldset>

        {/* ----------------------------
                    COGNITO
           ----------------------------*/}
        <fieldset>
          <legend>Cognito Operations:</legend>
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
            placeholder={`verification ${FormNames.CODE}`}
            onChange={handleInputChange}
            value={code}
          />
          <br />

          <button onClick={() => cognito.signUpWithEmail(email, password)}>
            SIGN UP
          </button>

          <button onClick={() => cognito.confirmSignUp(email, code)}>
            CONFIRM SIGN UP
          </button>
          <br />

          <button onClick={() => cognito.forgotPassword(email)}>
            FORGOT PASSWORD
          </button>
          <button
            onClick={() => cognito.confirmForgotPassword(email, password, code)}
          >
            CONFIRM FORGOT PASSWORD
          </button>
          <br />

          <button onClick={() => cognito.initiateAuth(email, password)}>
            INITIATE AUTH (USER_PASSWORD_AUTH)
          </button>
          <br />

          <button
            onClick={() =>
              cognito.initiateAuthForRefreshToken(email, refreshToken ?? "")
            }
          >
            INITIATE AUTH (REFRESH_TOKEN)
          </button>
          <br />

          <button onClick={() => cognito.initiateAuthWithFacebook()}>
            INITIATE AUTH (FACEBOOK)
          </button>
          <button onClick={() => cognito.adminLinkProviderForUser(email)}>
            ADMIN LINK PROVIDER FOR USER (FACEBOOK)
          </button>
          <br />
          <a href={process.env.GATSBY_COGNITO_REDIRECT_URI}>Launch Hosted UI</a>
        </fieldset>

        {/* ----------------------------
                    VERIFY TOKENS
           ----------------------------*/}
        <fieldset>
          <legend>Verify Tokens</legend>
          <button onClick={() => cognito.verifyToken(accessToken)}>
            Verify AccessToken
          </button>
          <button onClick={() => cognito.verifyToken(refreshToken)}>
            Verify RefreshToken
          </button>
          <button onClick={() => cognito.verifyToken(idToken)}>
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
