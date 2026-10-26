import { useCallback } from 'react'
import { isRide } from '../data/guards'
import { RIDES_KEY } from '../data/storage'
import type { Ride, RideInput } from '../types/ride'
import { usePersistentList } from './usePersistentList'

export function useRides() {
  const [rides, setRides] = usePersistentList<Ride>(RIDES_KEY, isRide)

  const addRide = useCallback(
    (input: RideInput) => {
      const now = new Date().toISOString()
      const ride: Ride = {
        ...input,
        id: crypto.randomUUID(),
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      }
      setRides((previous) => [...previous, ride])
    },
    [setRides],
  )

  const updateRide = useCallback(
    (id: string, input: RideInput) => {
      const now = new Date().toISOString()
      setRides((previous) =>
        previous.map((ride) => (ride.id === id ? { ...ride, ...input, updatedAt: now } : ride)),
      )
    },
    [setRides],
  )

  const deleteRide = useCallback(
    (id: string) => setRides((previous) => previous.filter((ride) => ride.id !== id)),
    [setRides],
  )

  const addDemoRides = useCallback(
    (demoRides: Ride[]) => setRides((previous) => [...previous, ...demoRides]),
    [setRides],
  )

  const removeDemoRides = useCallback(
    () => setRides((previous) => previous.filter((ride) => !ride.isDemo)),
    [setRides],
  )

  return { rides, addRide, updateRide, deleteRide, addDemoRides, removeDemoRides }
}
