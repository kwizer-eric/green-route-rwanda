import { useState } from 'react'
import { MapPin, Check } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIRecommendedBadge from '../../components/AIRecommendedBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { usePortalIdentity } from '../../context/AuthContext'

export default function AvailableJobs() {
  const { jobs, acceptJob } = useApp()
  const { entityId: transporterId } = usePortalIdentity()
  const [accepted, setAccepted] = useState(new Set())

  const availableJobs = jobs.filter(j => !j.transporterId)

  const handleAccept = async (jobId) => {
    await acceptJob(jobId, transporterId)
    setAccepted(prev => new Set([...prev, jobId]))
  }

  return (
    <div>
      <PageHeader
        title="Available Jobs"
        description="Accept coordinated loads on routes you serve — fill the truck instead of returning empty."
      />
      <div className="grid gap-4">
        {availableJobs.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-12">No open jobs right now. New loads appear when farmers match transport.</p>
        )}
        {availableJobs.map(job => (

          <Card key={job.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-stone-900">{job.crop}</h3>
                  <span className="text-sm text-stone-500">{job.quantity.toLocaleString()} kg</span>
                {job.aiOptimized && (
                  <span title="Route chosen by matching engine based on pickup district, capacity, and proximity">
                    <AIRecommendedBadge label="AI Optimized Route" />
                  </span>
                )}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <MapPin size={14} className="text-stone-400" />
                  {job.pickupDistrict} → {job.deliveryDistrict}
                  <span className="text-stone-300">·</span>
                  {job.distance} km
                </div>
                <p className="text-lg font-semibold text-stone-900">{formatRWF(job.price)}</p>
              </div>
              <Button
                variant={accepted.has(job.id) ? 'secondary' : 'primary'}
                disabled={accepted.has(job.id)}
                onClick={() => handleAccept(job.id)}
                className="shrink-0"
              >
                {accepted.has(job.id) ? <><Check size={16} /> Accepted</> : 'Accept Job'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
