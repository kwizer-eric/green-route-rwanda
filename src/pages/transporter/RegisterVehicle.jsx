import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { PageHeader, Button, Select, Input, Card } from '../../components/ui'
import { VEHICLE_TYPES, DISTRICTS } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function RegisterVehicle() {
  const { registerVehicle } = useApp()
  const [form, setForm] = useState({ type: '', capacity: '', plate: '', routes: [], availability: '' })
  const [success, setSuccess] = useState(false)

  const toggleRoute = (d) => {
    setForm(prev => ({
      ...prev,
      routes: prev.routes.includes(d) ? prev.routes.filter(r => r !== d) : [...prev.routes, d],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    registerVehicle(form.type, form.capacity, form.plate, form.routes, form.availability)
    setSuccess(true)
  }


  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900">Vehicle Registered</h2>
        <p className="text-stone-500 mt-2">Your vehicle is now visible for AI job matching.</p>
        <Button className="mt-8" onClick={() => setSuccess(false)}>Register Another</Button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Register Vehicle" description="Add your vehicle to receive matched transport jobs." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select label="Vehicle Type" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="">Select type</option>
            {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
          </Select>
          <Input label="Capacity (kg)" type="number" required placeholder="e.g. 5000" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
          <Input label="License Plate" required placeholder="e.g. RAD 234 A" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} />
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
