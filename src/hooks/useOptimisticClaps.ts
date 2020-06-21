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
        await axios.post(
          uri,
          JSON.stringify({
            claps: claps,
            slug: location.pathname,
          })
        )

        // TODO, instead of merging local state, merge the response instead
        setMergedClaps((m) => m + claps)
        setQueuedClaps(0)
      } catch (err) {
        // setQueuedClaps(0)
        // Object.getOwnPropertyNames(err)
        // ["stack", "message", "config", "request", "response", "isAxiosError", "toJSON"]
        // console.log("ERROR", err.response?.status)
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
