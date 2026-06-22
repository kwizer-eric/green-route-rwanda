import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { explainMatch } from '../utils/aiMatching'
import { calculateTransportPrice, resolveProducePricePerKg } from '../utils/pricing'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const AppContext = createContext()

function mapListing(row, farmerName) {
  return {
    id: row.id,
    farmerId: row.farmer_id,
    farmerName: farmerName || '',
    crop: row.crop,
    quantity: Number(row.quantity),
    district: row.district,
    pricePerKg: Number(row.price_per_kg),
    availableDate: row.available_date,
    status: row.status,
    freshness: row.freshness,
    notes: row.notes || '',
    createdAt: row.created_at,
  }
}

function mapTransporter(row, name) {
  return {
    id: row.id,
    name: name || '',
    vehicleType: row.vehicle_type,
    capacity: Number(row.capacity),
    licensePlate: row.license_plate,
    routes: row.routes || [],
    lat: row.lat ?? -1.94,
    lng: row.lng ?? 30.06,
    rating: Number(row.rating),
    availability: row.availability,
    pricePerKm: Number(row.price_per_km ?? 120),
  }
}

function mapOrder(row, listing, farmerName) {
  return {
    id: row.id,
    buyerId: row.buyer_id,
    produceId: row.listing_id,
    crop: listing?.crop || '',
    farmerName: farmerName || '',
    quantity: Number(row.quantity),
    district: listing?.district || '',
    pricePerKg: listing ? Number(listing.price_per_kg) : 0,
    total: Number(row.total),
    status: row.status,
    deliveryAddress: row.delivery_address,
    deliveryDistrict: row.delivery_district,
    deliveryDate: row.delivery_date,
    payment: row.payment,
    createdAt: row.created_at,
  }
}

function mapJob(row) {
  return {
    id: row.id,
    listingId: row.listing_id,
    crop: row.crop,
    quantity: Number(row.quantity),
    pickupDistrict: row.pickup_district,
    deliveryDistrict: row.delivery_district,
    price: Number(row.price),
    distance: row.distance ? Number(row.distance) : null,
    transporterId: row.transporter_id,
    aiOptimized: row.ai_optimized,
    createdAt: row.created_at,
  }
}

function mapTrip(row) {
  return {
    id: row.id,
    transporterId: row.transporter_id,
    listingId: row.listing_id,
    jobId: row.job_id,
    crop: row.crop,
    quantity: Number(row.quantity),
    from: row.from_district,
    to: row.to_district,
    status: row.status,
    earnings: Number(row.earnings),
    date: row.trip_date,
    createdAt: row.created_at,
  }
}

