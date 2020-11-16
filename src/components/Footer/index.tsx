import * as React from "react"
import { Link } from "gatsby"
import { rhythm } from "utils/typography"

const GIT = "https://github.com/thiskevinwang/coffee-code-climb"

const footerStyle = {
  paddingTop: rhythm(2),
  paddingBottom: rhythm(1),
}

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <p>
        <a href={GIT}>Github</a>&nbsp;|&nbsp;
        <Link to="/privacy">Privacy Policy</Link>&nbsp;|&nbsp;
        <Link to="/terms">Terms of Service</Link>
        {process.env.NODE_ENV === "development" && (
          <>
            &nbsp;|&nbsp;
            <code>{new Date(Date.now() - 1.44e7).toISOString()}</code>
          </>
        )}
      </p>
      <div id={`amzn-assoc-ad-${process.env.GATSBY_AD_INSTANCE_ID}`} />
      <script
        async
        src={`//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=${process.env.GATSBY_AD_INSTANCE_ID}`}
      />
    </footer>
  )
}
