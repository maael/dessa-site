import { useCallback, useEffect, useState } from 'react'
import supa from '../../utils/supa'

class FilterError extends Error {}

export default function useSupa<T = any>(table: string, fields: string, filter?: string) {
  const [result, setResult] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [supaError, setSupaError] = useState<string | undefined>(undefined)
  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setSupaError(undefined)
      let qPromise = supa.from<T>(table).select(fields)
      if (filter) {
        if (filter.includes('undefined')) throw new FilterError('Filter not set properly')
        qPromise = qPromise.filter(...(filter.split(' ') as [any, any, string | number]))
      }
      const { data, error } = await qPromise
      if (error) setSupaError(error.message)
      setResult(data || [])
    } finally {
      setLoading(false)
    }
  }, [table, fields, filter])
  useEffect(() => {
    refetch().catch((e) => {
      if (e instanceof FilterError) {
        console.warn(e.message, table, fields, filter)
      } else {
        console.error(e)
      }
    })
  }, [table, fields, filter, refetch])
  return {
    data: result,
    error: supaError,
    loading,
    refetch,
  }
}
