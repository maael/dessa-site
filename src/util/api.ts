import fetch from 'isomorphic-fetch'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { SightseeingChallenge } from '../types/db'

export enum Keys {
  SightseeingChallenges = 'sightseeingChallenges',
  SightseeingChallenge = 'sightseeingChallenge',
}

export async function getSightseeingChallenges() {
  const res = await fetch('/api/sightseeing')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export function useSightseeingChallenges() {
  return useQuery<SightseeingChallenge[]>(Keys.SightseeingChallenges, getSightseeingChallenges)
}

export async function getSightseeingChallenge({ queryKey }) {
  const res = await fetch(`/api/sightseeing?id=${queryKey[1]}`)
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export function useSightseeingChallenge(id: string | null) {
  return useQuery<SightseeingChallenge>([Keys.SightseeingChallenge, id], getSightseeingChallenge, {
    enabled: !!id && id !== 'new',
  })
}

export async function createOrUpdateSightseeingChallenge(challenge: any) {
  const url = challenge._id ? `/api/sightseeing?id=${challenge._id}` : '/api/sightseeing'
  const method = challenge._id ? 'PATCH' : 'POST'
  const data = new FormData()
  if (challenge._id) data.append('_id', challenge._id)
  data.append('name', challenge.name)
  data.append('description', challenge.description)
  data.append('difficulty', '5')
  data.append('media', challenge.media)
  challenge.items.forEach((i, idx) => {
    data.append(`items[${idx}][hint][text]`, i.hint.text)
    data.append(`items[${idx}][hint][media]`, i.hint.media)
    data.append(`items[${idx}][player][x]`, i.player.x)
    data.append(`items[${idx}][player][y]`, i.player.y)
    i.avatar.forEach((a, ajx) => {
      data.append(`items[${idx}][avatar][${ajx}]`, a)
    })
  })
  const res = await fetch(url, {
    method,
    body: data,
  })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export function useSightseeingChallengeCreateOrUpdate() {
  return useMutation(createOrUpdateSightseeingChallenge)
}

export async function likeSightseeingChallenge(id: string) {
  const url = `/api/sightseeing?id=${id}&action=like`
  const res = await fetch(url, { method: 'PUT' })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export function useSightseeingChallengeLike() {
  const queryClient = useQueryClient()
  return useMutation(likeSightseeingChallenge, {
    onMutate: async (id) => {
      await queryClient.cancelQueries([Keys.SightseeingChallenge, id])
      const previousValue = queryClient.getQueryData([Keys.SightseeingChallenge, id])
      ;(previousValue as any).likes++
      return previousValue
    },
  })
}

export async function deleteSightseeingChallenge(id: string) {
  const url = `/api/sightseeing?id=${id}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export function useSightseeingChallengeDelete() {
  return useMutation(deleteSightseeingChallenge)
}
