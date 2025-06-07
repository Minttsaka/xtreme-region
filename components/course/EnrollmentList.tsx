"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Filter,

  List,
  UserCheck,
  Star,
  Grid3X3,
} from "lucide-react"
import { Prisma } from "@prisma/client"

type Enrollment = Prisma.SubscriptionGetPayload<{
    include:{
        user:{
            include:{
                completeArena:true
            }
        }
    }
}>


export default function EnrollmentList({ EnrollmentList, lessons }:{ EnrollmentList : Enrollment[], lessons : number }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState("grid")

  const filteredStudents = EnrollmentList
    .filter((enrollment) => {
      const matchesSearch =
        enrollment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.user.currentQualification?.toLowerCase().includes(searchTerm.toLowerCase())
        const completionPercentage = Math.round(((enrollment.user?.completeArena.length ?? 0) / lessons) * 100)

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "verified" && enrollment.user.isVerified) ||
        (filterBy === "unverified" && !enrollment.user.isVerified) ||
        (filterBy === "high-performance" && completionPercentage >= 85)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.user.name ?? "").localeCompare(b.user.name ?? "");
        case "email":
          return (a.user.email ?? "").localeCompare(b.user.email ?? "");
        case "enrollment":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });


    function calculateCompletionPercentage(enrollmentNo : number): number {
        const completed = enrollmentNo ?? 0;

        if (lessons === 0) return 0;

        return Math.round((completed / lessons) * 100);
        }


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (rate >= 80) return "text-blue-600 bg-blue-50 border-blue-200"
    if (rate >= 70) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enrolled</p>
                    <p className="text-2xl font-bold text-blue-600">{EnrollmentList.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified Students</p>
                    <p className="text-2xl font-bold text-green-600">
                      {EnrollmentList.filter((s) => s.user.isVerified).length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Completion</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(
                        EnrollmentList.reduce((acc, s) => acc + s.user.completeArena.length, 0) / EnrollmentList.length,
                      )}
                      %
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardContent className="p-6">
             <div className="relative mb-2 flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 justify-between">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48 border-gray-300">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="unverified">Unverified Only</SelectItem>
                    <SelectItem value="high-performance">High Performers</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="email">Sort by Email</SelectItem>
                    <SelectItem value="enrollment">Sort by Enrollment Date</SelectItem>
                    <SelectItem value="performance">Sort by Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="border-gray-300"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="border-gray-300"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.user.id} className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage className="object-cover" src={student.user.image || "/placeholder.svg"} alt={student.user.name as string} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(student.user.name as string)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">{student.user.name}</h3>
                          {student.user.isVerified && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{student.user.currentQualification}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{student.user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div
                            className={`text-sm font-semibold px-2 py-1 rounded border ${getPerformanceColor(calculateCompletionPercentage(student.user.completeArena?.length))}`}
                          >
                            {calculateCompletionPercentage(student.user.completeArena?.length)}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Completion</div>
                        </div>
                        <div>
                          <div
                            className={`text-sm font-semibold px-2 py-1 rounded border ${getPerformanceColor(calculateCompletionPercentage(student.user.completeArena?.length))}`}
                          >
                            {student.user.currentQualification}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Qualification</div>
                        </div>
                      </div>
                    </div>

                    {student.user.bio && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 line-clamp-2">{student.user.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">Student</th>
                        <th className="text-left p-4 font-medium text-gray-700">Contact</th>
                        <th className="text-left p-4 font-medium text-gray-700">Qualification</th>
                        <th className="text-center p-4 font-medium text-gray-700">Performance</th>
                        <th className="text-center p-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={student.user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage className="object-cover" src={student.user.image || "/placeholder.svg"} alt={student.user.name as string} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {getInitials(student.user.name as string)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-800">{student.user.name}</div>
                                <div className="text-sm text-gray-500">
                                  Enrolled: {new Date(student.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                {student.user.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                {student.user.phone}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-800">{student.user.currentQualification}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {student.user.address}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="space-y-1">
                              <div
                                className={`inline-block text-xs font-medium px-2 py-1 rounded border ${getPerformanceColor(calculateCompletionPercentage(student.user.completeArena?.length))}`}
                              >
                                {calculateCompletionPercentage(student.user.completeArena?.length)}% Complete
                              </div>
                              
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {student.user.isVerified ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pending</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredStudents.length === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
