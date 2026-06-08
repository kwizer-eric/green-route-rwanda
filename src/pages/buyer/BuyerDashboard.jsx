import { Package, ShoppingBag, CheckCircle, CreditCard } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import { buyerDashboard, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function BuyerDashboard() {
  const { listings, orders } = useApp()

  const myOrders = orders.filter(o => o.buyerId === 'b1')
  
  const availableProduceCount = 840 + listings.filter(l => l.quantity > 0 && l.status !== 'Delivered').length
  const activeOrdersCount = myOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Completed').length
  const deliveredOrdersCount = myOrders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length
  
  const totalSpentValue = myOrders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div>
      <PageHeader title={buyerDashboard.name} description="Wholesale · Kigali District" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Produce" value={availableProduceCount} icon={Package} />
        <StatCard label="Active Orders" value={activeOrdersCount} icon={ShoppingBag} />
        <StatCard label="Delivered Orders" value={deliveredOrdersCount} icon={CheckCircle} />
        <StatCard label="Total Spent" value={formatRWF(totalSpentValue)} icon={CreditCard} />
      </div>
    </div>
  )
}

