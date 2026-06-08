import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Button, Select, Card } from '../../components/ui'
import { CROP_TYPES, DISTRICTS, formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'


function FreshnessDot({ level }) {
  const color = level === 'Excellent' ? 'bg-emerald-500' : 'bg-amber-400'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {level}
    </span>
  )
}

export default function BrowseProduce() {
  const { listings } = useApp()
  const navigate = useNavigate()
  const [crop, setCrop] = useState('')
  const [district, setDistrict] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filtered = useMemo(() => {
    return listings.filter(p => {
      if (crop && p.crop !== crop) return false
      if (district && p.district !== district) return false
      if (maxPrice && p.pricePerKg > Number(maxPrice)) return false
      return p.status !== 'Delivered'
    })
  }, [crop, district, maxPrice])

  return (
    <div>
      <PageHeader title="Browse Produce" description="Fresh agricultural produce from farmers across Rwanda." />
      <div className="flex flex-wrap gap-3 mb-8">
        <Select value={crop} onChange={e => setCrop(e.target.value)} className="w-auto min-w-[140px]">
          <option value="">All Crops</option>
          {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={district} onChange={e => setDistrict(e.target.value)} className="w-auto min-w-[140px]">
          <option value="">All Districts</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-auto min-w-[140px]">
          <option value="">Any Price</option>
          <option value="400">Under 400 RWF/kg</option>
          <option value="600">Under 600 RWF/kg</option>
          <option value="900">Under 900 RWF/kg</option>
        </Select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-stone-900">{p.crop}</h3>
                <p className="text-sm text-stone-500">{p.farmerName}</p>
              </div>
              <FreshnessDot level={p.freshness} />
            </div>
            <div className="space-y-1 text-sm text-stone-600 mb-4 flex-1">
              <p>{p.quantity.toLocaleString()} kg available</p>
              <p>{p.district} District</p>
              <p className="text-lg font-semibold text-stone-900 pt-1">{formatRWF(p.pricePerKg)}/kg</p>
            </div>
            <Button
              className="w-full"
              onClick={() => navigate('/buyer/order', { state: { produce: p } })}
            >
              Order Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
