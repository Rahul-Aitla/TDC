"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export type TimelineStage = 
  | "Profile Created"
  | "Verification Complete"
  | "Intro Call"
  | "Match Suggestions Generated"
  | "Matches Sent"
  | "Feedback Awaiting"
  | "Meeting Scheduled"

interface TimelineItem {
  stage: TimelineStage
  date?: string
  description?: string
}

interface TimelineProps {
  items: TimelineItem[]
  currentStage: TimelineStage
  className?: string
}

const STAGES: TimelineStage[] = [
  "Profile Created",
  "Verification Complete",
  "Intro Call",
  "Match Suggestions Generated",
  "Matches Sent",
  "Feedback Awaiting",
  "Meeting Scheduled"
]

export function CustomerTimeline({ items, currentStage, className }: TimelineProps) {
  const currentIndex = STAGES.indexOf(currentStage)

  return (
    <div className={cn("space-y-8", className)}>
      <div className="relative">
        {/* Vertical line */}
        <div 
          className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200" 
          aria-hidden="true" 
        />
        
        {/* Progress line */}
        <div 
          className="absolute left-[15px] top-2 w-0.5 bg-blue-600 transition-all duration-500 ease-in-out" 
          style={{ 
            height: currentIndex === 0 ? '0%' : `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            maxHeight: 'calc(100% - 16px)'
          }}
          aria-hidden="true" 
        />

        <div className="space-y-8">
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isPending = index > currentIndex
            
            const itemData = items.find(item => item.stage === stage)

            return (
              <div key={stage} className="relative flex items-start gap-4 group">
                {/* Icon Container */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                    isCompleted ? "bg-blue-600 border-blue-600" : 
                    isCurrent ? "bg-white border-blue-600" : 
                    "bg-white border-slate-200"
                  )}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    ) : (
                      <Circle className="w-3 h-3 text-slate-300 fill-slate-300" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={cn(
                      "text-sm font-bold transition-colors",
                      isCurrent ? "text-blue-600" : 
                      isCompleted ? "text-slate-900" : 
                      "text-slate-400"
                    )}>
                      {stage}
                    </h4>
                    {itemData?.date && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {itemData.date}
                      </span>
                    )}
                  </div>
                  {itemData?.description && (
                    <p className={cn(
                      "text-xs mt-1 leading-relaxed",
                      isPending ? "text-slate-300" : "text-slate-500"
                    )}>
                      {itemData.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
