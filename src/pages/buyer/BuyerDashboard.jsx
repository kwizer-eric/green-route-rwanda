import { Package, ShoppingBag, CheckCircle, CreditCard } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import InsightCallout from '../../components/story/InsightCallout'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function BuyerDashboard() {
  const { listings, orders } = useApp()
  const { entityId: buyerId, fullName } = usePortalIdentity()

  const myOrders = orders.filter(o => o.buyerId === buyerId)
  const availableProduceCount = listings.filter(l => l.quantity > 0 && l.status !== 'Delivered').length
  const activeOrdersCount = myOrders.filter(o => !['Delivered', 'Completed'].includes(o.status)).length
  const deliveredOrdersCount = myOrders.filter(o => ['Delivered', 'Completed'].includes(o.status)).length
  const totalSpentValue = myOrders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div>
      <PageHeader
        title={`Welcome, ${fullName || 'Buyer'}`}
        description="Place orders with coordinated delivery — reliable supply, predictable timing."
      />
      <InsightCallout>
        Delayed logistics raises prices in Kigali. GreenRoute Rwanda connects your order to coordinated transport
        so produce arrives on schedule, not when a broker finds a truck.
      </InsightCallout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Produce" value={availableProduceCount} icon={Package} />
        <StatCard label="Active Orders" value={activeOrdersCount} icon={ShoppingBag} />
        <StatCard label="Delivered Orders" value={deliveredOrdersCount} icon={CheckCircle} />
        <StatCard label="Total Spent" value={formatRWF(totalSpentValue)} icon={CreditCard} />
      </div>
    </div>
  )
}
