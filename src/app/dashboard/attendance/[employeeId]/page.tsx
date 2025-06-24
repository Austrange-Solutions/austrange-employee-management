"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";
import AttendanceTable from "@/components/Attendance/AttendanceTable";
import { Attendance } from "@/schema/attendanceSchema";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  department?: string;
}

type EmployeeAttendanceParams = {
  params: Promise<{
    employeeId: string;
  }>;
};
function EmployeeAttendance({ params }: EmployeeAttendanceParams) {
  const { employeeId } = use(params);

  return (
    <Suspense fallback={<EmployeeAttendanceLoading />}>
      <EmployeeAttendanceContent employeeId={employeeId} />
    </Suspense>
  );
}

function EmployeeAttendanceContent({ employeeId }: { employeeId: string }) {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch employee details
        const employeeResponse = await fetch(
          `/api/admin/get-employee?id=${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!employeeResponse.ok) {
          throw new Error("Failed to fetch employee details");
        }

        const employeeData = await employeeResponse.json();
        setEmployee(employeeData.employee);

        // Fetch attendance data
        const attendanceResponse = await fetch(
          `/api/attendance/get-all-attendance?userId=${employeeId}&limit=100`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const attendanceResponseData = await attendanceResponse.json();
        setAttendanceData(attendanceResponseData.attendance || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (loading) {
    return <EmployeeAttendanceLoading />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/dashboard/employees">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate attendance statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(
    (record) => record.status === "present"
  ).length;
  const absentDays = attendanceData.filter(
    (record) => record.status === "absent"
  ).length;
  const attendancePercentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Employee Attendance
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed attendance record and statistics
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Employee Info Section */}
      {employee && (
        <div className="space-y-6">
          {/* Employee Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {employee.firstName} {employee.lastName}{" "}
                    </h2>
                  </div>
                  <div>
                    <Badge className="bg-white/20 text-white text-xs font-mono">
                      {employee._id.slice(-8).toLocaleUpperCase()}
                    </Badge>
                  </div>
                </div>

                <p className="text-indigo-100 text-lg">
                  {employee.designation} •{" "}
                  {employee.department || "No Department"}
                </p>
                <p className="text-indigo-200 text-sm">{employee.email}</p>
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Records
                  </p>
                  <p className="text-3xl font-bold">{totalDays}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
              <p className="text-blue-100 text-xs mt-2">
                Total attendance entries
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Present Days
                  </p>
                  <p className="text-3xl font-bold">{presentDays}</p>
                </div>
                <User className="h-8 w-8 text-green-200" />
              </div>
              <p className="text-green-100 text-xs mt-2">Days marked present</p>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">
                    Absent Days
                  </p>
                  <p className="text-3xl font-bold">{absentDays}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
              <p className="text-red-100 text-xs mt-2">Days marked absent</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Attendance Rate
                  </p>
                  <p className="text-3xl font-bold">{attendancePercentage}%</p>
                </div>
                <Filter className="h-8 w-8 text-purple-200" />
              </div>
              <p className="text-purple-100 text-xs mt-2">
                Overall attendance percentage
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Attendance Records
              </CardTitle>
              <CardDescription>
                Complete attendance history and details
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {attendanceData.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {attendanceData.length > 0 ? (
            <AttendanceTable attendanceData={attendanceData} />
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Attendance Records
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No attendance data found for this employee.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmployeeAttendanceLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Employee Info Section Skeleton */}
      <div className="space-y-6">
        {/* Employee Header Skeleton */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full bg-white/20" />
            <div>
              <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-5 w-48 mb-1 bg-white/20" />
              <Skeleton className="h-4 w-40 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Attendance Statistics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
                <Skeleton className="h-8 w-12 bg-white/20" />
              </div>
              <Skeleton className="h-8 w-8 rounded bg-white/20" />
            </div>
            <Skeleton className="h-3 w-32 mt-2 bg-white/20" />
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
                <Skeleton className="h-8 w-12 bg-white/20" />
              </div>
              <Skeleton className="h-8 w-8 rounded bg-white/20" />
            </div>
            <Skeleton className="h-3 w-32 mt-2 bg-white/20" />
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
                <Skeleton className="h-8 w-12 bg-white/20" />
              </div>
              <Skeleton className="h-8 w-8 rounded bg-white/20" />
            </div>
            <Skeleton className="h-3 w-32 mt-2 bg-white/20" />
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
                <Skeleton className="h-8 w-12 bg-white/20" />
              </div>
              <Skeleton className="h-8 w-8 rounded bg-white/20" />
            </div>
            <Skeleton className="h-3 w-32 mt-2 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Attendance Table Skeleton */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeAttendance;
