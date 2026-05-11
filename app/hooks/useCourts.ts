import { useEffect, useState } from "react";
import { Court } from "../types/Court";
import { COURTS } from "../data/courts";

interface State {
    courts: Court[],
    loading: boolean,
    error: string | null
}

export function useCourts(): State {
    const [state, setState] = useState<State>({
        courts: [],
        loading: true,
        error: null,
    })

    useEffect(() => {
    fetch('/api/courts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch courts')
        return res.json()
      })
      .then(({ courts }) => setState({ courts, loading: false, error: null }))
      .catch(err => {
        console.error(err)
        setState({ courts: COURTS, loading: false, error: err.message })
      })
  }, [])

  return state
}