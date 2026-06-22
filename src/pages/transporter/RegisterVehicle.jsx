import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { PageHeader, Button, Select, Input, NumericInput, Card } from '../../components/ui'
import { VEHICLE_TYPES, DISTRICTS } from '../../data/mockData'
import { DEFAULT_TRANSPORT_PER_KM_RWF } from '../../utils/pricing'
import { useApp } from '../../context/AppContext'

export default function RegisterVehicle() {
  const { registerVehicle } = useApp()
  const [form, setForm] = useState({
    type: '',
    capacity: '',
    plate: '',
    routes: [],
    availability: '',
    pricePerKm: String(DEFAULT_TRANSPORT_PER_KM_RWF),
  })
  const [success, setSuccess] = useState(false)

  const toggleRoute = (d) => {
    setForm(prev => ({
      ...prev,
      routes: prev.routes.includes(d) ? prev.routes.filter(r => r !== d) : [...prev.routes, d],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerVehicle(
        form.type,
        form.capacity,
        form.plate,
        form.routes,
        form.availability,
        form.pricePerKm,
      )
      setSuccess(true)
    } catch (err) {
      alert(err.message || 'Failed to register vehicle')
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900">Vehicle Registered</h2>
        <p className="text-stone-500 mt-2">Your rate is saved. Job quotes use your price per kilometer.</p>
        <Button className="mt-8" onClick={() => setSuccess(false)}>Update Vehicle</Button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Register Vehicle" description="Set your transport rate and routes to receive matched jobs." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select label="Vehicle Type" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="">Select type</option>
            {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
          </Select>
          <NumericInput label="Capacity (kg)" required placeholder="e.g. 5000" value={form.capacity} onChange={v => setForm({ ...form, capacity: v })} />
          <Input label="License Plate" required placeholder="e.g. RAD 234 A" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} />
          <div className="space-y-1.5">
            <NumericInput
              label="Price per kilometer (RWF)"
              required
              placeholder="e.g. 120"
              value={form.pricePerKm}
              onChange={v => setForm({ ...form, pricePerKm: v })}
            />
            <p className="text-xs text-stone-400">
              Used to quote jobs: 8,000 RWF base + (km × your rate) + load fee. Default reference: {DEFAULT_TRANSPORT_PER_KM_RWF} RWF/km.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Preferred Routes</label>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleRoute(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.routes.includes(d)
                      ? 'bg-primary text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Input label="Availability" type="date" required value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} />
          <Button type="submit">Register Vehicle</Button>
        </form>
      </Card>
    </div>
  )
}
