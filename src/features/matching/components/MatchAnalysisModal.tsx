"use client"

import * as React from "react"
import { 
  X, 
  Brain, 
  Send, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react"
import { Customer } from "../../../types"
import { CompatibilityResult } from "../lib/matching"
import { AIMatchAnalysis } from "./MatchingRecommendations"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { toast } from "sonner"

interface MatchAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  profile: Customer
  matchDetails: CompatibilityResult
  aiAnalysis: AIMatchAnalysis | null
  isAILoading?: boolean
  onSendMatch: (profile: Customer, emailData?: { subject: string, body: string }) => void
}

export function MatchAnalysisModal({
  isOpen,
  onClose,
  profile,
  matchDetails,
  aiAnalysis,
  isAILoading,
  onSendMatch
}: MatchAnalysisModalProps) {
  // Handle escape key to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Matchmaker Analysis</h2>
              <p className="text-sm text-slate-500 font-medium">Deep insight for {profile.firstName} {profile.lastName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {isAILoading && !aiAnalysis ? (
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-3 w-1/2 bg-slate-50 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-50 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-1/2 bg-slate-50 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-50 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-24 w-full bg-slate-50 rounded animate-pulse" />
            </div>
          ) : aiAnalysis ? (
            <>
              {/* Summary Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-purple-600">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Compatibility Summary</h3>
                </div>
                <div className="bg-purple-50/30 p-5 rounded-2xl border border-purple-100/50">
                  <p className="text-lg text-slate-800 leading-relaxed font-medium italic">
                    &quot;{aiAnalysis.compatibilitySummary}&quot;
                  </p>
                </div>
              </section>

              {/* Two Column Grid for Alignments & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Expectation Alignment */}
                <section className="space-y-4">
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">Expectation Alignment</h3>
                  <div className="space-y-3">
                    {(aiAnalysis.expectationAlignment || []).map((insight: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{insight}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Key Strengths */}
                <section className="space-y-4">
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">Key Strengths</h3>
                  <div className="space-y-3">
                    {(aiAnalysis.keyStrengths || []).map((strength: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{strength}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Concerns & Topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Potential Concerns */}
                {(aiAnalysis.potentialConcerns || []).length > 0 && (
                  <section className="space-y-4">
                    <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">Potential Concerns</h3>
                    <div className="space-y-3">
                      {aiAnalysis.potentialConcerns.map((concern: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-700 leading-snug">{concern}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Conversation Topics */}
                <section className="space-y-4">
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">Suggested Discussion</h3>
                  <div className="space-y-3">
                    {(aiAnalysis.firstConversationTopics || []).map((topic: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{topic}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Final Recommendation */}
              <section className="pt-6 border-t border-slate-100">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Matchmaker Recommendation</h4>
                    <p className="text-lg font-medium leading-relaxed">
                      {aiAnalysis.matchmakerRecommendation}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Badge className="bg-blue-600 hover:bg-blue-600 text-white px-4 py-1.5 text-sm rounded-full">
                      {matchDetails.confidenceLevel} Confidence Match
                    </Badge>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium italic">Generating professional insights...</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="font-bold px-6 h-11 rounded-xl"
          >
            Close Analysis
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-11 rounded-xl shadow-md flex items-center gap-2"
            onClick={() => {
              if (aiAnalysis) {
                navigator.clipboard.writeText(aiAnalysis.introEmail.body)
                toast.success("Intro email copied to clipboard")
                onSendMatch(profile, aiAnalysis.introEmail)
                onClose()
              }
            }}
            disabled={!aiAnalysis}
          >
            <Send className="w-4 h-4" />
            Send Intro Email
          </Button>
        </div>
      </div>
    </div>
  )
}
