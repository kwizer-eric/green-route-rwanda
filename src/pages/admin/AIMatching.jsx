import { useState } from 'react'
import { Brain, ArrowRight } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIProcessingOverlay from '../../components/AIProcessingOverlay'
import MatchExplanationCard from '../../components/story/MatchExplanationCard'
import { simulateAIProcessing } from '../../utils/aiMatching'
import { useApp } from '../../context/AppContext'

export default function AIMatching() {
  const { unmatchedRequests, availableTransporters, runAdminAutoMatching } = useApp()
  const [processing, setProcessing] = useState(false)
  const [matches, setMatches] = useState([])

  const handleMatch = async () => {
    setProcessing(true)
    setMatches([])
    await simulateAIProcessing(1000)
    const results = await runAdminAutoMatching()
    setMatches(results)
    setProcessing(false)
  }

  return (
    <div>
      {processing && <AIProcessingOverlay message="AI Matching Engine running..." />}
      <PageHeader
        title="AI Matching Engine"
        description="Coordinates produce requests with transport capacity — every match shows why, not just a score."
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-start">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Unmatched Requests</h3>
          <div className="space-y-3">
            {unmatchedRequests.length === 0 ? (
              <p className="text-sm text-stone-400">No pending requests in queue.</p>
            ) : unmatchedRequests.map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <p className="font-medium text-stone-900 text-sm">{r.farmer}</p>
                <p className="text-xs text-stone-500 mt-0.5">{r.crop} · {r.quantity} kg · {r.district}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col items-center gap-4 py-4 lg:py-8 order-first lg:order-none lg:col-auto">
          <Button onClick={handleMatch} disabled={processing || unmatchedRequests.length === 0} className="whitespace-nowrap">
            <Brain size={16} /> Run AI Matching
          </Button>
          {matches.length > 0 && (
            <div className="space-y-2 w-full max-w-[200px]">
              {matches.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-primary font-medium animate-fade-in">
                  <ArrowRight size={12} />
                  {m.confidence}% match
                </div>
              ))}
            </div>
          )}
        </div>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Available Transporters</h3>
          <div className="space-y-3">
            {availableTransporters.map(t => (
              <div key={t.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <p className="font-medium text-stone-900 text-sm">{t.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{t.vehicle} · {t.capacity} kg · {t.district}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {matches.length > 0 && (
        <Card className="mt-6 p-6 animate-fade-in space-y-4">
          <h3 className="text-sm font-semibold text-stone-900">Match Results — with explanations</h3>
          {matches.map((m, i) => (
            <div key={i} className="p-4 rounded-xl border border-primary/20 bg-primary-light/20 space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900">{m.request.farmer}</p>
                  <p className="text-xs text-stone-500">{m.request.crop} · {m.request.district}</p>
                </div>
                <ArrowRight size={16} className="text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900">{m.transporter.name}</p>
                  <p className="text-xs text-stone-500">{m.transporter.vehicle}</p>
                </div>
                <span className="text-sm font-bold text-primary">{m.confidence}%</span>
              </div>
              {m.factors?.length > 0 && (
                <MatchExplanationCard factors={m.factors} confidence={m.confidence} compact />
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
