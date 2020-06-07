import { useCallback, useState, useEffect } from "react"
import axios from "axios"
import _ from "lodash"

export const useOptimisticClaps = (uri: string) => {
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
        // console.log("RESPONSE", res)
        // console.log("PARSED", JSON.parse(res.data))
        setMergedClaps((m) => m + claps)
        setQueuedClaps(0)
      } catch (err) {
        // Object.getOwnPropertyNames(err)
        // ["stack", "message", "config", "request", "response", "isAxiosError", "toJSON"]
        // console.log("ERROR", err.response?.status)
        if (err.response?.status === 500) {
          setClapLimitReached(true)
        }
      }
    }, 500),
    [clapLimitReached, setClapLimitReached]
  )
  const incrementClaps = () => {
    if (!clapLimitReached) {
      setQueuedClaps((c) => c + 1)
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
