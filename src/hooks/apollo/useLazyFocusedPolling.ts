import { useEffect } from "react"

interface IPollingOptions {
  startPolling(pollInterval: number): void
  stopPolling(): void
  interval: number
  called: boolean
}
/**
 * This hook is used to handle polling on window focus/blur,
 * after an Apollo lazyQuery is called.
 *
 * @usage
 * ```tsx
 * useLazyFocusedPolling({ startPolling, stopPolling, called, interval: 2000 })
 * ```
 */
export function useLazyFocusedPolling({
  startPolling,
  stopPolling,
  interval,
  called,
}: IPollingOptions) {
  useEffect(() => {
    const handleStartPolling = () => {
      startPolling(interval)
    }
    const handleStopPolling = () => {
      stopPolling()
    }

    if (called) {
      window.addEventListener("blur", handleStopPolling)
      window.addEventListener("focus", handleStartPolling)
    }
    return () => {
      window.removeEventListener("blur", handleStopPolling)
      window.removeEventListener("focus", handleStartPolling)
    }
  }, [startPolling, stopPolling, interval, called])
}
