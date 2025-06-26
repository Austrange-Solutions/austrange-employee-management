/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Coffee,
  Clock,
  Filter,
  Download,
  Plane,
  MapPin,
  Timer,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import formatTime from "@/helpers/formatTime";
import formatDuration from "@/helpers/formatDuration";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AttendanceRecord {
  _id: string;
  user: string;
  dateOfWorking: string;
  dayOfWeek: string;
  loginTime?: string;
  logoutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  breakDuration?: number;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  workingHoursCompleted?: boolean;
  status:
    | "present"
    | "absent"
    | "on_leave"
    | "on_break"
    | "active"
    | "inactive";
  createdAt: string;
  updatedAt: string;
}

export default function AttendanceHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAttendanceHistory();
    }
  }, [user, currentPage, dateFilter, statusFilter, monthFilter]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/current-user");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        userId: user._id,
        page: currentPage.toString(),
        limit: "10",
      });

      if (dateFilter) params.append("date", dateFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `/api/attendance/get-all-attendance?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data.attendance || []);
        // Note: The API doesn't return pagination info, so we'll handle it simply
        if (data.attendance && data.attendance.length === 10) {
          setTotalPages(currentPage + 1); // Assume there might be more pages
        } else {
          setTotalPages(currentPage);
        }
      } else if (response.status === 404) {
        setAttendanceRecords([]);
        setTotalPages(1);
      } else {
        toast.error("Failed to fetch attendance history");
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      toast.error("An error occurred while fetching attendance history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateWorkingHours = (record: AttendanceRecord) => {
    if (!record.loginTime || !record.logoutTime) return "-";

    const loginTime = new Date(
      typeof record.loginTime === "number"
        ? record.loginTime
        : parseInt(record.loginTime)
    );
    const logoutTime = new Date(
      typeof record.logoutTime === "number"
        ? record.logoutTime
        : parseInt(record.logoutTime)
    );
    const workDuration =
      logoutTime.getTime() - loginTime.getTime() - (record.breakDuration || 0);

    return formatDuration(workDuration);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      absent: { color: "bg-red-100 text-red-800", icon: XCircle },
      on_leave: { color: "bg-blue-100 text-blue-800", icon: Plane },
      on_break: { color: "bg-yellow-100 text-yellow-800", icon: Coffee },
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      inactive: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const clearFilters = () => {
    setDateFilter("");
    setStatusFilter("all");
    setMonthFilter("");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    if (attendanceRecords.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Date",
      "Day",
      "Login Time",
      "Logout Time",
      "Break Duration",
      "Working Hours",
      "Status",
      "Hours Completed",
    ];

    const csvData = attendanceRecords.map((record) => [
      formatDate(record.dateOfWorking),
      record.dayOfWeek,
      formatTime(record.loginTime || ""),
      formatTime(record.logoutTime || ""),
      formatDuration(record.breakDuration || 0),
      calculateWorkingHours(record),
      record.status.replace("_", " ").toUpperCase(),
      record.workingHoursCompleted ? "Yes" : "No",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance-history-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Attendance history exported successfully!");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user data</p>
          <Button onClick={() => router.push("/signin")}>Go to Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/attendance">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Attendance
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attendance History
            </h1>
            <p className="text-gray-600 mt-1">
              View your complete attendance records and working hours
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specific Date</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={fetchAttendanceHistory} disabled={loading}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Attendance Records
            </div>
            <div className="text-sm text-gray-600">
              {attendanceRecords.length} record(s) found
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
              <span>Loading...</span>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Login</TableHead>
                      <TableHead>Logout</TableHead>
                      <TableHead>Break Duration</TableHead>
                      <TableHead>Working Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-medium">
                          {formatDate(record.dateOfWorking)}
                        </TableCell>
                        <TableCell>{record.dayOfWeek}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {formatTime(record.loginTime || "")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {formatTime(record.logoutTime || "")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Coffee className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDuration(record.breakDuration || 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Timer className="h-4 w-4 mr-1 text-gray-400" />
                            {calculateWorkingHours(record)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.workingHoursCompleted !== undefined ? (
                            <Badge
                              className={
                                record.workingHoursCompleted
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {record.workingHoursCompleted ? "Yes" : "No"}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {record.startLatitude && record.startLongitude ? (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              Available
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
