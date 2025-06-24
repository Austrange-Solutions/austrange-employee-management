"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments, levels } from "@/lib/constants";
import EmployeeTable from "@/components/EmployeeTable";
import { Employee } from "@/schema/employeeSchema";

interface User {
  role: "admin" | "employee";
}

export default function EmployeeManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (statusFilter && statusFilter !== "all") {
      params.append("status", statusFilter);
    }
    if (departmentFilter && departmentFilter !== "all") {
      params.append("department", departmentFilter);
    }
    if (levelFilter && levelFilter !== "all") {
      params.append("level", levelFilter);
    }
    params.append("limit", "1000"); // Fetch all employees for admin view
    params.append("sort", "createdAt"); // Sort by creation date
    params.append("order", "desc"); // Newest first
    const paramsString = params.toString();
    try {
      const response = await fetch(
        `/api/admin/get-all-employees?${paramsString}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data.employees?.docs || []);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, departmentFilter, levelFilter]);
  useEffect(() => {
    // Fetch employees whenever filters change
    if (user && user.role === "admin") {
      fetchEmployees();
    }
  }, [
    searchTerm,
    statusFilter,
    departmentFilter,
    levelFilter,
    user,
    fetchEmployees,
  ]);

  const checkAuthAndFetchData = async () => {
    try {
      // Check if user is admin
      const authResponse = await fetch("/api/current-user");
      if (authResponse.ok) {
        const authData = await authResponse.json();
        setUser(authData.user);

        if (authData.user.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          router.push("/dashboard");
          return;
        }

        // Fetch employees if user is admin
        await fetchEmployees();
      } else {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  // const fetchEmployees = async () => {
  //   try {
  //     const response = await fetch("/api/admin/get-all-employees?limit=1000");
  //     if (response.ok) {
  //       const data = await response.json();
  //       setEmployees(data.employees?.docs || []);
  //     } else {
  //       toast.error("Failed to fetch employees");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //     toast.error("Network error. Please try again.");
  //   }
  // };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // if (loading) {
  //   return (
  //     <div className="p-6">
  //       <div className="animate-pulse space-y-6">
  //         <div className="h-8 bg-gray-200 rounded w-1/4"></div>
  //         <div className="h-64 bg-gray-200 rounded-lg"></div>
  //       </div>
  //     </div>
  //   );
  // }

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              Access denied. Admin privileges required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="h-8 w-8 mr-3 text-indigo-600" />
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage all employees, view details, and perform administrative
            actions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/employees/add">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((emp) => emp.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((emp) => emp.status === "on_leave").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((emp) => emp.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees by name, email, designation, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.name} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level.name} value={level.name}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Employees ({filteredEmployees.length})</CardTitle>
          <CardDescription>
            Complete list of employees with their details and status
          </CardDescription>
        </CardHeader>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4 p-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmployeeTable
            filteredEmployees={filteredEmployees}
            fetchEmployees={fetchEmployees}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        )}
      </Card>
    </div>
  );
}
