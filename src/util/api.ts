import fetch from 'isomorphic-fetch'
import { useQuery, useMutation } from 'react-query'
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
  if (!challenge._id) delete challenge._id
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challenge),
  })
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export function useSightseeingChallengeCreateOrUpdate() {
  return useMutation(createOrUpdateSightseeingChallenge)
}
