import React, { useCallback } from "react"
import { useTransition, animated } from "react-spring"

import _ from "lodash"
import ms from "ms"
import { Link } from "gatsby"
import { RouteComponentProps } from "@reach/router"
import { useQuery, gql } from "@apollo/client"
import Box from "@material-ui/core/Box"

import { Query } from "types"
import { SubmitButton } from "components/Form/SubmitButton"
import { fs } from "components/Fieldset"
import { MapIdToUser } from "components/MapIdToUser"

const GET_DISCUSSIONS_QUERY = gql`
  query GetDiscussions($lastEvaluatedKey: LastEvaluatedKey) {
    getDiscussions(lastEvaluatedKey: $lastEvaluatedKey) {
      items {
        id
        created
        title
        authorId
      }
      lastEvaluatedKey {
        created
        PK
        SK
      }
    }
  }
`
const useThrottle = <T extends (...args: any) => any>(
  func: T
): T & _.Cancelable => {
  return useCallback(_.throttle(func, 500), [])
}

export const Discussions = (props: RouteComponentProps) => {
  const { data, fetchMore } = useQuery<{
    getDiscussions: Query["getDiscussions"]
  }>(GET_DISCUSSIONS_QUERY)

  const handleLoadMore = useThrottle((lastEvaluatedKey) => {
    if (lastEvaluatedKey) {
      fetchMore({
        variables: {
          lastEvaluatedKey: _.omit(lastEvaluatedKey, "__typename"),
        },
      })
    }
  })

  const transition = useTransition(
    data?.getDiscussions?.items ?? [],
    (e) => e?.id,
    {
      from: {
        opacity: 0,
        transformOrigin: "top",
        maxHeight: 0,
        willChange: `opacity, maxHeight`,
      },
      enter: {
        opacity: 1,
        maxHeight: 1000,
      },
      leave: {
        opacity: 0,
        maxHeight: 0,
      },
      trail: 100,
    }
  )

  return (
    <div>
      <h1>Discussions</h1>
      <br />
      <br />

      {transition.map(({ item: e, props, key }) => (
        <animated.div key={key} style={props}>
          <Link to={`/app/discussions/${e?.id}`}>
            <fs.Fieldset hoverable>
              <fs.Content>
                <fs.Title>
                  <b>{e?.title}</b>
                </fs.Title>
              </fs.Content>
              <fs.Footer>
                <Box>
                  <small style={{ display: "inline-flex" }}>
                    Posted by&nbsp;
                    <MapIdToUser.Username id={e?.authorId} />
                    &nbsp;
                  </small>
                  <small>{ms(+new Date() - +new Date(e?.created))} ago</small>
                </Box>
              </fs.Footer>
            </fs.Fieldset>
          </Link>
        </animated.div>
      ))}

      <SubmitButton
        onClick={() => handleLoadMore(data?.getDiscussions?.lastEvaluatedKey)}
      >
        {data?.getDiscussions?.lastEvaluatedKey
          ? "Load more posts"
          : "No more posts to load"}
      </SubmitButton>
    </div>
  )
}
