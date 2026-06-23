import { calculateTransportPrice } from './pricing'

function routeCoversDistrict(routes, district) {
  if (!routes?.length || !district) return false
  return routes.includes(district)
}

export function routeMatchesJob(job, transporter) {
  const pickup = job.pickupDistrict || job.district || 'Kigali'
  const delivery = job.deliveryDistrict || 'Kigali'
  const coversPickup = routeCoversDistrict(transporter.routes, pickup)
  const coversDelivery = routeCoversDistrict(transporter.routes, delivery)
  return coversPickup || coversDelivery
}

/** AI eligibility: preferred routes only (demo matching). */
export function isTransporterEligible(job, transporter) {
  return routeMatchesJob(job, transporter)
}

function scoreTransporter(job, transporter) {
  const pickup = job.pickupDistrict || job.district || 'Kigali'
  const delivery = job.deliveryDistrict || 'Kigali'
  const quantityKg = job.quantity || 0

  const { price, distanceKm } = calculateTransportPrice({
    pickupDistrict: pickup,
    deliveryDistrict: delivery,
    quantityKg,
    pricePerKm: transporter.pricePerKm,
  })

  const coversPickup = routeCoversDistrict(transporter.routes, pickup)
  const coversDelivery = routeCoversDistrict(transporter.routes, delivery)
  const confidence = coversPickup && coversDelivery ? 95 : coversPickup || coversDelivery ? 82 : 0

  const factors = []
  if (coversPickup && coversDelivery) {
    factors.push({ label: 'Route match', impact: '+95', detail: `Preferred route covers ${pickup} → ${delivery}` })
  } else if (coversPickup) {
    factors.push({ label: 'Route match', impact: '+82', detail: `Covers pickup district ${pickup}` })
  } else if (coversDelivery) {
    factors.push({ label: 'Route match', impact: '+82', detail: `Covers delivery district ${delivery}` })
  }

  return {
    ...transporter,
    confidence,
    factors,
    route: `${pickup} → ${delivery}`,
    price,
    distanceKm,
  }
}

export function rankTransportersForJob(job, transporterList, limit = 10) {
  if (!transporterList?.length) return []

  return transporterList
    .filter(t => routeMatchesJob(job, t))
    .map(t => scoreTransporter(job, t))
    .sort((a, b) => b.confidence - a.confidence || a.price - b.price)
    .slice(0, limit)
}

export function pickRandomTransporter(transporterList, job = null) {
  const ranked = rankTransportersForJob(
    job || { pickupDistrict: 'Kigali', deliveryDistrict: 'Kigali', quantity: 0 },
    transporterList,
    1,
  )
  if (ranked.length) return ranked[0]
  if (!transporterList?.length) return null
  return transporterList[0]
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
  return rankTransportersForJob(
    {
      pickupDistrict: produce.district || produce.pickupDistrict,
      deliveryDistrict: produce.deliveryDistrict || 'Kigali',
      quantity: produce.quantity || 0,
    },
    transporterList,
    limit,
  )
}

export function explainMatch(produce, transporter = null) {
  if (transporter?.routes) {
    const scored = scoreTransporter(
      {
        pickupDistrict: produce.district || produce.pickupDistrict || 'Kigali',
        deliveryDistrict: produce.deliveryDistrict || 'Kigali',
        quantity: produce.quantity || 0,
      },
      transporter,
    )
    return {
      factors: scored.factors,
      confidence: scored.confidence,
      price: scored.price,
      distanceKm: scored.distanceKm,
    }
  }

  const { price, distanceKm } = transportQuote(produce || {}, transporter)
  return {
    factors: [{
      label: 'Route quote',
      impact: '+80',
      detail: `${distanceKm} km · ${price.toLocaleString()} RWF transport fee`,
    }],
    confidence: 80,
    price,
    distanceKm,
  }
}

export function simulateAIProcessing(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function runAdminMatching(requests, transporterList = []) {
  const pairs = []
  if (!requests?.length || !transporterList?.length) return pairs

  requests.forEach(req => {
    const ranked = rankTransportersForJob(
      {
        pickupDistrict: req.district,
        deliveryDistrict: req.deliveryDistrict || 'Kigali',
        quantity: req.quantity,
      },
      transporterList,
      1,
    )
    if (!ranked.length) return

    const best = ranked[0]
    pairs.push({
      request: req,
      transporter: {
        id: best.id,
        name: best.name,
        vehicle: best.vehicleType,
        capacity: best.capacity,
        district: best.routes?.join(', ') || req.district,
      },
      confidence: best.confidence,
      factors: best.factors,
      price: best.price,
    })
  })

  return pairs
}

export const SAMPLE_MATCH = {
  confidence: 92,
  factors: [{ label: 'Route match', impact: '+95', detail: 'Preferred route covers pickup and delivery' }],
}
