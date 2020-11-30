import { useEffect, memo } from "react"

/**
 * A component to help append scripts to the document from
 * within Gatsby's `wrapRootElement`
 *
 * @note This can't yet be a hook because React won't detect `wrapRootElement`
 * as a Component or Hook (likely due to name-casing).
 *
 * @see https://developers.facebook.com/docs/javascript/quickstart
 */
export const FacebookSDK = memo(() => {
  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script")
    const appId = process.env.GATSBY_FACEBOOK_APP_ID
    script.innerHTML = `
      window.fbAsyncInit = function() {
        FB.init({
          appId            : '${appId}',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v8.0'
        });
      };
    `
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const script: HTMLScriptElement = document.createElement("script")
    script.src = "https://connect.facebook.net/en_US/sdk.js"
    script.async = true
    script.crossOrigin = "anonymous"

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
})
