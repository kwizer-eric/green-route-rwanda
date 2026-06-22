import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { PageHeader, Button, Input, NumericInput, Select, Card } from '../../components/ui'
import { formatRWF, DISTRICTS } from '../../data/mockData'
import { calculateTransportPrice } from '../../utils/pricing'
import { useApp } from '../../context/AppContext'

export default function PlaceOrder() {
  const { placeOrder } = useApp()
  const { state } = useLocation()
  const navigate = useNavigate()
  const produce = state?.produce
  const [form, setForm] = useState({ quantity: '', address: '', district: 'Kigali', date: '', payment: 'Mobile Money' })
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!produce) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500 mb-4">No produce selected.</p>
        <Button onClick={() => navigate('/buyer/browse')}>Browse Produce</Button>
      </div>
    )
  }

  const qty = form.quantity ? Number(form.quantity) : 0
  const produceTotal = qty * produce.pricePerKg
  const transportEst = qty > 0
    ? calculateTransportPrice({
        pickupDistrict: produce.district,
        deliveryDistrict: form.district,
        quantityKg: qty,
      })
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const qty = Number(form.quantity)
    if (qty > produce.quantity) {
      alert(`Maximum available is ${produce.quantity} kg`)
      return
    }
    setSubmitting(true)
    try {
      await placeOrder(produce.id, form.quantity, form.address, form.district, form.date, form.payment)
      setSuccess(true)
    } catch (err) {
      alert(err.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900">Order Placed</h2>
        <p className="text-stone-500 mt-2">Your order for {produce.crop} is being processed.</p>
        <Button className="mt-8" onClick={() => navigate('/buyer/orders')}>View Orders</Button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Place Order" description={`Ordering ${produce.crop} from ${produce.farmerName}`} />
      <Card className="max-w-2xl p-6 sm:p-8">
        <div className="bg-stone-50 rounded-xl p-4 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Available</span>
            <span className="font-medium">{produce.quantity.toLocaleString()} kg</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-stone-500">Price</span>
            <span className="font-medium">{formatRWF(produce.pricePerKg)}/kg</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <NumericInput label="Quantity (kg)" required placeholder={`Max ${produce.quantity}`} value={form.quantity} onChange={v => setForm({ ...form, quantity: v })} />
          <Input label="Delivery Address" required placeholder="Street, district, city" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <Select label="Delivery District" required value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Input label="Preferred Delivery Date" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Select label="Payment Method" value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value })}>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </Select>
          {qty > 0 && (
            <div className="pt-4 border-t border-stone-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Produce subtotal</span>
                <span className="font-medium text-stone-900">{formatRWF(produceTotal)}</span>
              </div>
              {transportEst && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Est. transport ({transportEst.distanceKm} km)</span>
                  <span className="font-medium text-stone-700">{formatRWF(transportEst.price)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-stone-700">Produce total (due at order)</span>
                <span className="text-xl font-semibold text-stone-900">{formatRWF(produceTotal)}</span>
              </div>
              <p className="text-xs text-stone-400">Transport is quoted separately and paid to the transporter on delivery.</p>
            </div>
          )}
          <Button type="submit" disabled={submitting}>{submitting ? 'Placing order…' : 'Confirm Order'}</Button>
        </form>
      </Card>
    </div>
  )
}
