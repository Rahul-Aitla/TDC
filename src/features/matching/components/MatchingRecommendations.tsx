"use client"

import { useMemo, useState } from "react"
import { 
  Sparkles as SparklesIcon, 
  Brain as BrainIcon,
  Info as InfoIcon,
  ChevronDown
} from "lucide-react"
import { Customer } from "../../../types"
import { getTopMatches, CompatibilityResult } from "../lib/matching"
import { toast } from "sonner"
import { Button } from "../../../components/ui/button"
import { MatchSuggestionCard } from "./MatchSuggestionCard"
import { EmailPreviewModal } from "../../interaction/email/EmailPreviewModal"
import mockData from "../../../constants/mock_data.json"

interface MatchingRecommendationsProps {
  customer: Customer
}

export interface AIMatchAnalysis {
  compatibilitySummary: string;
  expectationAlignment: string[];
  keyStrengths: string[];
  potentialConcerns: string[];
  firstConversationTopics: string[];
  matchmakerRecommendation: string;
  introEmail: {
    subject: string;
    body: string;
  };
}

export function MatchingRecommendations({ customer }: MatchingRecommendationsProps) {
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, AIMatchAnalysis>>({})
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({})
  const [visibleCount, setVisibleCount] = useState(10)
  
  // Email Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Customer | null>(null)
  const [emailToPreview, setEmailToPreview] = useState<{ subject: string, body: string } | null>(null)

  const allRecommendations = useMemo(() => {
    const allProfiles = [...mockData.activeCustomers, ...mockData.matchPool] as Customer[];
    return getTopMatches(customer, allProfiles)
  }, [customer])

  const visibleRecommendations = useMemo(() => {
    return allRecommendations.slice(0, visibleCount)
  }, [allRecommendations, visibleCount])

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  const fetchAIAnalysis = async (match: Customer & { matchDetails: CompatibilityResult }) => {
    if (aiAnalysis[match.id]) return;

    setLoadingAI(prev => ({ ...prev, [match.id]: true }))

    try {
      const response = await fetch("/api/ai-match-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerProfile: customer,
          candidateProfile: match,
          compatibilityResult: match.matchDetails
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setAiAnalysis(prev => ({ ...prev, [match.id]: data }))
    } catch (err: unknown) {
      console.error("AI Analysis failed:", err)
      toast.error("Failed to generate AI insight")
    } finally {
      setLoadingAI(prev => ({ ...prev, [match.id]: false }))
    }
  }

  const handleSendMatch = (match: Customer, emailData?: { subject: string, body: string }) => {
    if (emailData) {
      setSelectedMatch(match)
      setEmailToPreview(emailData)
      setIsPreviewModalOpen(true)
    } else {
      toast.success(`Match profile sent to ${match.firstName}`)
    }
  }

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 65) return "Strong Match"
    if (score >= 50) return "Good Potential"
    return "Potential Match"
  }

  if (allRecommendations.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            AI Match Suggestions
          </h2>
          <p className="text-sm text-slate-500 font-medium">Showing {visibleRecommendations.length} of {allRecommendations.length} ranked profiles for {customer.firstName}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          <BrainIcon className="w-4 h-4 text-blue-600" />
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">AI Powered Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visibleRecommendations.map((match: Customer & { matchDetails: CompatibilityResult }) => (
          <MatchSuggestionCard 
            key={match.id}
            profile={match}
            matchDetails={match.matchDetails}
            matchLabel={getMatchLabel(match.matchDetails.score)}
            aiAnalysis={aiAnalysis[match.id] || null}
            isAILoading={loadingAI[match.id]}
            onSendMatch={(profile: Customer, emailContent?: { subject: string, body: string }) => handleSendMatch(profile, emailContent)}
            onViewProfile={(profile: Customer) => {
              window.location.href = `/customer/${profile.id}`
            }}
            onViewAIInsight={() => fetchAIAnalysis(match)}
          />
        ))}
      </div>

      {visibleCount < allRecommendations.length && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="h-11 px-8 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all gap-2"
          >
            Load More Suggestions
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
          <InfoIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
          <p className="font-bold text-slate-900 text-sm mb-1">Matchmaker Decision Support</p>
          Our hybrid engine combines mathematical compatibility scoring with advanced AI reasoning to prioritize candidates. Always review the full profile and previous meeting notes before proceeding with a recommendation.
        </div>
      </div>

      {/* Email Preview Modal */}
      {selectedMatch && emailToPreview && (
        <EmailPreviewModal 
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false)
            setSelectedMatch(null)
            setEmailToPreview(null)
          }}
          recipient={selectedMatch}
          emailData={emailToPreview}
        />
      )}
    </div>
  )
}
