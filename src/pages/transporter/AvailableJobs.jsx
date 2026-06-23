import { useMemo, useState } from 'react'
import { MapPin, User, Calendar, CreditCard } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIRecommendedBadge from '../../components/AIRecommendedBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function AvailableJobs() {
  const { jobs, acceptJob } = useApp()
  const { entityId: transporterId } = usePortalIdentity()
  const [acceptingJobId, setAcceptingJobId] = useState(null)
  const [error, setError] = useState(null)

  const availableJobs = useMemo(() => {
    return jobs
      .filter(j => !j.transporterId)
      .sort((a, b) => {
        const aRecommended = a.recommendedTransporterId === transporterId ? 1 : 0
        const bRecommended = b.recommendedTransporterId === transporterId ? 1 : 0
        if (bRecommended !== aRecommended) return bRecommended - aRecommended
        return (b.matchScore || 0) - (a.matchScore || 0)
      })
  }, [jobs, transporterId])

  const handleAccept = async (jobId) => {
    setError(null)
    setAcceptingJobId(jobId)
    try {
      await acceptJob(jobId, transporterId)
    } catch (err) {
      setError(err.message || 'Could not accept job')
    } finally {
      setAcceptingJobId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Available Jobs"
        description="All open transport jobs with full route and delivery details. AI highlights route matches on your preferred districts."
      />
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}
      <div className="grid gap-4">
        {availableJobs.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-12">No open jobs right now. Jobs appear when buyers place orders on farmer listings.</p>
        )}
        {availableJobs.map(job => {
          const routeFit = job.matchScore != null
          return (
            <Card key={job.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-stone-900 text-lg">{job.crop}</h3>
                    <span className="text-sm text-stone-500">{job.quantity.toLocaleString()} kg</span>
                    {job.recommendedTransporterId === transporterId && (
                      <AIRecommendedBadge label="AI Route Match For You" />
                    )}
                    {routeFit && job.recommendedTransporterId !== transporterId && (
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                        {job.matchScore}% route fit
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2 p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Pickup</p>
                      <div className="flex items-center gap-2 text-stone-800">
                        <MapPin size={14} className="text-stone-400 shrink-0" />
                        {job.pickupDistrict}
                      </div>
                      {job.farmerName && (
                        <div className="flex items-center gap-2 text-stone-600">
                          <User size={14} className="text-stone-400 shrink-0" />
                          Farmer: {job.farmerName}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Delivery</p>
                      <div className="flex items-center gap-2 text-stone-800">
                        <MapPin size={14} className="text-stone-400 shrink-0" />
                        {job.deliveryDistrict}
                      </div>
                      {job.deliveryAddress && (
                        <p className="text-stone-600 text-xs leading-relaxed">{job.deliveryAddress}</p>
                      )}
                      {job.buyerName && (
                        <div className="flex items-center gap-2 text-stone-600">
                          <User size={14} className="text-stone-400 shrink-0" />
                          Buyer: {job.buyerName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-stone-400" />
                      {job.pickupDistrict} → {job.deliveryDistrict}
                    </span>
                    <span>{job.distance} km</span>
                    {job.deliveryDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-stone-400" />
                        {job.deliveryDate}
                      </span>
                    )}
                    {job.paymentMethod && (
                      <span className="flex items-center gap-1.5">
                        <CreditCard size={14} className="text-stone-400" />
                        {job.paymentMethod}
                      </span>
                    )}
                  </div>

                  <p className="text-xl font-semibold text-stone-900">{formatRWF(job.price)}</p>
                </div>

                <Button
                  variant="primary"
                  disabled={acceptingJobId === job.id}
                  onClick={() => handleAccept(job.id)}
                  className="shrink-0 w-full lg:w-auto"
                >
                  {acceptingJobId === job.id ? 'Accepting...' : 'Accept Job'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
