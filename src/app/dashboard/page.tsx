/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  Building2, 
  TrendingUp, 
  Calendar, 
  Clock, 
  User,
  Settings,
  Key,
  Activity,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'employee';
  designation: string;
  department?: string;
  level?: string;
  status: string;
  dateOfJoining?: string;
  createdAt: string;
}

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  departments: { [key: string]: number };
  recentEmployees: any[];
}

export default function UnifiedDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    onLeaveEmployees: 0,
    departments: {},
    recentEmployees: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
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
    
    fetchUser();
  }, [router]);
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/get-all-employees?limit=1000");
      if (response.ok) {
        const data = await response.json();
        const employees = data.employees?.docs || [];
        
        // Calculate stats
        const activeCount = employees.filter((emp: any) => emp.status === 'active').length;
        const inactiveCount = employees.filter((emp: any) => emp.status === 'inactive').length;
        const onLeaveCount = employees.filter((emp: any) => emp.status === 'on_leave').length;
        
        // Department breakdown
        const deptBreakdown: { [key: string]: number } = {};
        employees.forEach((emp: any) => {
          const dept = emp.department || 'Unassigned';
          deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
        });

        // Recent employees (last 5)
        const recent = employees
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalEmployees: employees.length,
          activeEmployees: activeCount,
          inactiveEmployees: inactiveCount,
          onLeaveEmployees: onLeaveCount,
          departments: deptBreakdown,
          recentEmployees: recent
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTenure = (joiningDate: string) => {
    if (!joiningDate) return "N/A";
    const start = new Date(joiningDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p>Unable to load user data. Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {user.role === 'admin' 
              ? "Here's what's happening with your team." 
              : "Here's your personal dashboard overview."}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {user.role === 'admin' && (
            <Link href="/dashboard/employees/add">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          )}
          <Link href="/dashboard/profile">
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Role-specific Stats Cards */}
      {user.role === 'admin' ? (
        // Admin Dashboard - Company Stats
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-blue-100">Total workforce</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeEmployees}</div>
              <p className="text-xs text-green-100">Currently working</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onLeaveEmployees}</div>
              <p className="text-xs text-orange-100">Temporary absence</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.departments).length}</div>
              <p className="text-xs text-purple-100">Active departments</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Employee Dashboard - Personal Stats
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employee ID</CardTitle>
              <User className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">#{user._id.slice(-8).toUpperCase()}</div>
              <p className="text-xs text-indigo-100">Your unique ID</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department</CardTitle>
              <Building2 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{user.department || 'Unassigned'}</div>
              <p className="text-xs text-green-100">Your department</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold capitalize">{user.status}</div>
              <p className="text-xs text-orange-100">Current status</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenure</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{calculateTenure(user.dateOfJoining || user.createdAt)}</div>
              <p className="text-xs text-purple-100">Time with company</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user.role === 'admin' ? (
          // Admin-specific content
          <>
            {/* Department Breakdown */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                  Department Breakdown
                </CardTitle>
                <CardDescription>Employee distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.departments).map(([dept, count]) => (
                    <div key={dept} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {dept}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{count}</Badge>
                        <span className="text-xs text-gray-500">
                          {stats.totalEmployees > 0 ? Math.round((count / stats.totalEmployees) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(stats.departments).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No departments found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Employees */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Recent Employees
                </CardTitle>
                <CardDescription>Latest additions to the team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentEmployees.map((employee) => (
                    <div key={employee._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.designation} • {employee.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={employee.status === 'active' ? 'default' : 'secondary'}
                          className={employee.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {employee.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(employee.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {stats.recentEmployees.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent employees</p>
                  )}
                </div>
                {stats.recentEmployees.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/dashboard/employees">
                      <Button variant="outline" className="w-full">
                        View All Employees
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          // Employee-specific content
          <>
            {/* Personal Information Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Full Name</span>
                    <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Username</span>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Role</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Work Information Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-green-600" />
                  Work Information
                </CardTitle>
                <CardDescription>Your employment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Designation</span>
                    <span className="text-sm font-medium">{user.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Department</span>
                    <span className="text-sm font-medium">{user.department || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Level</span>
                    <span className="text-sm font-medium">{user.level || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'secondary'}
                      className={`text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/change-password">
                    <Button variant="outline" className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            {user.role === 'admin' ? 'Common administrative tasks' : 'Common tasks and shortcuts'}
          </CardDescription>
        </CardHeader>
        <CardContent>          {user.role === 'admin' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/dashboard/employees/add">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm">Add Employee</span>
                </Button>
              </Link>
              <Link href="/dashboard/employees">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Manage Employees</span>
                </Button>
              </Link>
              <Link href="/dashboard/attendance">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Attendance</span>
                </Button>
              </Link>
              <Link href="/dashboard/admin-settings">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Admin Settings</span>
                </Button>
              </Link>
            </div>          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/dashboard/attendance">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Mark Attendance</span>
                </Button>
              </Link>
              <Link href="/dashboard/id-card">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm">ID Card</span>
                </Button>
              </Link>
              <Link href="/dashboard/attendance/history">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">Attendance History</span>
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm">Update Profile</span>
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
