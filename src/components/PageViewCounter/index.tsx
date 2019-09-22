import React, { useEffect } from "react"
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks"
import styled from "styled-components"

import { GET_PAGE } from "apollo"

const Small = styled.small`
  background: none;
  position: fixed;
  top: 70px;
  padding-left: 5px;
`

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
  const client = useApolloClient()

  useEffect(() => {
    /**
     * @TODO find an alternative to `setTimeout` to deal with race vs. Gatsby.onRouteUpdate()
     */
    setTimeout(
      () =>
        getPageViews({
          variables: { id: 1, location: location.href },
        }),
      500
    )

    return () => {
      /**
       * this fixes an issue with page view being cached when going 'back'
       */
      client.resetStore()
    }
  }, [location.href])

  if (!called) return <Small>.</Small>
  if (called && loading) return <Small>...</Small>
  if (error) return <Small>oops</Small>

  if (!data.getPage) return <Small>oops</Small>
  if (!data.getPage.attributes) return <Small>oops</Small>

  return (
    <Small>{`${data.getPage.attributes.views} ${
      data.getPage.attributes.views === 1 ? "view" : "views"
    }`}</Small>
  )
}

export { PageViewCounter }
