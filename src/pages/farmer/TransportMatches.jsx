import { useState, useMemo } from 'react'
import { Check, Truck } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIRecommendedBadge from '../../components/AIRecommendedBadge'
import MatchExplanationCard from '../../components/story/MatchExplanationCard'
import { useApp } from '../../context/AppContext'
import { useDemoPersona } from '../../context/DemoPersonaContext'
import { findBestTransporters } from '../../utils/aiMatching'
import { formatRWF } from '../../data/mockData'

export default function TransportMatches() {
  const { listings, acceptMatch, transporters } = useApp()
  const { persona } = useDemoPersona()
  const farmerId = persona.role === 'farmer' ? persona.id : 'f1'
  const [accepted, setAccepted] = useState(new Set())

  const pendingListings = useMemo(() => {
    return listings.filter(l => l.farmerId === farmerId && l.status === 'Pending')
  }, [listings, farmerId])

  const matchesByListing = useMemo(() => {
    const map = {}
    pendingListings.forEach(l => {
      const rawMatches = findBestTransporters(l, transporters, 3)
      map[l.id] = rawMatches.map((m, idx) => {
        const seed = l.id.charCodeAt(l.id.length - 1) + m.id.charCodeAt(m.id.length - 1)
        const stablePrice = 20000 + (seed % 30) * 1500
        return { ...m, price: stablePrice }
      })
    })
    return map
  }, [pendingListings, transporters])

  const handleAccept = (listingId, transporterId, price) => {
    acceptMatch(listingId, transporterId, price)
    setAccepted(prev => new Set(prev).add(`${listingId}-${transporterId}`))
  }

  return (
    <div>
      <PageHeader
        title="Transport Matches"
        description="AI-recommended transporters based on route overlap, capacity, and district proximity — not just price."
      />

      {pendingListings.length === 0 ? (
        <Card className="p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-lg">No Pending Listings</h3>
            <p className="text-stone-500 text-sm mt-1">
              List produce to see how GreenRoute matches your harvest with available transport capacity.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {pendingListings.map(listing => (
            <div key={listing.id} className="space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h2 className="text-md font-semibold text-stone-800">
                  Matches for {listing.crop} ({listing.quantity.toLocaleString()} kg in {listing.district})
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">Route: {listing.district} → Kigali</p>
              </div>
              <div className="grid gap-4">
                {(matchesByListing[listing.id] || []).map((match, i) => {
                  const key = `${listing.id}-${match.id}`
                  const isAccepted = accepted.has(key)
                  return (
                    <Card key={match.id} className="p-5 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-stone-900">{match.name}</h3>
                            {i === 0 && <AIRecommendedBadge />}
                            <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                              {match.confidence}% match
                            </span>
                          </div>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-1.5 text-sm">
                            <div><span className="text-stone-400">Vehicle</span><p className="text-stone-700 font-medium">{match.vehicleType}</p></div>
                            <div><span className="text-stone-400">Capacity</span><p className="text-stone-700 font-medium">{match.capacity.toLocaleString()} kg</p></div>
                            <div><span className="text-stone-400">Route</span><p className="text-stone-700 font-medium">{match.route}</p></div>
                            <div><span className="text-stone-400">Price Quote</span><p className="text-stone-900 font-bold text-base">{formatRWF(match.price)}</p></div>
                          </div>
                        </div>
                        <Button
                          variant={isAccepted ? 'secondary' : 'primary'}
                          disabled={isAccepted}
                          onClick={() => handleAccept(listing.id, match.id, match.price)}
                          className="shrink-0 w-full lg:w-auto"
                        >
                          {isAccepted ? <><Check size={16} /> Accepted</> : 'Accept Match'}
                        </Button>
                      </div>
                      {match.factors?.length > 0 && (
                        <MatchExplanationCard factors={match.factors} confidence={match.confidence} compact />
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
