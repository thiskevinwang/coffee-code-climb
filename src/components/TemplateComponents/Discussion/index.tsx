import * as React from "react"
import { DiscussionEmbed } from "disqus-react"

interface Props {
  locationPathname: string // `/first-climbing-trips-of-2019/`
  identifier: string // `9098d5ea-e984-5c0b-a1cf-b514577eb29f`
  title: string // `First Climbing Trips of 2019`
}

export default function Discussion({
  locationPathname,
  identifier,
  title,
}: Props) {
  const disqusShortname = "coffeecodeclimb"
  const disqusConfig = {
    url: "https://coffeecodeclimb.com" + locationPathname,
    identifier: identifier,
    title: title,
  }

  return (
    <>
      <h2>Discussion</h2>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </>
  )
}
