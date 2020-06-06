import { useEffect, useState } from "react"
import fetch from "isomorphic-fetch"

export const useFetch = <T extends any, E extends any>(url: string) => {
  const [data, setData] = useState<T>(undefined)
  const [error, setError] = useState<E>(undefined)

  useEffect(() => {
    const fetchData = () => {
      fetch(url)
        .then((res) => res.json())
        .then((value) => setData(value))
        .catch((err) => {
          setError(err)
        })
    }

    if (url) {
      fetchData()
    }
    return () => {}
  }, [url])

  return { data, error }
}
