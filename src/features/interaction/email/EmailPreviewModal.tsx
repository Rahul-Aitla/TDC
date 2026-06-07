"use client"

import * as React from "react"
import { X, Send, User, Mail, Type, AlignLeft } from "lucide-react"
import { Customer } from "../../../types"
import { Button } from "../../../components/ui/button"
import { toast } from "sonner"

interface EmailPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  recipient: Customer
  emailData: {
    subject: string
    body: string
  }
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  recipient,
  emailData
}: EmailPreviewModalProps) {
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

  const handleSend = () => {
    toast.success(`Email successfully sent to ${recipient.firstName}!`, {
      description: "The introduction has been delivered to their inbox."
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Email Preview</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-slate-50/30">
          {/* Recipient Field */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              <User className="w-3 h-3" />
              Recipient
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 flex items-center justify-between">
              <span>{recipient.firstName} {recipient.lastName}</span>
              <span className="text-xs text-slate-400 font-normal">{recipient.email}</span>
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              <Type className="w-3 h-3" />
              Subject
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900">
              {emailData.subject}
            </div>
          </div>

          {/* Body Field */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              <AlignLeft className="w-3 h-3" />
              Message Body
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-600 leading-relaxed min-h-[200px] max-h-[300px] overflow-y-auto whitespace-pre-wrap font-medium">
              {emailData.body}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="font-bold text-slate-500 hover:bg-slate-50"
          >
            Discard
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-11 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
            Send Email Now
          </Button>
        </div>
      </div>
    </div>
  )
}
