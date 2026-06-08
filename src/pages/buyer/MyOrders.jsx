import { PageHeader } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function MyOrders() {
  const { orders } = useApp()

  return (
    <div>
      <PageHeader title="My Orders" description="Track your order history and delivery status." />
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
                <th className="text-left px-6 py-4 font-medium text-stone-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-stone-400">{o.id.toUpperCase()}</td>
                  <td className="px-6 py-4 font-medium text-stone-900">{o.crop}</td>
                  <td className="px-6 py-4 text-stone-600 hidden sm:table-cell">{o.farmerName}</td>
                  <td className="px-6 py-4 text-stone-600 hidden md:table-cell">{o.quantity} kg</td>
                  <td className="px-6 py-4 text-stone-600 hidden lg:table-cell">{o.deliveryDate}</td>
                  <td className="px-6 py-4 font-medium text-stone-900">{formatRWF(o.total)}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
