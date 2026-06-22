import { calculateTransportPrice } from './pricing'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function pickRandomTransporter(transporterList) {
  if (!transporterList?.length) return null
  return transporterList[Math.floor(Math.random() * transporterList.length)]
}

export function transportQuote(produce, transporter = null) {
  const pickup = produce.district || produce.pickupDistrict || 'Kigali'
  const delivery = produce.deliveryDistrict || 'Kigali'
  const quantityKg = produce.quantity || 0
  return calculateTransportPrice({
    pickupDistrict: pickup,
    deliveryDistrict: delivery,
    quantityKg,
    pricePerKm: transporter?.pricePerKm,
  })
}

export function findBestTransporters(produce, transporterList, limit = 3) {
  if (!transporterList?.length) return []

  const district = produce.district || produce.pickupDistrict || 'Kigali'
  const delivery = produce.deliveryDistrict || 'Kigali'
  const quantityKg = produce.quantity || 0

  return shuffle(transporterList)
    .slice(0, Math.min(limit, transporterList.length))
    .map(t => {
      const { price, distanceKm } = calculateTransportPrice({
        pickupDistrict: district,
        deliveryDistrict: delivery,
        quantityKg,
        pricePerKm: t.pricePerKm,
      })
      return {
        ...t,
        confidence: 75 + Math.floor(Math.random() * 20),
        factors: [{
          label: 'Transporter rate',
          impact: '+20',
          detail: `${t.pricePerKm} RWF/km × ${distanceKm} km`,
        }],
        route: `${district} → ${delivery}`,
        price,
        distanceKm,
      }
    })
}

export function explainMatch(produce, transporter = null) {
  const { price, distanceKm, pricePerKm } = transportQuote(produce || {}, transporter)
  return {
    factors: [{
      label: 'Route-based quote',
      impact: '+20',
      detail: transporter
        ? `${pricePerKm} RWF/km · ${distanceKm} km · ${price.toLocaleString()} RWF`
        : `${distanceKm} km · ${price.toLocaleString()} RWF transport fee`,
    }],
    confidence: 80 + Math.floor(Math.random() * 15),
    price,
    distanceKm,
  }
}

export function simulateAIProcessing(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function runAdminMatching(requests, available, transporterList = []) {
  const pairs = []
  if (!requests?.length || !available?.length) return pairs

  requests.forEach(req => {
    const trans = available[Math.floor(Math.random() * available.length)]
    const full = transporterList.find(t => t.id === trans.id) || trans
    const { factors, confidence, price } = explainMatch(req, full.pricePerKm != null ? full : null)
    pairs.push({ request: req, transporter: trans, confidence, factors, price })
  })

  return pairs
}

export const SAMPLE_MATCH = {
  confidence: 92,
  factors: [{ label: 'Transporter rate', impact: '+20', detail: 'Based on registered RWF/km' }],
}
