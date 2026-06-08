import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { PageHeader } from '../../components/ui'
import { useApp } from '../../context/AppContext'

const farmerIcon = L.divIcon({
  className: '',
  html: '<div style="width:12px;height:12px;background:#16a34a;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

const transporterIcon = L.divIcon({
  className: '',
  html: '<div style="width:12px;height:12px;background:#3b82f6;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

const DISTRICT_COORDS = {
  Kigali: [-1.9403, 30.0619],
  Nyagatare: [-1.3000, 30.3200],
  Musanze: [-1.5000, 29.6300],
  Rwamagana: [-1.9500, 30.4300],
  Huye: [-2.5900, 29.7400],
  Rubavu: [-1.6900, 29.2600],
  Gicumbi: [-1.5800, 30.0700],
  Karongi: [-2.0600, 29.3500],
  Muhanga: [-2.0800, 29.7500],
  Ngoma: [-2.1800, 30.4800],
  Kayonza: [-1.9300, 30.5200],
  Rusizi: [-2.4800, 28.9000]
}

export default function LiveMap() {
  const { listings, transporters, trips } = useApp()

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
  }, [])

  // Dynamic Farmers based on active listings
  const activeFarmers = useMemo(() => {
    return listings.filter(l => l.status !== 'Delivered' && l.status !== 'Completed')
  }, [listings])

  // Dynamic Active Routes based on active trips
  const activeRoutes = useMemo(() => {
    return trips
      .filter(t => t.status === 'Active' || t.status === 'In Transit')
      .map(t => {
        const fromCoords = DISTRICT_COORDS[t.from] || DISTRICT_COORDS.Kigali
        const toCoords = DISTRICT_COORDS[t.to] || DISTRICT_COORDS.Kigali
        return {
          from: fromCoords,
          to: toCoords,
          label: `${t.crop}: ${t.from} → ${t.to}`,
        }
      })
  }, [trips])

  return (
    <div>
      <PageHeader title="Live Map" description="Real-time view of farmers, transporters, and active routes." />
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden relative">
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 text-xs space-y-1.5 shadow-sm border border-stone-100">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Farmers (Active listings)</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Transporters</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Active Routes</div>
        </div>
        <MapContainer center={[-1.9403, 29.8739]} zoom={8} className="h-[280px] sm:h-[400px] lg:h-[520px] w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activeFarmers.map((f, i) => {
            const coords = DISTRICT_COORDS[f.district] || DISTRICT_COORDS.Kigali
            return (
              <Marker key={f.id + i} position={coords} icon={farmerIcon}>
                <Popup>
                  <strong>{f.farmerName}</strong><br />
                  {f.crop} · {f.quantity} kg · {f.district}<br />
                  <span className="text-xs text-primary font-semibold">{f.status}</span>
                </Popup>
              </Marker>
            )
          })}
          {transporters.map(t => {
            const coords = [t.lat || -1.94, t.lng || 30.06]
            return (
              <Marker key={t.id} position={coords} icon={transporterIcon}>
                <Popup>
                  <strong>{t.name}</strong><br />
                  {t.vehicleType} · {t.capacity} kg<br />
                  <span className="text-xs text-stone-400">{t.licensePlate}</span>
                </Popup>
              </Marker>
            )
          })}
          {activeRoutes.map((route, i) => (
            <Polyline
              key={i}
              positions={[route.from, route.to]}
              pathOptions={{ color: '#f97316', weight: 3, opacity: 0.7, dashArray: '8 4' }}
            />
          ))}
          {activeRoutes.map((route, i) => (
            <CircleMarker
              key={`ep-${i}`}
              center={route.to}
              radius={4}
              pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.8 }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
