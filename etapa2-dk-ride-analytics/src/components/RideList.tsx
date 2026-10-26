import { formatCents, formatDateBR, formatDuration, formatKm } from '../domain/money'
import { rideDurationMinutes, rideGrossCents, rideNetCents } from '../domain/rides'
import type { Ride } from '../types/ride'

const NO_DATA = '—'

export function RideList({ rides }: { rides: Ride[] }) {
  const sorted = [...rides].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <section className="card" aria-labelledby="rides-title">
      <h2 id="rides-title">Corridas ({rides.length})</h2>
      {sorted.length === 0 ? (
        <p className="muted">Nenhuma corrida neste período.</p>
      ) : (
        <div className="table-wrap">
          <table className="records">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Horário</th>
                <th scope="col">Duração</th>
                <th scope="col">Distância</th>
                <th scope="col">Bruto</th>
                <th scope="col">Taxas</th>
                <th scope="col">Líquido</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ride) => {
                const duration = rideDurationMinutes(ride)
                return (
                  <tr key={ride.id}>
                    <td data-label="Data">
                      {formatDateBR(ride.date)}
                      {ride.isDemo && <span className="demo-tag">Demo</span>}
                    </td>
                    <td data-label="Horário">
                      {ride.startTime && ride.endTime ? `${ride.startTime}–${ride.endTime}` : NO_DATA}
                    </td>
                    <td data-label="Duração">{duration !== null ? formatDuration(duration) : NO_DATA}</td>
                    <td data-label="Distância">{ride.distanceKm !== null ? formatKm(ride.distanceKm) : NO_DATA}</td>
                    <td data-label="Bruto">{formatCents(rideGrossCents(ride))}</td>
                    <td data-label="Taxas">{formatCents(ride.platformFeesCents)}</td>
                    <td data-label="Líquido">{formatCents(rideNetCents(ride))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
