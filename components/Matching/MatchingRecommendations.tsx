"use client"

import { useMemo, useState } from "react"
import { 
  Sparkles as SparklesIcon, 
  Brain as BrainIcon,
  Info as InfoIcon
} from "lucide-react"
import { Customer } from "@/types"
import { getTopMatches } from "@/lib/matching"
import { toast } from "sonner"
import { MatchSuggestionCard } from "./MatchSuggestionCard"
import mockData from "@/data/mock_data.json"

interface MatchingRecommendationsProps {
  customer: Customer
}

interface AIAnalysis {
  matchSummary: string;
  strengths: string[];
  concerns: string[];
}

export function MatchingRecommendations({ customer }: MatchingRecommendationsProps) {
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, AIAnalysis>>({})
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({})

  const recommendations = useMemo(() => {
    const allProfiles = [...mockData.activeCustomers, ...mockData.matchPool] as Customer[];
    return getTopMatches(customer, allProfiles)
  }, [customer])

  const fetchAIAnalysis = async (match: Customer, score: number) => {
    if (aiAnalysis[match.id]) return;

    setLoadingAI(prev => ({ ...prev, [match.id]: true }))

    try {
      const response = await fetch("/api/analyze-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          candidate: match,
          score
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setAiAnalysis(prev => ({ ...prev, [match.id]: data }))
    } catch (err: unknown) {
      console.error("AI Analysis failed:", err)
    } finally {
      setLoadingAI(prev => ({ ...prev, [match.id]: false }))
    }
  }

  const handleSendMatch = (matchName: string) => {
    toast.success(`Match profile sent to ${matchName}`)
  }

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 65) return "Strong Match"
    if (score >= 50) return "Good Potential"
    return "Potential Match"
  }

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            AI Match Suggestions
          </h2>
          <p className="text-sm text-slate-500 font-medium">Top 10 ranked profiles for {customer.firstName}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <BrainIcon className="w-4 h-4 text-blue-600" />
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">AI Powered Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((match) => (
          <MatchSuggestionCard 
            key={match.id}
            profile={match}
            matchDetails={match.matchDetails}
            matchLabel={getMatchLabel(match.matchDetails.score)}
            aiExplanation={aiAnalysis[match.id]?.matchSummary || null}
            isAILoading={loadingAI[match.id]}
            onSendMatch={(profile) => handleSendMatch(profile.firstName)}
            onViewProfile={(profile) => {
              window.location.href = `/customer/${profile.id}`
            }}
            onViewAIInsight={(profile) => fetchAIAnalysis(profile, match.matchDetails.score)}
          />
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
          <InfoIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
          <p className="font-bold text-slate-900 text-sm mb-1">Matchmaker Decision Support</p>
          Our hybrid engine combines mathematical compatibility scoring with advanced AI reasoning to prioritize candidates. Always review the full profile and previous meeting notes before proceeding with a recommendation.
        </div>
      </div>
    </div>
  )
}
