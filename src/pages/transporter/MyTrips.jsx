import { ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import { PageHeader, Card, Button } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { useDemoPersona } from '../../context/DemoPersonaContext'

export default function MyTrips() {
  const { trips, updateTripStatus } = useApp()
  const { persona } = useDemoPersona()
  const transporterId = persona.role === 'transporter' ? persona.id : 't1'

  const myTrips = trips.filter(t => t.transporterId === transporterId)
  const active = myTrips.filter(t => t.status === 'In Transit' || t.status === 'Active')
  const completed = myTrips.filter(t => t.status === 'Completed')

  const TripCard = ({ trip }) => (
    <Card className="p-5 flex flex-col justify-between min-h-[180px]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">{trip.crop}</span>
            <span className="text-sm text-stone-400">{trip.quantity.toLocaleString()} kg</span>
          </div>
          <StatusBadge status={trip.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <span className="font-medium text-stone-700">{trip.from}</span>
          <ArrowRight size={14} className="text-stone-300 animate-pulse-soft" />
          <span className="font-medium text-stone-700">{trip.to}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 text-xs">
          <span className="text-stone-400">{trip.date}</span>
          <span className="text-sm font-semibold text-stone-900">{formatRWF(trip.earnings)}</span>
        </div>
        {trip.status === 'Active' && (
          <Button
            variant="primary"
            className="w-full mt-3 py-1.5 text-xs gap-1.5"
            onClick={() => updateTripStatus(trip.id, 'In Transit')}
          >
            <Play size={12} fill="currentColor" /> Start Transit
          </Button>
        )}
        {trip.status === 'In Transit' && (
          <Button
            variant="primary"
            className="w-full mt-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 border-none gap-1.5"
            onClick={() => updateTripStatus(trip.id, 'Completed')}
          >
            <CheckCircle2 size={12} /> Mark Completed
          </Button>
        )}
      </div>
    </Card>
  )

  return (
    <div>
      <PageHeader
        title="My Trips"
        description="Move goods along the chain — each completed trip means less spoilage and fewer empty kilometers."
      />
      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-stone-900 mb-4">Active</h2>
          {active.length === 0 ? (
            <p className="text-sm text-stone-400 bg-white border border-stone-100 p-6 rounded-2xl">No active trips currently in progress.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-sm font-semibold text-stone-900 mb-4">Completed</h2>
          {completed.length === 0 ? (
            <p className="text-sm text-stone-400 bg-white border border-stone-100 p-6 rounded-2xl">No completed trips yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
