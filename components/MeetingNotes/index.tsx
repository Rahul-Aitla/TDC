"use client"

import { useState, useEffect } from "react"
import { Plus, History } from "lucide-react"
import { MeetingNote } from "@/types"
import { Button } from "@/components/ui/button"
import { MeetingNoteForm } from "./MeetingNoteForm"
import { MeetingNoteCard } from "./MeetingNoteCard"
import { toast } from "sonner"

interface MeetingNotesProps {
  customerId: string
}

export function MeetingNotes({ customerId }: MeetingNotesProps) {
  const [notes, setNotes] = useState<MeetingNote[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingNote, setEditingNote] = useState<MeetingNote | null>(null)

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`meeting_notes_${customerId}`)
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        // Defer state update to avoid cascading render warning
        Promise.resolve().then(() => setNotes(parsedNotes))
      } catch (e) {
        console.error("Failed to parse notes", e)
      }
    }
  }, [customerId])

  // Save notes to localStorage
  const saveNotes = (newNotes: MeetingNote[]) => {
    setNotes(newNotes)
    localStorage.setItem(`meeting_notes_${customerId}`, JSON.stringify(newNotes))
  }

  const handleAddNote = (data: Omit<MeetingNote, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => {
    const newNote: MeetingNote = {
      ...data,
      id: crypto.randomUUID(),
      customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedNotes = [newNote, ...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    saveNotes(updatedNotes)
    setIsAdding(false)
    toast.success("Meeting note added successfully")
  }

  const handleUpdateNote = (data: Omit<MeetingNote, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingNote) return
    const updatedNotes = notes.map(n => 
      n.id === editingNote.id 
        ? { ...n, ...data, updatedAt: new Date().toISOString() } 
        : n
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    saveNotes(updatedNotes)
    setEditingNote(null)
    toast.success("Meeting note updated successfully")
  }

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = notes.filter(n => n.id !== id)
      saveNotes(updatedNotes)
      toast.success("Meeting note deleted successfully")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Meeting Notes
          </h2>
          <p className="text-sm text-slate-500">Keep track of all interactions with this customer</p>
        </div>
        {!isAdding && !editingNote && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {(isAdding || editingNote) && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <MeetingNoteForm 
            initialData={editingNote || undefined}
            onSubmit={editingNote ? handleUpdateNote : handleAddNote} 
            onCancel={() => {
              setIsAdding(false)
              setEditingNote(null)
            }} 
          />
        </div>
      )}

      <div className="space-y-2">
        {notes.length === 0 && !isAdding && !editingNote ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No meeting notes yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Start by adding your first meeting note to keep track of this customer&apos;s journey.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 border-slate-200 hover:bg-white"
              onClick={() => setIsAdding(true)}
            >
              Add Your First Note
            </Button>
          </div>
        ) : (
          <div className="pt-4">
            {notes.map(note => (
              <MeetingNoteCard 
                key={note.id} 
                note={note} 
                onEdit={setEditingNote} 
                onDelete={handleDeleteNote} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
