import { useMemo } from 'react'
import { PageHeader, Card } from '../../components/ui'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { monthlyTransactions, cropVolume, revenueStreams, REVENUE_COLORS, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function Analytics() {
  const { listings, orders } = useApp()

  // Calculate dynamic crop volume
  const dynamicCropVolume = useMemo(() => {
    const cropMap = {
      Maize: 4200, Beans: 2800, Potatoes: 3100, Coffee: 1200, Vegetables: 1900, Rice: 1600, Fruits: 1400, Sorghum: 980
    }
    
    // Add any new listings that are not part of the baseline mock data
    const baselineIds = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5', 'pl6', 'pl7', 'pl8']
    listings.forEach(l => {
      if (!baselineIds.includes(l.id)) {
        if (cropMap[l.crop] !== undefined) {
          cropMap[l.crop] += l.quantity / 1000 // Convert kg to tons
        } else {
          cropMap[l.crop] = l.quantity / 1000
        }
      }
    })

    return Object.keys(cropMap).map(crop => ({
      crop,
      volume: parseFloat(cropMap[crop].toFixed(1))
    }))
  }, [listings])

  // Calculate dynamic revenue streams
  const dynamicRevenueStreams = useMemo(() => {
    const commissionsBase = 17997000
    const newOrdersTotal = orders
      .filter(o => !['o1', 'o2', 'o3', 'o4', 'o5'].includes(o.id))
      .reduce((sum, o) => sum + o.total, 0)
    
    // Add 5% commission of new transactions to platform revenue
    const dynamicCommissions = commissionsBase + (newOrdersTotal * 0.05)

    const streams = [
      { name: 'Transaction Commissions', amount: dynamicCommissions },
      { name: 'Subscriptions', amount: 9427000 },
      { name: 'Buyer Fees', amount: 7713000 },
      { name: 'Data Services', amount: 5142000 },
      { name: 'Grants', amount: 2571000 },
    ]

    const totalAll = streams.reduce((sum, s) => sum + s.amount, 0)
    return streams.map(s => ({
      name: s.name,
      amount: s.amount,
      value: parseFloat(((s.amount / totalAll) * 100).toFixed(1))
    }))
  }, [orders])

  return (
    <div>
      <PageHeader title="Analytics" description="Platform performance and revenue insights." />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6 overflow-hidden">
          <h3 className="text-sm font-semibold text-stone-900 mb-4 sm:mb-6">Monthly Transactions (2026)</h3>
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
          <h3 className="text-sm font-semibold text-stone-900 mb-4 sm:mb-6">Top Crops by Volume (tons)</h3>
          <div className="w-full h-[220px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dynamicCropVolume} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
              <YAxis type="category" dataKey="crop" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f5f5f4', fontSize: 13 }} />
              <Bar dataKey="volume" fill="#16a34a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
