import { transporters } from '../data/mockData'

const DISTRICT_PROXIMITY = {
  Kigali: ['Rwamagana', 'Muhanga', 'Kayonza', 'Ngoma'],
  Nyagatare: ['Gicumbi', 'Kayonza', 'Rwamagana'],
  Musanze: ['Gicumbi', 'Rubavu', 'Nyagatare'],
  Rwamagana: ['Kigali', 'Kayonza', 'Ngoma', 'Nyagatare'],
  Huye: ['Muhanga', 'Karongi', 'Ngoma'],
  Rubavu: ['Musanze', 'Karongi', 'Rusizi'],
  Gicumbi: ['Musanze', 'Nyagatare', 'Kayonza'],
  Karongi: ['Rubavu', 'Huye', 'Rusizi'],
  Muhanga: ['Kigali', 'Huye', 'Ngoma'],
  Ngoma: ['Rwamagana', 'Kayonza', 'Huye'],
  Kayonza: ['Rwamagana', 'Nyagatare', 'Kigali'],
  Rusizi: ['Rubavu', 'Karongi'],
}

function scoreMatch(produce, transporter) {
  let score = 60
  if (transporter.routes.includes(produce.district || produce.pickupDistrict)) score += 25
  const nearby = DISTRICT_PROXIMITY[produce.district || produce.pickupDistrict] || []
  if (transporter.routes.some(r => nearby.includes(r))) score += 10
  const qty = produce.quantity || 0
  if (transporter.capacity >= qty) score += 15
  else if (transporter.capacity >= qty * 0.5) score += 5
  return Math.min(score + Math.floor(Math.random() * 8), 98)
}

export function findBestTransporters(produce, limit = 3) {
  return transporters
    .map(t => ({
      ...t,
      confidence: scoreMatch(produce, t),
      route: `${produce.district || produce.pickupDistrict} → ${produce.deliveryDistrict || 'Kigali'}`,
      price: Math.floor(15000 + Math.random() * 70000),
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
}

export function simulateAIProcessing(ms = 1500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function runAdminMatching(requests, available) {
  const pairs = []
  const used = new Set()
  requests.forEach((req, i) => {
    const trans = available[i % available.length]
    if (!used.has(trans.id)) {
      pairs.push({
        request: req,
        transporter: trans,
        confidence: 85 + Math.floor(Math.random() * 14),
      })
      used.add(trans.id)
    }
  })
  return pairs
}
