import { useState } from 'react'
import { PageHeader, Button } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function MyOrders() {
  const { orders, confirmDelivery } = useApp()
  const { entityId: buyerId } = usePortalIdentity()
  const [confirmingId, setConfirmingId] = useState(null)
  const [error, setError] = useState(null)
  const myOrders = orders.filter(o => o.buyerId === buyerId)

  const handleConfirm = async (orderId) => {
    setError(null)
    setConfirmingId(orderId)
    try {
      await confirmDelivery(orderId)
    } catch (err) {
      setError(err.message || 'Could not confirm delivery')
    } finally {
      setConfirmingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="My Orders"
        description="Track orders and confirm delivery once goods arrive."
      />
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-6 py-4 font-medium text-stone-500">Order</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500">Crop</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden sm:table-cell">Farmer</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden md:table-cell">Qty</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden lg:table-cell">Delivery</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500">Total</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500">Order</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500 hidden lg:table-cell">Transport</th>
                <th className="text-left px-6 py-4 font-medium text-stone-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-stone-400">No orders yet.</td>
                </tr>
              ) : myOrders.map(o => (
                <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-stone-400">{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-medium text-stone-900">{o.crop}</td>
                  <td className="px-6 py-4 text-stone-600 hidden sm:table-cell">{o.farmerName}</td>
                  <td className="px-6 py-4 text-stone-600 hidden md:table-cell">{o.quantity} kg</td>
                  <td className="px-6 py-4 text-stone-600 hidden lg:table-cell">{o.deliveryDate}</td>
                  <td className="px-6 py-4 font-medium text-stone-900">{formatRWF(o.total)}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <StatusBadge status={o.transportStatus} />
                    {o.transporterName && (
                      <div className="text-xs text-stone-400 mt-1">{o.transporterName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {o.status === 'Delivered' ? (
                      <Button
                        variant="primary"
                        className="text-xs py-1.5"
                        disabled={confirmingId === o.id}
                        onClick={() => handleConfirm(o.id)}
                      >
                        {confirmingId === o.id ? 'Confirming...' : 'Confirm Delivery'}
                      </Button>
                    ) : o.status === 'Completed' ? (
                      <span className="text-xs text-emerald-600 font-medium">Confirmed</span>
                    ) : (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
