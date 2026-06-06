"use client"

import { useState, useRef, useEffect } from "react"
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  Send, 
  Brain, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Users,
  Heart,
  Globe as GlobeIcon
} from "lucide-react"
import { Customer } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CompatibilityResult } from "@/lib/matching"

interface MatchSuggestionCardProps {
  profile: Customer
  matchDetails: CompatibilityResult
  matchLabel: string
  aiExplanation: string | null
  isAILoading?: boolean
  onSendMatch: (profile: Customer) => void
  onViewProfile: (profile: Customer) => void
  onViewAIInsight: (profile: Customer) => void
}

export function MatchSuggestionCard({
  profile,
  matchDetails,
  matchLabel,
  aiExplanation,
  isAILoading,
  onSendMatch,
  onViewProfile,
  onViewAIInsight
}: MatchSuggestionCardProps) {
  const [showAIInsight, setShowAIInsight] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  if (!matchDetails) {
    return null;
  }

  const matchScore = matchDetails.score;
  const matchReasons = matchDetails.strengths || [];

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowAIInsight(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getScoreColors = (score: number) => {
    if (score >= 80) return { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-500", light: "bg-emerald-50" }
    if (score >= 65) return { bg: "bg-blue-500", text: "text-blue-700", border: "border-blue-500", light: "bg-blue-50" }
    if (score >= 50) return { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-500", light: "bg-amber-50" }
    return { bg: "bg-slate-400", text: "text-slate-600", border: "border-slate-400", light: "bg-slate-50" }
  }

  const colors = getScoreColors(matchScore)

  const tagColors = [
    "bg-purple-50 text-purple-700 border-purple-100",
    "bg-emerald-50 text-emerald-700 border-emerald-100",
    "bg-orange-50 text-orange-700 border-orange-100",
    "bg-blue-50 text-blue-700 border-blue-100"
  ]

  const getShortLabel = (reason: string) => {
    const r = reason.toLowerCase()
    if (r.includes("children") || r.includes("child-free")) return "Want Kids"
    if (r.includes("religious") || r.includes("religion")) return "Same Religion"
    if (r.includes("both based in")) return "Same City"
    if (r.includes("same country")) return "Same Country"
    if (r.includes("educational") || r.includes("academic") || r.includes("higher education")) return "Similar Education"
    if (r.includes("family")) return "Family Aligned"
    if (r.includes("relocation") || r.includes("relocating") || r.includes("flexible with location")) return "Relocatable"
    if (r.includes("languages")) return "Common Language"
    if (r.includes("interests") || r.includes("traits")) return "Compatible Traits"
    if (r.includes("manglik")) return "Manglik Match"
    if (r.includes("zodiac") || r.includes("rashi")) return "Zodiac Match"
    if (r.includes("dietary") || r.includes("diet")) return "Same Diet"
    if (r.includes("smoking")) return "Same Habits"
    if (r.includes("perfect cultural match")) return "Cultural Match"
    return reason // fallback
  }

  return (
    <div className={cn(
      "w-full bg-white rounded-[12px] p-[16px_20px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] border-l-[3px] mb-[12px] overflow-hidden transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]",
      colors.border
    )}>
      {/* Row 1: Profile + Tags */}
      <div className="flex items-center gap-[16px]">
        {/* Section A: Avatar + Score */}
        <div className="w-[70px] shrink-0 flex flex-col items-center gap-[4px]">
          <div className="w-[40px] h-[40px] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[14px] border border-slate-200">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm",
            colors.bg
          )}>
            {matchScore}%
          </div>
        </div>

        {/* Section B: Name + Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
            {profile.firstName} {profile.lastName}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-center">
            <div className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3 h-3" />
              <span className="text-[12px]">{profile.age} years</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3 h-3" />
              <span className="text-[12px]">{profile.city}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Briefcase className="w-3 h-3" />
              <span className="text-[12px]">{profile.designation}</span>
            </div>
          </div>
          <div className={cn("text-[12px] font-medium leading-none", colors.text)}>
            {matchLabel}
          </div>
        </div>

        {/* Section C: Tags */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-[6px]">
            {matchReasons.slice(0, 3).map((reason, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className={cn(
                  "border-0 text-[11px] font-bold py-[3px] px-[10px] rounded-full whitespace-nowrap",
                  tagColors[idx % tagColors.length]
                )}
              >
                {getShortLabel(reason)}
              </Badge>
            ))}
            {matchReasons.length > 3 && (
              <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[11px] font-bold py-[3px] px-[10px] rounded-full">
                +{matchReasons.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Score Breakdown (Expandable) */}
      <div className="mt-4 pt-4 border-t border-slate-50">
        <button 
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Match Breakdown
        </button>

        {showBreakdown && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Info className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Goals</span>
              </div>
              <div className="text-[14px] font-bold text-slate-900">{matchDetails.futureGoals} pts</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Heart className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Lifestyle</span>
              </div>
              <div className="text-[14px] font-bold text-slate-900">{matchDetails.lifestyle} pts</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Family</span>
              </div>
              <div className="text-[14px] font-bold text-slate-900">{matchDetails.family} pts</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Briefcase className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Career</span>
              </div>
              <div className="text-[14px] font-bold text-slate-900">{matchDetails.career} pts</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <GlobeIcon className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Location</span>
              </div>
              <div className="text-[14px] font-bold text-slate-900">{matchDetails.location} pts</div>
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Concerns (if any) */}
      {matchDetails.concerns.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {matchDetails.concerns.map((concern, idx) => (
            <div key={idx} className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <span className="font-bold">!</span> {concern}
            </div>
          ))}
        </div>
      )}

      {/* Row 4: Actions */}
      <div className="flex justify-end items-center gap-[8px] mt-[12px] relative">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-[32px] text-[12px] font-bold border-slate-200 text-slate-500 px-4 rounded-lg"
          onClick={() => onViewProfile(profile)}
        >
          Profile
        </Button>
        <Button 
          size="sm" 
          className="h-[32px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12px] px-4 rounded-lg shadow-sm"
          onClick={() => onSendMatch(profile)}
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Send Match
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-bold text-[12px] h-[32px] gap-1.5 px-3 rounded-lg"
          onClick={() => {
            setShowAIInsight(!showAIInsight)
            if (!showAIInsight) onViewAIInsight(profile)
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Insight
        </Button>

        {/* AI Insight Popover (Above the button) */}
        {showAIInsight && (
          <div 
            ref={popoverRef}
            className="absolute bottom-full mb-[8px] right-0 w-[280px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-4 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-50">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI Matching Analysis</span>
            </div>
            
            {isAILoading && !aiExplanation ? (
              <div className="space-y-2 py-1">
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : aiExplanation ? (
              <p className="text-[12px] text-slate-600 leading-relaxed italic">
                &quot;{aiExplanation}&quot;
              </p>
            ) : (
              <p className="text-[12px] text-slate-400 italic">Click the button to generate insight...</p>
            )}
            
            <div className="absolute -bottom-1.5 right-[40px] w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
          </div>
        )}
      </div>
    </div>
  )
}
