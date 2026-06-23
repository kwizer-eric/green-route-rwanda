import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { PageHeader, Button } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

const tabs = [
  { id: 'farmers', label: 'Farmers' },
  { id: 'buyers', label: 'Buyers' },
  { id: 'transporters', label: 'Transporters' },
  { id: 'listings', label: 'Listings' },
  { id: 'orders', label: 'Orders' },
]

export default function PlatformDirectory() {
  const { farmers, buyers, transporters, listings, orders, loading, refresh } = useApp()
  const [tab, setTab] = useState('farmers')

  const farmerListings = (farmerId) => listings.filter(l => l.farmerId === farmerId)
  const buyerOrders = (buyerId) => orders.filter(o => o.buyerId === buyerId)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Platform Directory"
          description="All farmers, buyers, transporters, listed products, and orders on the platform."
        />
        <Button variant="secondary" onClick={refresh} disabled={loading} className="shrink-0 self-start">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-primary text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'farmers' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Listings</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Active crops</th>
                </tr>
              </thead>
              <tbody>
                {farmers.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-stone-400">No farmers registered.</td></tr>
                ) : farmers.map(f => {
                  const mine = farmerListings(f.id)
                  return (
                    <tr key={f.id} className="border-b border-stone-50">
                      <td className="px-4 py-3 font-medium text-stone-900">{f.fullName}</td>
                      <td className="px-4 py-3 text-stone-600">{mine.length}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                        {mine.length ? mine.map(l => `${l.crop} (${l.quantity} kg)`).join(', ') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {tab === 'buyers' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Orders</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Recent</th>
                </tr>
              </thead>
              <tbody>
                {buyers.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-stone-400">No buyers registered.</td></tr>
                ) : buyers.map(b => {
                  const mine = buyerOrders(b.id)
                  return (
                    <tr key={b.id} className="border-b border-stone-50">
                      <td className="px-4 py-3 font-medium text-stone-900">{b.fullName}</td>
                      <td className="px-4 py-3 text-stone-600">{mine.length}</td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                        {mine.length ? mine.slice(0, 3).map(o => `${o.crop} · ${o.status}`).join(' · ') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {tab === 'transporters' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden sm:table-cell">Capacity</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Routes</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Rate/km</th>
                </tr>
              </thead>
              <tbody>
                {transporters.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-stone-400">No transporters registered.</td></tr>
                ) : transporters.map(t => (
                  <tr key={t.id} className="border-b border-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{t.name}</td>
                    <td className="px-4 py-3 text-stone-600">{t.vehicleType} · {t.licensePlate}</td>
                    <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{t.capacity.toLocaleString()} kg</td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{t.routes?.join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">{t.pricePerKm} RWF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'listings' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Crop</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Farmer</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Qty</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden sm:table-cell">District</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Price/kg</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-stone-400">No listings yet.</td></tr>
                ) : listings.map(l => (
                  <tr key={l.id} className="border-b border-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{l.crop}</td>
                    <td className="px-4 py-3 text-stone-600">{l.farmerName}</td>
                    <td className="px-4 py-3 text-stone-600">{l.quantity.toLocaleString()} kg</td>
                    <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{l.district}</td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{formatRWF(l.pricePerKg)}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'orders' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Crop</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Buyer</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden sm:table-cell">Farmer</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Qty</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Delivery</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Transport</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-stone-400">No orders yet.</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} className="border-b border-stone-50 align-top">
                    <td className="px-4 py-3 font-medium text-stone-900">{o.crop}</td>
                    <td className="px-4 py-3 text-stone-600">{o.buyerName}</td>
                    <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{o.farmerName}</td>
                    <td className="px-4 py-3 text-stone-600">{o.quantity} kg</td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                      <div>{o.deliveryDistrict}</div>
                      <div className="text-xs text-stone-400 truncate max-w-[160px]" title={o.deliveryAddress}>{o.deliveryAddress}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">{formatRWF(o.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <StatusBadge status={o.transportStatus} />
                      {o.transporterName && <div className="text-xs text-stone-400 mt-1">{o.transporterName}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
