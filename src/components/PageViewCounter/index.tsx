import React, { useEffect } from "react"
import { useLazyQuery } from "@apollo/react-hooks"

import { GET_PAGE } from "apollo"

/**
 * PageViewCounter
 * @usage
 * ```jsx
 *   <PageViewCounter location={location} />
 * ```
 */
const PageViewCounter = ({ location }: { location: Location }) => {
  const [getPageViews, { called, loading, data, error }] = useLazyQuery(
    GET_PAGE
  )
  useEffect(() => {
    console.log("fetching")
    getPageViews({
      variables: { id: 1, location: location.href },
    })
    return () => {}
  }, [location.href])

  if (!called) return <small>not called</small>
  if (called && loading) return <small>...</small>
  if (error) return <small>oops</small>

  if (!data.getPage) return <small>oops</small>
  if (!data.getPage.attributes) return <small>oops</small>

  return (
    <small style={{ position: "sticky", top: 70, paddingLeft: 5 }}>{`${
      data.getPage.attributes.views
    } ${data.getPage.attributes.views === 1 ? "view" : "views"}`}</small>
  )
}

export { PageViewCounter }
