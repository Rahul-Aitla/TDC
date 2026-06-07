"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  IndianRupee,
  Heart,
  Baby,
  Plane,
  PawPrint,
  ShieldCheck,
  User,
  History,
  Clock,
  Home,
  Users,
  Moon,
  Star,
  Zap,
  Info,
  Droplets,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomerTimeline } from "@/components/Customer/CustomerTimeline"
import { MeetingNotes } from "@/components/MeetingNotes"
import { MatchingRecommendations } from "@/components/Matching/MatchingRecommendations"
import mockData from "@/data/mock_data.json"
import { Customer } from "@/types"

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  const customer = useMemo(() => {
    const allProfiles = [...mockData.activeCustomers, ...mockData.matchPool] as Customer[];
    return allProfiles.find(c => c.id === customerId)
  }, [customerId])

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Customer Not Found</h2>
        <p className="text-slate-500">The customer profile you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* 1. Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-blue-600">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-slate-900">{customer.firstName} {customer.lastName}</h1>
              <Badge 
                variant="outline" 
                className={cn(
                  "font-bold",
                  customer.membershipTier === 'Premium' 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-slate-50 text-slate-600 border-slate-200"
                )}
              >
                {customer.membershipTier} Tier
              </Badge>
              {customer.profileVerified && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Profile
                </Badge>
              )}
              <Badge variant="outline" className={cn(
                "font-medium",
                customer.status === 'Successfully Matched' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                customer.status === 'Active Search' ? "bg-blue-50 text-blue-700 border-blue-200" : 
                customer.status === 'Verification Pending' ? "bg-amber-50 text-amber-700 border-amber-200" : 
                customer.status === 'On Hold' ? "bg-red-50 text-red-700 border-red-200" :
                "bg-slate-50 text-slate-600 border-slate-200"
              )}>
                {customer.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600">
              <span className="flex items-center gap-1.5 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                {customer.age} yrs • {customer.gender}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                {customer.city}, {customer.country}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {customer.designation} at {customer.company}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal & Lifestyle */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. Personal Information */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Full Name" value={`${customer.firstName} ${customer.lastName}`} />
              <InfoItem label="Gender" value={customer.gender} />
              <InfoItem label="Date of Birth" value={customer.dateOfBirth} />
              <InfoItem label="Time of Birth" value={customer.timeOfBirth || 'N/A'} icon={Clock} />
              <InfoItem label="Place of Birth" value={customer.placeOfBirth || 'N/A'} icon={MapPin} />
              <InfoItem label="Age" value={`${customer.age} Years`} />
              <InfoItem label="Height" value={customer.height} />
              <InfoItem label="Weight" value={customer.weight || 'N/A'} />
              <InfoItem label="Blood Group" value={customer.bloodGroup || 'N/A'} icon={Droplets} />
              <InfoItem label="Complexion" value={customer.complexion || 'N/A'} />
              <InfoItem label="Marital Status" value={customer.maritalStatus} />
              <InfoItem label="Religion" value={customer.religion} />
              <InfoItem label="Caste" value={customer.caste} />
              <InfoItem label="Subcaste" value={customer.subcaste || 'None'} />
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Languages Known</p>
                <div className="flex flex-wrap gap-2">
                  {customer.languages.map(lang => (
                    <Badge key={lang} variant="secondary" className="bg-slate-100 text-slate-700 font-medium">{lang}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Horoscope & Astrological Details */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Astrological Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Rashi" value={customer.rashi || 'N/A'} icon={Moon} />
              <InfoItem label="Nakshatra" value={customer.nakshatra || 'N/A'} icon={Star} />
              <InfoItem label="Manglik Status" value={customer.manglik ? 'Yes' : 'No'} icon={Zap} />
              <div className="md:col-span-2 lg:col-span-3">
                <InfoItem label="Horoscope Details" value={customer.horoscopeDetails || 'N/A'} icon={Info} />
              </div>
            </CardContent>
          </Card>

          {/* 4. Family Background */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Family Background
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Father's Name" value={customer.fatherName || 'N/A'} />
              <InfoItem label="Father's Occupation" value={customer.fatherOccupation || 'N/A'} />
              <InfoItem label="Mother's Name" value={customer.motherName || 'N/A'} />
              <InfoItem label="Mother's Occupation" value={customer.motherOccupation || 'N/A'} />
              <InfoItem label="Family Type" value={customer.familyType || 'N/A'} icon={Users} />
              <InfoItem label="Native Place" value={customer.nativePlace || 'N/A'} icon={MapPin} />
              <InfoItem label="Brothers" value={`${customer.totalBrothers || 0} (${customer.marriedBrothers || 0} Married)`} />
              <InfoItem label="Sisters" value={`${customer.totalSisters || 0} (${customer.marriedSisters || 0} Married)`} />
              <div className="md:col-span-2">
                <InfoItem label="Relatives Information" value={customer.relativesInfo || 'N/A'} />
              </div>
            </CardContent>
          </Card>

          {/* 5. Career & Education */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Career & Education
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Current Designation" value={customer.designation} icon={Briefcase} />
              <InfoItem label="Company" value={customer.company} />
              <InfoItem label="Annual Income" value={customer.income} icon={IndianRupee} />
              <InfoItem label="Education" value={`${customer.degree}`} icon={GraduationCap} />
              <div className="md:col-span-2">
                <InfoItem label="College / University" value={customer.college} />
              </div>
            </CardContent>
          </Card>

          {/* 6. Lifestyle & Preferences */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                Lifestyle & Expectations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PreferenceItem 
                  icon={Baby} 
                  label="Want Kids" 
                  value={customer.wantKids ? "Yes" : "No"} 
                  color={customer.wantKids ? "text-emerald-600" : "text-slate-500"} 
                />
                <PreferenceItem 
                  icon={Plane} 
                  label="Open to Relocate" 
                  value={customer.openToRelocate ? "Yes" : "No"} 
                  color={customer.openToRelocate ? "text-emerald-600" : "text-slate-500"} 
                />
                <PreferenceItem 
                  icon={PawPrint} 
                  label="Open to Pets" 
                  value={customer.openToPets ? "Yes" : "No"} 
                  color={customer.openToPets ? "text-emerald-600" : "text-slate-500"} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem label="Diet" value={customer.diet || 'N/A'} />
                <InfoItem label="Smoking" value={customer.smoking || 'Non-Smoker'} />
                <InfoItem label="Drinking" value={customer.drinking || 'Non-Drinker'} />
              </div>

              <div className="space-y-4">
                <InfoItem label="What I am looking for" value={customer.partnerExpectations || 'N/A'} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hobbies & Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {customer.hobbies.map(hobby => (
                      <Badge key={hobby} className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 transition-colors">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personality Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {customer.personalityTraits.map(trait => (
                      <Badge key={trait} variant="outline" className="border-slate-200 text-slate-600">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Meeting Notes */}
          <MeetingNotes customerId={customerId} />

          {/* 6. Matching Recommendations */}
          <MatchingRecommendations customer={customer} />
        </div>

        {/* Right Column: Contact & Quick Info */}
        <div className="space-y-8">
          {/* Customer Journey Timeline */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Customer Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CustomerTimeline 
                currentStage="Match Suggestions Generated"
                items={[
                  { 
                    stage: "Profile Created", 
                    date: "Oct 12", 
                    description: "Initial registration completed." 
                  },
                  { 
                    stage: "Verification Complete", 
                    date: "Oct 14", 
                    description: "Documents verified by admin." 
                  },
                  { 
                    stage: "Intro Call", 
                    date: "Oct 15", 
                    description: "Initial consultation with matchmaker." 
                  },
                  { 
                    stage: "Match Suggestions Generated", 
                    date: "Oct 16", 
                    description: "System generated 5 new matches." 
                  }
                ]} 
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email Address</p>
                  <p className="text-sm font-bold text-slate-900 break-all">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                  <p className="text-sm font-bold text-slate-900">{customer.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl bg-blue-600 text-white">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/30 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">System Audit</h3>
              <p className="text-blue-100 text-sm">Profile last updated on {new Date(customer.updatedAt).toLocaleDateString()}</p>
              <Button variant="secondary" className="w-full font-bold">Review Documents</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, icon: Icon }: { label: string, value: string, icon?: LucideIcon }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  )
}

function PreferenceItem({ icon: Icon, label, value, color }: { icon: LucideIcon, label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={cn("text-sm font-bold", color)}>{value}</p>
      </div>
    </div>
  )
}
