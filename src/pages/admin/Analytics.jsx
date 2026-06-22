import { useMemo } from 'react'
import { PageHeader, Card } from '../../components/ui'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { REVENUE_COLORS, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function Analytics() {
  const { listings, orders } = useApp()

  const monthlyTransactions = useMemo(() => {
    const byMonth = {}
    orders.forEach(o => {
      if (!o.createdAt) return
      const month = new Date(o.createdAt).toLocaleString('en', { month: 'short' })
      byMonth[month] = (byMonth[month] || 0) + 1
    })
    const entries = Object.entries(byMonth).map(([month, transactions]) => ({ month, transactions }))
    return entries.length > 0 ? entries : [{ month: '—', transactions: 0 }]
  }, [orders])

  const dynamicCropVolume = useMemo(() => {
    const cropMap = {}
    listings.forEach(l => {
      cropMap[l.crop] = (cropMap[l.crop] || 0) + l.quantity / 1000
    })
    return Object.keys(cropMap).map(crop => ({
      crop,
      volume: parseFloat(cropMap[crop].toFixed(1)),
    }))
  }, [listings])

  const dynamicRevenueStreams = useMemo(() => {
    const commissions = orders.reduce((sum, o) => sum + o.total * 0.05, 0)
    if (commissions === 0) {
      return [{ name: 'Transaction Commissions', amount: 0, value: 100 }]
    }
    return [{ name: 'Transaction Commissions', amount: commissions, value: 100 }]
  }, [orders])

  const hasCropData = dynamicCropVolume.length > 0

  return (
    <div>
      <PageHeader title="Analytics" description="Platform performance and revenue insights." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6 overflow-hidden">
          <h3 className="text-sm font-semibold text-stone-900 mb-4 sm:mb-6">Orders by Month</h3>
          <div className="w-full h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTransactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f5f5f4', fontSize: 13 }} />
                <Line type="monotone" dataKey="transactions" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 overflow-hidden">
          <h3 className="text-sm font-semibold text-stone-900 mb-4 sm:mb-6">Crop Volume (tons)</h3>
          <div className="w-full h-[220px] sm:h-[280px]">
            {hasCropData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicCropVolume} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                  <YAxis type="category" dataKey="crop" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f5f5f4', fontSize: 13 }} />
                  <Bar dataKey="volume" fill="#16a34a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-stone-400 flex items-center justify-center h-full">No listing data yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 lg:col-span-2 overflow-hidden">
          <h3 className="text-sm font-semibold text-stone-900 mb-4 sm:mb-6">Revenue by Stream</h3>
          <div className="w-full h-[260px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicRevenueStreams}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {dynamicRevenueStreams.map((_, i) => (
                    <Cell key={i} fill={REVENUE_COLORS[i % REVENUE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [formatRWF(props.payload.amount), name]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #f5f5f4', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
