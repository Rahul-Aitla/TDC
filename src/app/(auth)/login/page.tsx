"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Lock, Mail, Loader2 } from "lucide-react"

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Hardcoded credentials
  const DEMO_EMAIL = "demo@tdcmatchmakers.com"
  const DEMO_PASSWORD = "password123"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      if (values.email === DEMO_EMAIL && values.password === DEMO_PASSWORD) {
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userEmail", values.email)
        toast.success("Login successful! Redirecting...")
        router.push("/dashboard")
      } else {
        setIsLoading(false)
        toast.error("Invalid email or password. Please try again.")
        form.setError("root", { message: "Invalid credentials" })
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Matchmaker Portal</h1>
          <p className="mt-2 text-slate-600">Enter your credentials to access the operator dashboard.</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Use your company email to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            placeholder="name@company.com" 
                            className="pl-10 bg-slate-50 focus-visible:bg-white focus-visible:ring-blue-500 border-slate-200" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 bg-slate-50 focus-visible:bg-white focus-visible:ring-blue-500 border-slate-200" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold transition-all mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between w-full text-sm">
              <button className="text-slate-500 hover:text-blue-600 transition-colors">Forgot password?</button>
              <span className="text-slate-300">|</span>
              <button className="text-slate-500 hover:text-blue-600 transition-colors">Contact Support</button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Not an operator? <button className="font-medium text-blue-600 hover:underline">Contact system admin</button>
        </p>
      </div>
    </div>
  )
}
