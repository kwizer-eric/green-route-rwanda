import { useMemo } from 'react'
import { PageHeader, Card } from '../../components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-stone-100 text-sm">
      <p className="font-semibold text-stone-900">{formatRWF(payload[0].value)}</p>
    </div>
  )
}

function weekLabel(dateStr) {
  const d = new Date(dateStr)
  return `W${Math.ceil(d.getDate() / 7)}`
}

export default function Earnings() {
  const { trips } = useApp()
  const { entityId: transporterId } = usePortalIdentity()

  const dynamicEarningsData = useMemo(() => {
    const completed = trips.filter(t => t.transporterId === transporterId && t.status === 'Completed')
    const byWeek = {}
    completed.forEach(t => {
      const key = weekLabel(t.date || t.createdAt)
      byWeek[key] = (byWeek[key] || 0) + t.earnings
    })
    const weeks = Object.keys(byWeek)
    if (weeks.length === 0) {
      return [{ week: 'W1', earnings: 0 }]
    }
    return weeks.map(week => ({ week, earnings: byWeek[week] }))
  }, [trips, transporterId])

  return (
    <div>
      <PageHeader title="Earnings" description="Weekly transport earnings overview." />
      <Card className="p-6">
        {dynamicEarningsData.every(d => d.earnings === 0) ? (
          <p className="text-sm text-stone-400 text-center py-16">Complete trips to see earnings here.</p>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={dynamicEarningsData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4' }} />
              <Bar dataKey="earnings" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}
