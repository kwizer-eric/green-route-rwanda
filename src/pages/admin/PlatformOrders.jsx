import { RefreshCw } from 'lucide-react'
import { PageHeader, Button } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function PlatformOrders() {
  const { orders, listings, jobs, trips, loading, refresh } = useApp()

  const jobByListing = Object.fromEntries(jobs.map(j => [j.listingId, j]))
  const tripByListing = Object.fromEntries(trips.map(t => [t.listingId, t]))
  const listingById = Object.fromEntries(listings.map(l => [l.id, l]))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Platform Orders"
          description="Full order chain — farmer listing, buyer purchase, transport match, and delivery status."
        />
        <Button variant="secondary" onClick={refresh} disabled={loading} className="shrink-0 self-start">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-3 font-medium text-stone-500">Order</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Crop</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Farmer</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Buyer</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden sm:table-cell">Qty</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden xl:table-cell">Pickup</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden xl:table-cell">Delivery</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Produce</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Transport</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Transporter</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Order</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Buyer confirm</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Logistics</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-10 text-center text-stone-400">
                    No orders yet. Orders appear when buyers purchase farmer listings.
                  </td>
                </tr>
              ) : (
                orders.map(o => {
                  const listing = listingById[o.produceId]
                  const job = jobByListing[o.produceId]
                  const trip = tripByListing[o.produceId]
                  return (
                    <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors align-top">
                      <td className="px-4 py-3 font-mono text-xs text-stone-400 whitespace-nowrap">
                        {o.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900">{o.crop}</td>
                      <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">{o.farmerName}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{o.buyerName}</td>
                      <td className="px-4 py-3 text-stone-600 hidden sm:table-cell whitespace-nowrap">{o.quantity} kg</td>
                      <td className="px-4 py-3 text-stone-600 hidden xl:table-cell">{o.district}</td>
                      <td className="px-4 py-3 text-stone-600 hidden xl:table-cell">
                        <div>{o.deliveryDistrict}</div>
                        <div className="text-xs text-stone-400 truncate max-w-[140px]" title={o.deliveryAddress}>
                          {o.deliveryAddress}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900 whitespace-nowrap">{formatRWF(o.total)}</td>
                      <td className="px-4 py-3 text-stone-600 hidden lg:table-cell whitespace-nowrap">
                        {o.transportPrice != null ? formatRWF(o.transportPrice) : '—'}
                      </td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                        {o.transporterName || '—'}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-stone-500">
                        {o.buyerConfirmedAt
                          ? new Date(o.buyerConfirmedAt).toLocaleString()
                          : o.status === 'Delivered'
                            ? 'Awaiting buyer'
                            : '—'}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <StatusBadge status={o.transportStatus} />
                        {trip && (
                          <div className="text-xs text-stone-400 mt-1">{trip.from} → {trip.to}</div>
                        )}
                        {!trip && job && (
                          <div className="text-xs text-stone-400 mt-1">{job.pickupDistrict} → {job.deliveryDistrict}</div>
                        )}
                        {listing && (
                          <div className="text-xs text-stone-400 mt-1">Listing: {listing.status}</div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
