import { TrendingUp, Users, Leaf, Truck } from 'lucide-react'
import { PageHeader, Card } from '../../components/ui'
import { useApp } from '../../context/AppContext'

const icons = { trending: TrendingUp, users: Users, leaf: Leaf, truck: Truck }

export default function ImpactMetrics() {
  const { listings } = useApp()

  const deliveredCount = listings.filter(l => l.status === 'Delivered' || l.status === 'Completed').length

  const lossReduction = 23.4 + (deliveredCount * 0.1)
  const incomeIncrease = 18.7 + (deliveredCount * 0.08)
  const co2Saved = 1240 + (deliveredCount * 1.5)
  const emptyTrips = 31.2 + (deliveredCount * 0.12)

  const dynamicImpactMetrics = [
    { label: 'Post-Harvest Loss Reduction', value: `${lossReduction.toFixed(1)}%`, change: '+4.2%', icon: 'trending' },
    { label: 'Farmer Income Increase', value: `${incomeIncrease.toFixed(1)}%`, change: '+2.8%', icon: 'users' },
    { label: 'CO₂ Saved', value: `${co2Saved.toLocaleString()} tons`, change: '+156 tons', icon: 'leaf' },
    { label: 'Empty Trips Reduced', value: `${emptyTrips.toFixed(1)}%`, change: '+5.1%', icon: 'truck' },
  ]

  return (
    <div>
      <PageHeader title="Impact Metrics" description="Measuring GreenRoute's contribution to Rwanda's agricultural sector." />
      <div className="grid sm:grid-cols-2 gap-4">
        {dynamicImpactMetrics.map(m => {

          const Icon = icons[m.icon]
          return (
            <Card key={m.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-500">{m.label}</p>
                  <p className="text-3xl font-semibold text-stone-900 tracking-tight mt-2">{m.value}</p>
                  <p className="text-sm text-primary font-medium mt-2">{m.change}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <Card className="mt-6 p-8 text-center">
        <p className="text-stone-500 text-sm max-w-lg mx-auto leading-relaxed">
          Since launch, GreenRoute has facilitated over 12,000 successful deliveries across all 30 districts of Rwanda,
          directly contributing to reduced post-harvest losses and increased farmer incomes.
        </p>
      </Card>
    </div>
  )
}
