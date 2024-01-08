import { useState, useEffect } from "react"

export const useFetch = (fetchUrl: string) => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch(fetchUrl).then(res => res.json()).then(setData)
  }, [fetchUrl])
  
  return data
}