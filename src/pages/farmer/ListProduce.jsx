import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { PageHeader, Button, Select, Input, Textarea, Card } from '../../components/ui'
import AIProcessingOverlay from '../../components/AIProcessingOverlay'
import { CROP_TYPES, DISTRICTS } from '../../data/mockData'
import { simulateAIProcessing } from '../../utils/aiMatching'
import { useApp } from '../../context/AppContext'

export default function ListProduce() {
  const { addListing } = useApp()
  const [form, setForm] = useState({ crop: '', quantity: '', district: '', date: '', notes: '' })
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    await simulateAIProcessing(1800)
    try {
      await addListing(form.crop, form.quantity, form.district, form.date, form.notes)
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
        <p className="text-stone-500 mt-2">AI matching is finding the best transporters for your shipment.</p>
        <Button className="mt-8" onClick={() => { setSuccess(false); setForm({ crop: '', quantity: '', district: '', date: '', notes: '' }) }}>
          List Another
        </Button>
      </div>
    )
  }

  return (
    <div>
      {processing && <AIProcessingOverlay message="AI Matching in progress..." />}
      <PageHeader title="List Produce" description="Add your harvest to the marketplace for AI-powered transport matching." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select label="Crop Type" required value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })}>
            <option value="">Select crop</option>
            {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Quantity (kg)" type="number" required placeholder="e.g. 1500" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
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
