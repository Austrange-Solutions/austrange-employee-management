/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Building2, TrendingUp, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  departments: { [key: string]: number };
  recentEmployees: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    onLeaveEmployees: 0,
    departments: {},
    recentEmployees: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your team.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/admin/employees/add">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Link href="/admin/employees">
                  <Button variant="outline" className="w-full">
                    View All Employees
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/employees/add">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                <UserPlus className="h-5 w-5" />
                <span className="text-sm">Add Employee</span>
              </Button>
            </Link>
            <Link href="/admin/employees">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Manage Employees</span>
              </Button>
            </Link>
            <Link href="/admin/profile">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                <Building2 className="h-5 w-5" />
                <span className="text-sm">Admin Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