export function AppContextProvider({ children }) {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [transporters, setTransporters] = useState([])
  const [orders, setOrders] = useState([])
  const [trips, setTrips] = useState([])
  const [jobs, setJobs] = useState([])
  const [unmatchedRequests, setUnmatchedRequests] = useState([])
  const [availableTransporters, setAvailableTransporters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMarketplace = useCallback(async () => {
    if (!user) {
      setListings([])
      setTransporters([])
      setOrders([])
      setTrips([])
      setJobs([])
      setUnmatchedRequests([])
      setAvailableTransporters([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [
        listingsRes,
        profilesRes,
        transporterProfilesRes,
        ordersRes,
        jobsRes,
        tripsRes,
      ] = await Promise.all([
        supabase.from('listings').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name'),
        supabase.from('transporter_profiles').select('*'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('transport_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('trips').select('*').order('created_at', { ascending: false }),
      ])

      const firstError = [listingsRes, profilesRes, transporterProfilesRes, ordersRes, jobsRes, tripsRes]
        .find(r => r.error)?.error
      if (firstError) throw firstError

      const nameById = Object.fromEntries(
        (profilesRes.data || []).map(p => [p.id, p.full_name])
      )
      const listingById = Object.fromEntries((listingsRes.data || []).map(l => [l.id, l]))

      const mappedListings = (listingsRes.data || []).map(l =>
        mapListing(l, nameById[l.farmer_id])
      )
      const mappedTransporters = (transporterProfilesRes.data || []).map(t =>
        mapTransporter(t, nameById[t.id])
      )
      const mappedJobs = (jobsRes.data || []).map(mapJob)
      const mappedTrips = (tripsRes.data || []).map(mapTrip)
      const mappedOrders = (ordersRes.data || []).map(o => {
        const listing = listingById[o.listing_id]
        return mapOrder(o, listing, listing ? nameById[listing.farmer_id] : '')
      })

      const matchedListingIds = new Set(
        mappedJobs.filter(j => j.transporterId).map(j => j.listingId)
      )
      const unmatched = mappedListings
        .filter(
          l =>
            !matchedListingIds.has(l.id) &&
            !['Delivered', 'Completed', 'Matched', 'In Transit'].includes(l.status)
        )
        .map(l => ({
          id: l.id,
          listingId: l.id,
          farmer: l.farmerName,
          crop: l.crop,
          quantity: l.quantity,
          district: l.district,
        }))

      const avail = mappedTransporters.map(t => ({
        id: t.id,
        name: t.name,
        vehicle: t.vehicleType,
        capacity: t.capacity,
        district: t.routes[0] || 'Kigali',
      }))

      setListings(mappedListings)
      setTransporters(mappedTransporters)
      setOrders(mappedOrders)
      setTrips(mappedTrips)
      setJobs(mappedJobs)
      setUnmatchedRequests(unmatched)
      setAvailableTransporters(avail)
    } catch (err) {
      console.error('[AppContext] loadMarketplace:', err)
      setError(err.message || 'Failed to load marketplace data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadMarketplace()
  }, [loadMarketplace])

  const addListing = async (crop, quantity, district, date, notes, pricePerKgInput) => {
    if (!user) throw new Error('Not signed in')

    const qty = Number(quantity)
    const pricePerKg = resolveProducePricePerKg(crop, pricePerKgInput)

    const { data: newListing, error: insertError } = await supabase.from('listings').insert({
      farmer_id: user.id,
      crop,
      quantity: qty,
      district,
      price_per_kg: pricePerKg,
      available_date: date || null,
      status: 'Pending',
      freshness: 'Excellent',
      notes: notes || '',
    }).select().single()
    if (insertError) throw insertError

    const matched = await tryAutoMatchListing(newListing.id, newListing)
    if (!matched) await loadMarketplace()
  }

  const listingHasTransport = async (listingId) => {
    const { data: job } = await supabase
      .from('transport_jobs')
      .select('id, transporter_id')
      .eq('listing_id', listingId)
      .maybeSingle()
    return Boolean(job?.transporter_id)
  }

  const listingHasOpenJob = async (listingId) => {
    const { data: job } = await supabase
      .from('transport_jobs')
      .select('id')
      .eq('listing_id', listingId)
      .is('transporter_id', null)
      .maybeSingle()
    return Boolean(job)
  }

  const transportQuoteForListing = async (listingId, listingOverride = null, transporterId = null) => {
    let listing = listingOverride
    if (!listing) {
      const { data } = await supabase.from('listings').select('*').eq('id', listingId).single()
      if (!data) throw new Error('Listing not found')
      listing = {
        district: data.district,
        quantity: Number(data.quantity),
      }
    }

    const { data: orderRow } = await supabase
      .from('orders')
      .select('delivery_district')
      .eq('listing_id', listingId)
      .limit(1)
      .maybeSingle()

    let pricePerKm
    if (transporterId) {
      const { data: tp } = await supabase
        .from('transporter_profiles')
        .select('price_per_km')
        .eq('id', transporterId)
        .maybeSingle()
      pricePerKm = tp?.price_per_km != null ? Number(tp.price_per_km) : undefined
    }

    return calculateTransportPrice({
      pickupDistrict: listing.district,
      deliveryDistrict: orderRow?.delivery_district || 'Kigali',
      quantityKg: listing.quantity,
      pricePerKm,
    })
  }

  const createOpenTransportJob = async (listingId) => {
    if (await listingHasTransport(listingId) || await listingHasOpenJob(listingId)) return

    const { data } = await supabase.from('listings').select('*').eq('id', listingId).single()
    if (!data) return

    const { price, distanceKm } = await transportQuoteForListing(listingId, {
      district: data.district,
      quantity: Number(data.quantity),
    })

    const { data: orderRow } = await supabase
      .from('orders')
      .select('delivery_district')
      .eq('listing_id', listingId)
      .limit(1)
      .maybeSingle()

    const deliveryDistrict = orderRow?.delivery_district || 'Kigali'

    await supabase.from('transport_jobs').insert({
      listing_id: listingId,
      crop: data.crop,
      quantity: data.quantity,
      pickup_district: data.district,
      delivery_district: deliveryDistrict,
      price,
      distance: distanceKm,
      transporter_id: null,
      ai_optimized: true,
    })
  }

  const tryAutoMatchListing = async (listingId, listingOverride = null, transporterId = null) => {
    if (await listingHasTransport(listingId)) return false

    let pickId = transporterId
    if (!pickId) {
      const { data: transporterRows } = await supabase.from('transporter_profiles').select('id')
      if (!transporterRows?.length) {
        await createOpenTransportJob(listingId)
        return false
      }
      pickId = transporterRows[Math.floor(Math.random() * transporterRows.length)].id
    }

    const { data: openJob } = await supabase
      .from('transport_jobs')
      .select('id, price')
      .eq('listing_id', listingId)
      .is('transporter_id', null)
      .maybeSingle()

    if (openJob) {
      await acceptJob(openJob.id, pickId)
      return true
    }

    const { price } = await transportQuoteForListing(listingId, listingOverride, pickId)
    await acceptMatch(listingId, pickId, price, listingOverride)
    return true
  }

  const registerVehicle = async (type, capacity, plate, routes, availability, pricePerKm) => {
    if (!user) throw new Error('Not signed in')

    const cap = Number(capacity)
    const perKm = Number(pricePerKm)
    if (!perKm || perKm <= 0) throw new Error('Enter a valid price per kilometer')
    const primaryDistrict = routes[0] || 'Kigali'
    const coords = {
      Kigali: { lat: -1.94, lng: 30.06 },
      Nyagatare: { lat: -1.32, lng: 30.28 },
      Musanze: { lat: -1.51, lng: 29.61 },
    }
    const coord = coords[primaryDistrict] || coords.Kigali

    const { error: upsertError } = await supabase.from('transporter_profiles').upsert({
      id: user.id,
      vehicle_type: type,
      capacity: cap,
      license_plate: plate,
      routes,
      lat: coord.lat,
      lng: coord.lng,
      rating: 5.0,
      availability: availability || null,
      price_per_km: perKm,
      updated_at: new Date().toISOString(),
    })
    if (upsertError) throw upsertError

    const { data: unassignedListings } = await supabase
      .from('listings')
      .select('id')
      .in('status', ['Pending', 'Processing'])

    for (const row of unassignedListings || []) {
      if (!(await listingHasTransport(row.id))) {
        await tryAutoMatchListing(row.id, null, user.id)
      }
    }

    if (!unassignedListings?.length) {
      await loadMarketplace()
    }
  }

  const placeOrder = async (produceId, quantity, address, deliveryDistrict, date, payment) => {
    if (!user) throw new Error('Not signed in')

    const listing = listings.find(l => l.id === produceId)
    if (!listing) throw new Error('Listing not found')

    const qty = Number(quantity)
    const total = qty * listing.pricePerKg
    const updatedQty = Math.max(0, listing.quantity - qty)
    const listingStatus = updatedQty === 0 ? 'Processing' : listing.status

    const { error: orderError } = await supabase.from('orders').insert({
      buyer_id: user.id,
      listing_id: produceId,
      quantity: qty,
      total,
      status: 'Processing',
      delivery_address: address,
      delivery_district: deliveryDistrict,
      delivery_date: date || null,
      payment,
    })
    if (orderError) throw orderError

    const { error: listingError } = await supabase
      .from('listings')
      .update({ quantity: updatedQty, status: listingStatus })
      .eq('id', produceId)
    if (listingError) throw listingError

    const matched = await tryAutoMatchListing(produceId)
    if (!matched) await loadMarketplace()
  }

  const acceptMatch = async (listingId, transporterId, price, listingOverride = null) => {
    let listing = listingOverride || listings.find(l => l.id === listingId)
    if (!listing) {
      const { data } = await supabase.from('listings').select('*').eq('id', listingId).single()
      if (!data) throw new Error('Listing not found')
      listing = {
        id: data.id,
        crop: data.crop,
        quantity: Number(data.quantity),
        district: data.district,
      }
    }

    const { data: orderRow } = await supabase
      .from('orders')
      .select('delivery_district')
      .eq('listing_id', listingId)
      .limit(1)
      .maybeSingle()
    const deliveryDistrict = orderRow?.delivery_district || 'Kigali'

    let transporterPerKm
    if (transporterId) {
      const { data: tp } = await supabase
        .from('transporter_profiles')
        .select('price_per_km')
        .eq('id', transporterId)
        .maybeSingle()
      if (tp?.price_per_km != null) transporterPerKm = Number(tp.price_per_km)
    }

    const quote = calculateTransportPrice({
      pickupDistrict: listing.district,
      deliveryDistrict,
      quantityKg: listing.quantity,
      pricePerKm: transporterPerKm,
    })
    const finalPrice = price ?? quote.price

    const { error: listingError } = await supabase
      .from('listings')
      .update({ status: 'Matched' })
      .eq('id', listingId)
    if (listingError) throw listingError

    const { data: job, error: jobError } = await supabase
      .from('transport_jobs')
      .insert({
        listing_id: listingId,
        crop: listing.crop,
        quantity: listing.quantity,
        pickup_district: listing.district,
        delivery_district: deliveryDistrict,
        price: finalPrice,
        distance: quote.distanceKm,
        transporter_id: transporterId,
        ai_optimized: true,
      })
      .select()
      .single()
    if (jobError) throw jobError

    const { error: tripError } = await supabase.from('trips').insert({
      transporter_id: transporterId,
      listing_id: listingId,
      job_id: job.id,
      crop: listing.crop,
      quantity: listing.quantity,
      from_district: listing.district,
      to_district: deliveryDistrict,
      status: 'Active',
      earnings: finalPrice,
      trip_date: new Date().toISOString().split('T')[0],
    })
    if (tripError) throw tripError

    await loadMarketplace()
  }

  const acceptJob = async (jobId, transporterId) => {
    let job = jobs.find(j => j.id === jobId)
    if (!job) {
      const { data } = await supabase.from('transport_jobs').select('*').eq('id', jobId).single()
      if (!data) throw new Error('Job not found')
      job = mapJob(data)
    }

    const { price, distanceKm } = await transportQuoteForListing(job.listingId, null, transporterId)

    const { error: jobError } = await supabase
      .from('transport_jobs')
      .update({ transporter_id: transporterId, price, distance: distanceKm })
      .eq('id', jobId)
    if (jobError) throw jobError

    const { error: listingError } = await supabase
      .from('listings')
      .update({ status: 'Matched' })
      .eq('id', job.listingId)
    if (listingError) throw listingError

    const { error: tripError } = await supabase.from('trips').insert({
      transporter_id: transporterId,
      listing_id: job.listingId,
      job_id: jobId,
      crop: job.crop,
      quantity: job.quantity,
      from_district: job.pickupDistrict,
      to_district: job.deliveryDistrict,
      status: 'Active',
      earnings: price,
      trip_date: new Date().toISOString().split('T')[0],
    })
    if (tripError) throw tripError

    await loadMarketplace()
  }

  const updateTripStatus = async (tripId, nextStatus) => {
    const trip = trips.find(t => t.id === tripId)
    if (!trip) return

    const { error: tripError } = await supabase
      .from('trips')
      .update({ status: nextStatus })
      .eq('id', tripId)
    if (tripError) throw tripError

    const mappingStatus =
      nextStatus === 'In Transit' ? 'In Transit' :
      nextStatus === 'Completed' ? 'Delivered' : nextStatus

    if (trip.listingId) {
      const { error: listingError } = await supabase
        .from('listings')
        .update({ status: mappingStatus })
        .eq('id', trip.listingId)
      if (listingError) throw listingError

      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: mappingStatus })
        .eq('listing_id', trip.listingId)
      if (orderError) throw orderError
    }

    await loadMarketplace()
  }

  const runAdminAutoMatching = async () => {
    if (unmatchedRequests.length === 0 || availableTransporters.length === 0) return []

    const pairs = []
    const unmatchedCopy = [...unmatchedRequests]
    const availableCopy = [...availableTransporters]

    for (const req of unmatchedCopy) {
      const trans = availableCopy[Math.floor(Math.random() * availableCopy.length)]
      const fullTransporter = transporters.find(t => t.id === trans.id) || trans
      const { factors, confidence, price } = explainMatch(req, fullTransporter)

      pairs.push({ request: req, transporter: trans, confidence, factors, price })

      const lId = req.listingId || req.id
      await acceptMatch(lId, trans.id, price)
    }

    return pairs
  }

  return (
    <AppContext.Provider
      value={{
        listings,
        transporters,
        orders,
        trips,
        jobs,
        unmatchedRequests,
        availableTransporters,
        loading,
        error,
        refresh: loadMarketplace,
        addListing,
        registerVehicle,
        placeOrder,
        acceptMatch,
        acceptJob,
        updateTripStatus,
        runAdminAutoMatching,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppContextProvider')
  }
  return context
}
