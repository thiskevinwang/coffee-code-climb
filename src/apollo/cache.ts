import { InMemoryCache } from "@apollo/client"
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist"

import { isBrowser } from "utils"

export const initCache = async () => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // this bit of code is to support `fetchMore`
          getDiscussions: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,
            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing, incoming) {
              if (!!existing?.items) {
                return {
                  items: [...existing.items, ...incoming.items],
                  lastEvaluatedKey: incoming.lastEvaluatedKey,
                }
              } else {
                return incoming
              }
            },
          },
        },
      },
    },
  })

  try {
    if (isBrowser()) {
      persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      })
    }
  } catch (error) {
    console.error("Error restoring Apollo cache", error)
  } finally {
    return cache
  }
}
