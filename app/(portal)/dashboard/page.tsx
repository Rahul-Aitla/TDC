"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  Users, 
  UserPlus, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Calendar,
  LucideIcon,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import mockData from "@/data/mock_data.json"
import { Customer } from "@/types"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")
  const [maritalStatusFilter, setMaritalStatusFilter] = useState("all")

  const customers = useMemo(() => {
    return [...mockData.activeCustomers, ...mockData.matchPool] as Customer[]
  }, [])

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCity = cityFilter === "all" || customer.city === cityFilter
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter
      const matchesMaritalStatus = maritalStatusFilter === "all" || customer.maritalStatus === maritalStatusFilter
      
      let matchesAge = true
      if (ageFilter !== "all") {
        const [min, max] = ageFilter.split("-").map(Number)
        matchesAge = customer.age >= min && customer.age <= max
      }

      return matchesSearch && matchesCity && matchesStatus && matchesAge && matchesMaritalStatus
    })
  }, [searchQuery, cityFilter, statusFilter, ageFilter, maritalStatusFilter, customers])

  const cities = Array.from(new Set(customers.map(c => c.city))).sort()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Matchmaker Dashboard</h1>
        <p className="text-slate-500">Manage your customers and matchmaking pipeline.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={customers.length.toString()} 
          change="+12.5%" 
          trend="up"
          icon={Users} 
        />
        <StatCard 
          title="Matches Sent" 
          value="156" 
          change="+8.2%" 
          trend="up"
          icon={UserPlus} 
        />
        <StatCard 
          title="Pending Reviews" 
          value="42" 
          change="-2.4%" 
          trend="down"
          icon={Clock} 
        />
        <StatCard 
          title="Meetings Scheduled" 
          value="18" 
          change="+14.1%" 
          trend="up"
          icon={Calendar} 
        />
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
          <Filter className="w-4 h-4" />
          Quick Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="20-25">20 - 25</SelectItem>
              <SelectItem value="26-30">26 - 30</SelectItem>
              <SelectItem value="31-35">31 - 35</SelectItem>
              <SelectItem value="36-45">36 - 45</SelectItem>
            </SelectContent>
          </Select>
          <Select value={maritalStatusFilter} onValueChange={setMaritalStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Marital Status</SelectItem>
              <SelectItem value="Unmarried">Unmarried</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widow">Widow</SelectItem>
              <SelectItem value="Widower">Widower</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Profile Created">Profile Created</SelectItem>
              <SelectItem value="Verification Pending">Verification Pending</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Intro Call Scheduled">Intro Call Scheduled</SelectItem>
              <SelectItem value="Intro Call Completed">Intro Call Completed</SelectItem>
              <SelectItem value="Match Suggestions Generated">Match Suggestions Generated</SelectItem>
              <SelectItem value="Matches Sent">Matches Sent</SelectItem>
              <SelectItem value="Feedback Awaiting">Feedback Awaiting</SelectItem>
              <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
              <SelectItem value="Active Search">Active Search</SelectItem>
              <SelectItem value="Successfully Matched">Successfully Matched</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Name</TableHead>
              <TableHead className="font-semibold text-slate-900">Age</TableHead>
              <TableHead className="font-semibold text-slate-900">City</TableHead>
              <TableHead className="font-semibold text-slate-900">Marital Status</TableHead>
              <TableHead className="font-semibold text-slate-900">Status</TableHead>
              <TableHead className="font-semibold text-slate-900">Profession</TableHead>
              <TableHead className="text-right font-semibold text-slate-900">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-100">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{customer.firstName} {customer.lastName}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] px-1.5 py-0 leading-none h-4",
                              customer.membershipTier === 'Premium' 
                                ? "bg-amber-50 text-amber-700 border-amber-200" 
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            )}
                          >
                            {customer.membershipTier}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">{customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{customer.age}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{customer.city}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(
                      "font-medium bg-slate-100 text-slate-700 border-slate-200"
                    )}>
                      {customer.maritalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-medium whitespace-nowrap",
                      customer.status === 'Successfully Matched' ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" : 
                      customer.status === 'Active Search' ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50" : 
                      customer.status === 'Verification Pending' ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" : 
                      customer.status === 'On Hold' ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-50" :
                      "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50"
                    )} variant="outline">
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{customer.designation}</span>
                      <span className="text-xs text-slate-500">{customer.company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/customer/${customer.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                        View Profile
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  No customers found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  )
}
