import { useState, useMemo } from 'react'
import { Check, Truck, AlertCircle } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIRecommendedBadge from '../../components/AIRecommendedBadge'
import { useApp } from '../../context/AppContext'
import { findBestTransporters } from '../../utils/aiMatching'
import { formatRWF } from '../../data/mockData'

export default function TransportMatches() {
  const { listings, acceptMatch, transporters } = useApp()
  const [accepted, setAccepted] = useState(new Set())

  // Find all pending listings for farmer f1
  const pendingListings = useMemo(() => {
    return listings.filter(l => l.farmerId === 'f1' && l.status === 'Pending')
  }, [listings])

  // Generate stable matches per pending listing (seeded using listing.id to prevent rerender price fluctuations)
  const matchesByListing = useMemo(() => {
    const map = {}
    pendingListings.forEach(l => {
      // Find matches using utility
      const rawMatches = findBestTransporters(l, 3)
      // Make prices and confidence stable by seeding with listing id and transporter id
      map[l.id] = rawMatches.map((m, idx) => {
        const seed = l.id.charCodeAt(l.id.length - 1) + m.id.charCodeAt(m.id.length - 1)
        const stablePrice = 20000 + (seed % 30) * 1500
        const stableConfidence = Math.min(80 + (seed % 19), 98)
        return {
          ...m,
          price: stablePrice,
          confidence: stableConfidence,
        }
      })
    })
    return map
  }, [pendingListings])

  const handleAccept = (listingId, transporterId, price) => {
    acceptMatch(listingId, transporterId, price)
    setAccepted(prev => {
      const next = new Set(prev)
      next.add(`${listingId}-${transporterId}`)
      return next
    })
  }

  return (
    <div>
      <PageHeader title="Transport Matches" description="AI-recommended transporters for your pending listings." />
      
      {pendingListings.length === 0 ? (
        <Card className="p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-lg">No Pending Listings</h3>
            <p className="text-stone-500 text-sm mt-1">
              You don't have any pending produce listings waiting for transport matches. List some produce to see AI recommendations.
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
                <p className="text-xs text-stone-400 mt-0.5">Listed Date: {listing.availableDate}</p>
              </div>
              <div className="grid gap-4">
                {(matchesByListing[listing.id] || []).map((match, i) => {
                  const key = `${listing.id}-${match.id}`
                  const isAccepted = accepted.has(key)
                  return (
                    <Card key={match.id} className="p-5">
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
