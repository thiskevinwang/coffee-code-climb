import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import _ from "lodash"

interface Options {
  /**
   * The remaining number of claps a viewer can commit.
   * - defaults to 60.
   */
  remainingClaps?: number
}

/**
 * Response shape from: APIGateway ←→ Lambda ←→ DynamoDb
 */
interface PostClapsResponse {
  claps: number
}
/**
 * This is a custom hook to handle debouncing API calls to API Gateway.
 * It will queue up claps, then merge them upon success.
 *
 * It also returns state for when a viewer has reached their clap limit.
 */
export const useOptimisticClaps = (
  uri: string,
  { remainingClaps = 60 }: Options
) => {
  const [queuedClaps, setQueuedClaps] = useState(0)
  const [mergedClaps, setMergedClaps] = useState(0)

  const [clapLimitReached, setClapLimitReached] = useState(false)

  const updateClaps = useCallback(
    _.debounce(async (claps: number) => {
      if (clapLimitReached) return
      try {
        // Local state needs to be updated before the API call
        // This is considered "optimistic"
        setMergedClaps((m) => m + claps)
        setQueuedClaps(0)

        await axios.post<PostClapsResponse>(
          uri,
          JSON.stringify({
            claps: claps,
            slug: location.pathname,
          })
        )
      } catch (err) {
        // Object.getOwnPropertyNames(err)
        // ["stack", "message", "config", "request", "response", "isAxiosError", "toJSON"]
        if (err.response?.status === 500) {
          setClapLimitReached(true)
        }
      }
    }, 500),
    [clapLimitReached, setClapLimitReached, setQueuedClaps, setMergedClaps]
  )
  const incrementClaps = (cb: () => void) => {
    if (queuedClaps + mergedClaps >= remainingClaps) {
      setClapLimitReached(true)
      return
    }

    if (!clapLimitReached) {
      setQueuedClaps((c) => c + 1)
      cb?.()
    }
  }

  useEffect(() => {
    queuedClaps >= 1 && updateClaps(queuedClaps)
  }, [queuedClaps])

  return {
    incrementClaps,
    clapsCount: queuedClaps + mergedClaps,
    clapLimitReached,
  }
}
