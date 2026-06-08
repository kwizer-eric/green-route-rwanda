import { useState } from 'react'
import { Brain, ArrowRight } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIProcessingOverlay from '../../components/AIProcessingOverlay'
import { simulateAIProcessing } from '../../utils/aiMatching'
import { useApp } from '../../context/AppContext'

export default function AIMatching() {
  const { unmatchedRequests, availableTransporters, runAdminAutoMatching } = useApp()
  const [processing, setProcessing] = useState(false)
  const [matches, setMatches] = useState([])

  const handleMatch = async () => {
    setProcessing(true)
    setMatches([])
    await simulateAIProcessing(2000)
    const results = runAdminAutoMatching()
    setMatches(results)
    setProcessing(false)
  }


  return (
    <div>
      {processing && <AIProcessingOverlay message="AI Matching Engine running..." />}
      <PageHeader title="AI Matching Engine" description="Visualize how produce requests are paired with transporters." />
      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Unmatched Requests</h3>
          <div className="space-y-3">
            {unmatchedRequests.map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <p className="font-medium text-stone-900 text-sm">{r.farmer}</p>
                <p className="text-xs text-stone-500 mt-0.5">{r.crop} · {r.quantity} kg · {r.district}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col items-center gap-4 py-8">
          <Button onClick={handleMatch} disabled={processing} className="whitespace-nowrap">
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
        <Card className="mt-6 p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Match Results</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary-light/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{m.request.farmer}</p>
                  <p className="text-xs text-stone-500">{m.request.crop} · {m.request.district}</p>
                </div>
                <div className="flex flex-col items-center px-3">
                  <ArrowRight size={16} className="text-primary" />
                  <span className="text-xs font-bold text-primary mt-1">{m.confidence}%</span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-medium text-stone-900 truncate">{m.transporter.name}</p>
                  <p className="text-xs text-stone-500">{m.transporter.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
