import { useMemo } from 'react'
import { Truck } from 'lucide-react'
import { PageHeader, Card } from '../../components/ui'
import AIRecommendedBadge from '../../components/AIRecommendedBadge'
import MatchExplanationCard from '../../components/story/MatchExplanationCard'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'
import { findBestTransporters } from '../../utils/aiMatching'
import { formatRWF } from '../../data/mockData'

export default function TransportMatches() {
  const { listings, orders, jobs, transporters } = useApp()
  const { entityId: farmerId } = usePortalIdentity()

  const assignedListingIds = useMemo(
    () => new Set(jobs.filter(j => j.transporterId).map(j => j.listingId)),
    [jobs],
  )

  const pendingListings = useMemo(() => {
    return listings.filter(
      l =>
        l.farmerId === farmerId &&
        orders.some(o => o.produceId === l.id) &&
        !assignedListingIds.has(l.id) &&
        !['Delivered', 'Completed', 'In Transit', 'Matched'].includes(l.status),
    )
  }, [listings, farmerId, assignedListingIds, orders])

  const matchesByListing = useMemo(() => {
    const map = {}
    pendingListings.forEach(l => {
      const order = orders.find(o => o.produceId === l.id)
      const produce = {
        ...l,
        deliveryDistrict: order?.deliveryDistrict || 'Kigali',
        deliveryDate: order?.deliveryDate,
      }
      map[l.id] = findBestTransporters(produce, transporters, 3)
    })
    return map
  }, [pendingListings, transporters, orders])

  const deliveryDistrictFor = (listingId) => {
    const order = orders.find(o => o.produceId === listingId)
    return order?.deliveryDistrict || 'Kigali'
  }

  return (
    <div>
      <PageHeader
        title="Transport Matches"
        description="AI-ranked transporter recommendations — jobs go to Available Jobs and transporters accept when ready."
      />

      {pendingListings.length === 0 ? (
        <Card className="p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-lg">No Orders Awaiting Transport</h3>
            <p className="text-stone-500 text-sm mt-1">
              After a buyer places an order, ranked transporter matches appear here while the job waits in Available Jobs.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {pendingListings.map(listing => {
            const matches = matchesByListing[listing.id] || []
            return (
              <div key={listing.id} className="space-y-4">
                <div className="border-b border-stone-200 pb-2">
                  <h2 className="text-md font-semibold text-stone-800">
                    Matches for {listing.crop} ({listing.quantity.toLocaleString()} kg in {listing.district})
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">Route: {listing.district} → {deliveryDistrictFor(listing.id)}</p>
                </div>

                {transporters.length === 0 ? (
                  <Card className="p-5 text-sm text-stone-500">
                    No transporters registered yet. Once transporters register, open jobs appear in their Available Jobs list.
                  </Card>
                ) : matches.length === 0 ? (
                  <Card className="p-5 text-sm text-stone-500">
                    No eligible transporters for this route yet. The job stays open until a matching transporter accepts it.
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {matches.map((match, i) => (
                      <Card key={match.id} className="p-5 space-y-4">
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
                            <div><span className="text-stone-400">Rate</span><p className="text-stone-700 font-medium">{match.pricePerKm} RWF/km</p></div>
                            <div><span className="text-stone-400">Distance</span><p className="text-stone-700 font-medium">{match.distanceKm} km</p></div>
                            <div><span className="text-stone-400">Quote</span><p className="text-stone-900 font-bold text-base">{formatRWF(match.price)}</p></div>
                          </div>
                        </div>
                        {match.factors?.length > 0 && (
                          <MatchExplanationCard factors={match.factors} confidence={match.confidence} compact />
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
