import React from "react"
import { rhythm, scale } from "@src/utils/typography"

const GIT: string = "https://github.com/thiskevinwang/coffee-code-climb"
const WEB: string = "https://thekevinwang.com"

export default function Footer(): JSX.Element {
  return (
    <footer style={{ paddingTop: rhythm(2), paddingBottom: rhythm(2) }}>
      <a href={GIT}>Github</a> <a href={WEB}>Website</a>{" "}
      {process.env.NODE_ENV === "development" && (
        <code>{new Date(Date.now() - 1.44e7).toISOString()}</code>
      )}
      <div id={`amzn-assoc-ad-${process.env.GATSBY_AD_INSTANCE_ID}`} />
      <script
        async
        src={`//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=${
          process.env.GATSBY_AD_INSTANCE_ID
        }`}
      />
    </footer>
  )
}
