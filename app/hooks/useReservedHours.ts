import { useEffect, useState } from "react"

interface State {
    reservedHours: Set<number>
    loading: boolean
    error: string | null
}

function formatLocalDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function useReservedHours(courtId: string | null, date: Date): State {
    const [state, setState] = useState<State>({
        reservedHours: new Set(),
        loading: false,
        error: null
    })

    const dateKey = formatLocalDateKey(date)

    useEffect(() => {
        if (!courtId) return

        setState(s => ({ ...s, loading: true, error: null }))

        fetch(`/api/bookings/reserved?courtId=${courtId}&date=${dateKey}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch reserved hours')
                return res.json()
            })
            .then(({ reservedHours }: { reservedHours: number[] }) => {
                setState({
                    reservedHours: new Set(reservedHours),
                    loading: false,
                    error: null
                })
            })
            .catch(err => {
                setState({ reservedHours: new Set(), loading: false, error: err.message })
            })
    }, [courtId, dateKey])

    return state;

}