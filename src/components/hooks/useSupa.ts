import { useEffect, useState } from 'react'
import supa from '../../utils/supa'

export default function useSupa<T = any>(table: string, fields: string, filter?: string) {
  const [result, setResult] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [supaError, setSupaError] = useState<string | undefined>(undefined)
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setSupaError(undefined)
        let qPromise = supa.from<T>(table).select(fields)
        if (filter) {
          if (filter.includes('undefined')) throw Error('Filter not set properly')
          qPromise = qPromise.filter(...(filter.split(' ') as [any, any, string | number]))
        }
        const { data, error } = await qPromise
        if (error) setSupaError(error.message)
        setResult(data || [])
      } finally {
        setLoading(false)
      }
    })().catch((e) => console.error(e))
  }, [table, fields, filter])
  return {
    data: result,
    error: supaError,
    loading,
  }
}
