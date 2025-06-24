import React from "react";
import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  UserPlus,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { Employee } from "@/schema/employeeSchema";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface EmployeeTableProps {
  fetchEmployees: () => Promise<void>;
  filteredEmployees: Employee[];
  searchTerm: string;
  statusFilter: string;
}

function EmployeeTable({
  fetchEmployees,
  filteredEmployees,
  searchTerm,
  statusFilter,
}: EmployeeTableProps) {
  const handleDeleteEmployee = async (employeeId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/delete-employee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });

      if (response.ok) {
        toast.success("Employee deleted successfully");
        await fetchEmployees(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleRemoveAdmin = async (employeeId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove admin privileges from this employee? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/remove-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: employeeId }),
      });

      if (response.ok) {
        toast.success("Admin privileges removed successfully");
        await fetchEmployees(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to remove admin privileges");
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const promoteToAdmin = async (employeeId: string) => {
    if (
      !confirm(
        "Are you sure you want to promote this employee to admin? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/promote-to-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: employeeId }),
      });

      if (response.ok) {
        toast.success("Employee promoted to admin successfully");
        await fetchEmployees(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to promote employee");
      }
    } catch (error) {
      console.error("Error promoting employee:", error);
      toast.error("Network error. Please try again.");
    }
  };
  return (
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Id</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role & Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell className="font-medium text-gray-900 text-center">
                  {employee._id.slice(-8).toLocaleUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {employee.designation}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-3 w-3 mr-1" />
                      {employee.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-1" />
                      {employee.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {employee.role}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-3 w-3 mr-1" />
                      {employee.department}
                    </div>
                    <p className="text-xs text-gray-500">{employee.level}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs ${getStatusColor(employee.status)}`}
                  >
                    {employee.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">
                    {formatDate(employee.createdAt)}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/edit-employee-information/${employee._id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Employee
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/attendance/${employee._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          View Attendance
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Employee
                      </DropdownMenuItem>
                      {employee.role !== "admin" ? (
                        <DropdownMenuItem
                          onClick={() => promoteToAdmin(employee._id)}
                          className="text-blue-600 focus:text-blue-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleRemoveAdmin(employee._id)}
                          className="text-blue-600 focus:text-blue-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEmployees.length === 0 && (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No employees found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by adding a new employee."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <div className="mt-6">
                <Link href="/dashboard/employees/add">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Employee
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
}

export default EmployeeTable;
