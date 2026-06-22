import { useState, useMemo } from 'react'
import { CheckCircle } from 'lucide-react'
import { PageHeader, Button, Select, Input, NumericInput, Textarea, Card } from '../../components/ui'
import AIProcessingOverlay from '../../components/AIProcessingOverlay'
import { CROP_TYPES, DISTRICTS, cropPricePerKg, formatRWF } from '../../data/mockData'
import { simulateAIProcessing } from '../../utils/aiMatching'
import { useApp } from '../../context/AppContext'

export default function ListProduce() {
  const { addListing } = useApp()
  const [form, setForm] = useState({ crop: '', quantity: '', district: '', date: '', notes: '', pricePerKg: '' })
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const suggestedPrice = form.crop ? cropPricePerKg(form.crop) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    await simulateAIProcessing(800)
    try {
      await addListing(form.crop, form.quantity, form.district, form.date, form.notes, form.pricePerKg)
      setSuccess(true)
    } catch (err) {
      alert(err.message || 'Failed to list produce')
    } finally {
      setProcessing(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900">Produce Listed Successfully</h2>
        <p className="text-stone-500 mt-2">Your listing is live. If a transporter is registered, matching runs automatically.</p>
        <Button className="mt-8" onClick={() => { setSuccess(false); setForm({ crop: '', quantity: '', district: '', date: '', notes: '', pricePerKg: '' }) }}>
          List Another
        </Button>
      </div>
    )
  }

  return (
    <div>
      {processing && <AIProcessingOverlay message="AI Matching in progress..." />}
      <PageHeader title="List Produce" description="Set your price and list harvest for coordinated transport." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Crop Type"
            required
            value={form.crop}
            onChange={e => {
              const crop = e.target.value
              setForm(prev => ({
                ...prev,
                crop,
                pricePerKg: prev.pricePerKg || (crop ? String(cropPricePerKg(crop)) : ''),
              }))
            }}
          >
            <option value="">Select crop</option>
            {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <NumericInput label="Quantity (kg)" required placeholder="e.g. 1500" value={form.quantity} onChange={v => setForm({ ...form, quantity: v })} />
          <div className="space-y-1.5">
            <NumericInput
              label="Price per kg (RWF)"
              required
              placeholder={suggestedPrice ? String(suggestedPrice) : 'e.g. 450'}
              value={form.pricePerKg}
              onChange={v => setForm({ ...form, pricePerKg: v })}
            />
            {suggestedPrice && (
              <p className="text-xs text-stone-400">Market reference for {form.crop}: {formatRWF(suggestedPrice)}/kg</p>
            )}
          </div>
          <Select label="Pickup Location" required value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>
            <option value="">Select district</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Input label="Available Date" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Textarea label="Notes" placeholder="Grade, variety, special handling..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" className="w-full sm:w-auto">Submit Listing</Button>
        </form>
      </Card>
    </div>
  )
}
