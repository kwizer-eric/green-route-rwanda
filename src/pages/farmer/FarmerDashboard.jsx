import { LayoutDashboard, Package, List, Truck } from 'lucide-react'
import { PageHeader, StatCard } from '../../components/ui'
import InsightCallout from '../../components/story/InsightCallout'
import { farmerDashboard, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function FarmerDashboard() {
  const { listings } = useApp()
  const { entityId: farmerId, fullName } = usePortalIdentity()

  const myListings = listings.filter(l => l.farmerId === farmerId)

  const activeCount = myListings.filter(l => l.status === 'Pending' || l.status === 'Matched' || l.status === 'In Transit').length
  const pendingCount = myListings.filter(l => l.status === 'Matched' || l.status === 'In Transit').length
  
  // Count of delivered listings
  const deliveredListings = myListings.filter(l => l.status === 'Delivered' || l.status === 'Completed')
  const completedCount = farmerDashboard.completedDeliveries + deliveredListings.length

  // Dynamically calculate new earnings from delivered produce
  const newEarnings = deliveredListings.reduce((acc, l) => acc + (l.quantity * l.pricePerKg), 0)
  const totalEarnings = farmerDashboard.estimatedEarnings + newEarnings

  return (
    <div>
      <PageHeader
        title={`Welcome, ${fullName || farmerDashboard.name}`}
        description="Turn harvest into market access without waiting for informal brokers."
      />
      <InsightCallout>
        Up to 37% of Sub-Saharan produce is lost in transit. GreenRoute matches your harvest with transport
        capacity so goods reach market before they spoil.
      </InsightCallout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Listings" value={activeCount} icon={Package} />
        <StatCard label="Pending Pickups" value={pendingCount} icon={Truck} />
        <StatCard label="Completed Deliveries" value={completedCount} icon={List} />
        <StatCard label="Estimated Earnings" value={formatRWF(totalEarnings)} icon={LayoutDashboard} />
      </div>
      <div className="mt-8 bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="text-sm font-semibold text-stone-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {listings.filter(l => l.farmerId === farmerId).slice(0, 3).map((l, idx) => {
            let activityText = `Produce listing for ${l.crop} (${l.quantity} kg) is ${l.status.toLowerCase()}`
            if (l.status === 'Matched') {
              activityText = `${l.crop} listing matched with a transporter`
            } else if (l.status === 'In Transit') {
              activityText = `${l.crop} is currently in transit`
            } else if (l.status === 'Delivered' || l.status === 'Completed') {
              activityText = `${l.crop} delivery completed successfully`
            }
            return (
              <div key={l.id + idx} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                <p className="text-sm text-stone-700">{activityText}</p>
                <span className="text-xs text-stone-400 whitespace-nowrap ml-4">Just now</span>
              </div>
            )
          })}
          {listings.filter(l => l.farmerId === farmerId).length === 0 && (
            <p className="text-sm text-stone-400">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

