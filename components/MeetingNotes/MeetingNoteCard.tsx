"use client"

import { Edit2, Trash2, Calendar, Clock, MessageSquare, Brain } from "lucide-react"
import { MeetingNote } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MeetingNoteCardProps {
  note: MeetingNote
  onEdit: (note: MeetingNote) => void
  onDelete: (id: string) => void
}

export function MeetingNoteCard({ note, onEdit, onDelete }: MeetingNoteCardProps) {
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Very Positive': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'Positive': return 'bg-green-50 text-green-700 border-green-100'
      case 'Neutral': return 'bg-slate-50 text-slate-700 border-slate-100'
      case 'Mixed': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'Negative': return 'bg-rose-50 text-rose-700 border-rose-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  return (
    <div className="relative pl-8 pb-8 group last:pb-0">
      {/* Vertical Line Segment */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-last:bottom-auto group-last:h-4" />
      
      {/* Timeline Dot */}
      <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white z-10" />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{note.type}</h3>
                <Badge variant="outline" className={cn("font-medium border-0", getMoodColor(note.mood))}>
                  {note.mood}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {note.duration}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => onEdit(note)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MessageSquare className="w-3 h-3" />
                Summary
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/50 italic">
                &quot;{note.summary}&quot;
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Brain className="w-3 h-3" />
                Observations
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-1">
                {note.observations}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
