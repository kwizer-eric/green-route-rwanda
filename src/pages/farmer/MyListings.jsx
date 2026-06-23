import { PageHeader } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function MyListings() {
  const { listings, orders } = useApp()
  const { entityId: farmerId } = usePortalIdentity()
  const myListings = listings.filter(l => l.farmerId === farmerId)
  const orderByListing = Object.fromEntries(orders.map(o => [o.produceId, o]))

  return (
    <div>
      <PageHeader
        title="My Listings"
        description="Track produce from listing to matched transport — each status reflects logistics progress."
      />
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-6 py-4 font-medium text-stone-500">Crop</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500">Quantity</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden sm:table-cell">District</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden md:table-cell">Price/kg</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden lg:table-cell">Date</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden md:table-cell">Buyer order</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map(l => {
                const order = orderByListing[l.id]
                return (
                <tr key={l.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-900">{l.crop}</td>
                  <td className="px-6 py-4 text-stone-600">{l.quantity.toLocaleString()} kg</td>
                  <td className="px-6 py-4 text-stone-600 hidden sm:table-cell">{l.district}</td>
                  <td className="px-6 py-4 text-stone-600 hidden md:table-cell">{formatRWF(l.pricePerKg)}</td>
                  <td className="px-6 py-4 text-stone-600 hidden lg:table-cell">{l.availableDate}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {order ? (
                      <div>
                        <div className="text-stone-700">{order.buyerName}</div>
                        <div className="text-xs text-stone-400">{order.quantity} kg · {order.transportStatus}</div>
                      </div>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={l.status} /></td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
