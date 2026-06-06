"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MeetingNote } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(['Intro Call', 'Follow-up', 'Match Presentation', 'Feedback Session', 'Other']),
  duration: z.string().min(1, "Duration is required"),
  mood: z.enum(['Very Positive', 'Positive', 'Neutral', 'Mixed', 'Negative']),
  summary: z.string().min(1, "Summary is required"),
  observations: z.string().min(1, "Observations are required"),
})

interface MeetingNoteFormProps {
  initialData?: MeetingNote
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export function MeetingNoteForm({ initialData, onSubmit, onCancel }: MeetingNoteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      type: 'Intro Call',
      duration: '',
      mood: 'Neutral',
      summary: '',
      observations: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-slate-500">Meeting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-slate-500">Meeting Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Intro Call">Intro Call</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Match Presentation">Match Presentation</SelectItem>
                    <SelectItem value="Feedback Session">Feedback Session</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-slate-500">Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 30 mins" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-slate-500">Mood</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Very Positive">Very Positive</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief summary of the meeting" {...field} className="bg-white min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Observations</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed observations" {...field} className="bg-white min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500 hover:text-slate-700">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            {initialData ? "Update Note" : "Save Note"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
