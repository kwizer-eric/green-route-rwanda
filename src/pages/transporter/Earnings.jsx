import { PageHeader, Card } from '../../components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { weeklyEarnings, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-stone-100 text-sm">
      <p className="font-semibold text-stone-900">{formatRWF(payload[0].value)}</p>
    </div>
  )
}

export default function Earnings() {
  const { trips } = useApp()

  // Dynamic calculations for Completed Trips earnings
  const completedTrips = trips.filter(t => t.transporterId === 't1' && t.status === 'Completed')
  
  // We want to count earnings from trips that aren't the original preloaded completed trips
  const originalCompletedTripIds = ['tr4', 'tr5', 'tr6']
  const newlyCompletedEarnings = completedTrips
    .filter(t => !originalCompletedTripIds.includes(t.id))
    .reduce((sum, t) => sum + t.earnings, 0)

  // Map and add newly completed earnings to the latest week (W6)
  const dynamicEarningsData = weeklyEarnings.map((item, idx) => {
    if (idx === weeklyEarnings.length - 1) {
      return { ...item, earnings: item.earnings + newlyCompletedEarnings }
    }
    return item
  })

  return (
    <div>
      <PageHeader title="Earnings" description="Weekly transport earnings overview." />
      <Card className="p-6">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={dynamicEarningsData} barSize={40}>

            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4' }} />
            <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
