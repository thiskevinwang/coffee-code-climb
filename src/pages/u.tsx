import React from "react"
import { PageProps } from "gatsby"

import { LayoutManager } from "components/layoutManager"

import SEO from "components/seo"

const UserPage = ({ location }: PageProps) => {
  return (
    <>
      <SEO title="User" />
      <LayoutManager location={location}>
        <p>
          This User page feature is under currently construction. I work 40
          hours a week, and slowly add features onto this blog on my free time.
        </p>
      </LayoutManager>
    </>
  )
}

export default UserPage
