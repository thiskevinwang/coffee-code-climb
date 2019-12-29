import { useEffect } from "react"
import ms from "ms"

interface IPollingOptions {
  /**
   * This function sets up an interval in ms and fetches
   * the query each time the specified interval passes.
   *
   * @note This is in the `QueryResult<TData, TVariables>` object
   */
  startPolling(pollInterval: number): void

  /**
   * This function stops the query from polling.
   */
  stopPolling(): void

  /**
   * A boolean indicating if the query function has been called,
   * used by `useLazyQuery` (not set for `useQuery` / `Query`).
   */
  called: boolean

  /**
   * Specifies the interval in ms at which you want your
   * component to poll for data.If not specified, the query
   * will fire every **1 second**.
   */
  interval?: number

  /**
   * The amount of ms after which polling will stop. If not
   * specified, polling will stop after **5 minutes**.
   */
  stopAfter?: number
}
/**
 * This hook is used to handle polling on window focus/blur,
 * after an Apollo lazyQuery is called.
 *
 * @usage
 * ```tsx
 * useLazyPolling({ startPolling, stopPolling, called, interval: 2000 })
 * ```
 */
export function useLazyPolling({
  startPolling,
  stopPolling,
  called,
  interval,
  stopAfter,
}: IPollingOptions) {
  useEffect(() => {
    if (called) {
      startPolling?.(interval ?? 1000)
      setTimeout(() => {
        stopPolling?.()
      }, stopAfter ?? ms("5m"))
    }
    return () => {
      stopPolling?.()
    }
  }, [startPolling, stopPolling, interval, called])
}
