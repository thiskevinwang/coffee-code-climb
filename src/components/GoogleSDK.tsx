import { useEffect, memo } from "react"

/**
 * This will load `window.gapi` and a global `gapi`
 *
 * @see https://developers.google.com/identity/sign-in/web/sign-in
 * @see https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
 */
export const GoogleSDK = memo(() => {
  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script")
    const client_id = process.env.GATSBY_GOOGLE_CLIENT_ID

    script.innerHTML = `
      function init() {
        console.log("initting");
        gapi.load('auth2', function() {
          /* Ready. Make a call to gapi.auth2.init or some other API */
          gapi.auth2.init({ client_id: "${client_id}" });
        });
      }
    `
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script")
    script.src = "https://apis.google.com/js/platform.js?onload=init"
    script.async = true
    script.defer = true
    script.crossOrigin = "anonymous"

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
})
