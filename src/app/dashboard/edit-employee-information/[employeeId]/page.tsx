"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Shield,
  User,
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import {
  createEmployeeSchema,
  type CreateEmployeeFormData,
} from "@/schema/createEmployeeSchema";
import { departments, levels } from "@/lib/constants";
import useAuthStore from "@/store/authSlice";
import { TUser } from "@/models/user.model";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  const [currentUser, setCurrentUser] = useState<TUser | null>(null);
  const [employee, setEmployee] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<
    Partial<CreateEmployeeFormData & { status: string }>
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    dateOfBirth: "",
    department: "",
    department_code: "",
    level: "",
    level_code: "",
    designation: "",
    dateOfJoining: "",
    username: "",
    workingHours: "",
    bloodGroup: "",
    status: "active",
    password: "", // Will be hidden in edit mode
  });
  const userDetails = useAuthStore((state) => state.user);
  // Check admin authentication
  useEffect(() => {
    if (userDetails && userDetails.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard");
    }
    setCurrentUser(userDetails);
  }, [router]);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!currentUser || !employeeId) return;

      try {
        const response = await fetch(
          `/api/admin/get-employee?id=${employeeId}`
        );
        if (response.ok) {
          const data = await response.json();
          const emp = data.employee;

          setEmployee(emp);
          setFormData({
            firstName: emp.firstName || "",
            lastName: emp.lastName || "",
            email: emp.email || "",
            phone: emp.phone || "",
            age: emp.age?.toString() || "",
            address: emp.address || "",
            city: emp.city || "",
            state: emp.state || "",
            country: emp.country || "",
            zip: emp.zip || "",
            dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "",
            department: emp.department || "",
            department_code: emp.department_code || "",
            level: emp.level || "",
            level_code: emp.level_code || "",
            designation: emp.designation || "",
            dateOfJoining: emp.dateOfJoining
              ? emp.dateOfJoining.split("T")[0]
              : "",
            username: emp.username || "",
            workingHours: emp.workingHours || "",
            bloodGroup: emp.bloodGroup || "",
            status: emp.status || "active",
            password: "", // Don't populate password
          });
        } else {
          toast.error("Failed to fetch employee data");
          router.push("/dashboard/employees");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Error fetching employee data");
        router.push("/dashboard/employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [currentUser, employeeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      // Create a validation object without password for existing employees
      const validationData = { ...formData };
      delete validationData.password; // Remove password from validation for updates

      // Validate form data (excluding password)
      const validatedData = createEmployeeSchema
        .omit({ password: true })
        .parse(validationData);

      const updateData = {
        employeeId,
        ...validatedData,
        status: formData.status,
      };
      const response = await fetch("/api/admin/update-employee-by-admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Employee updated successfully!");
        router.push("/dashboard/employees");
      } else {
        toast.error(data.error || "Failed to update employee");
      }
    } catch (error: unknown) {
      console.error("Update error:", error);
      if (error && typeof error === "object" && "errors" in error) {
        // Handle Zod validation errors
        const fieldErrors: Record<string, string> = {};
        (
          error as { errors: Array<{ path?: string[]; message: string }> }
        ).errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error(
          fieldErrors[Object.keys(fieldErrors)[0]] || "Validation error"
        );
      } else {
        toast.error("Failed to update employee");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "department") {
      const dept_code = departments.find((dept) => dept.name === value)?.code;
      setFormData((prev) => ({ ...prev, department_code: dept_code }));
    }
    if (name === "level") {
      const level_code = levels.find((lvl) => lvl.name === value)?.code;
      setFormData((prev) => ({ ...prev, level_code }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Employee not found</p>
          <Button asChild>
            <Link href="/dashboard/employees">Back to Employees</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
            <p className="text-gray-600 mt-1">
              Update employee information and details
            </p>
          </div>
        </div>
        <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
          <Shield className="h-3 w-3 mr-1" />
          {employee.role.toUpperCase()}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="18"
                  max="100"
                />
                {errors.age && (
                  <p className="text-sm text-red-600">{errors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) =>
                    handleSelectChange("bloodGroup", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bloodGroup && (
                  <p className="text-sm text-red-600">{errors.bloodGroup}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </CardTitle>
            <CardDescription>Location and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="Enter ZIP code"
                />
                {errors.zip && (
                  <p className="text-sm text-red-600">{errors.zip}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Work Information
            </CardTitle>
            <CardDescription>
              Job-related details and department information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.name} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_code">Department Code</Label>
                {/* <Select
                  value={formData.department_code}
                  onValueChange={(value) =>
                    handleSelectChange("department_code", value)
                  }
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department code" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.code} value={dept.code}>
                        {dept.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <Input
                  id="department_code"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleChange}
                  placeholder="Enter department code"
                  disabled
                />
                {errors.department_code && (
                  <p className="text-sm text-red-600">
                    {errors.department_code}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((lvl) => (
                      <SelectItem key={lvl.name} value={lvl.name}>
                        {lvl.name.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.level && (
                  <p className="text-sm text-red-600">{errors.level}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level_code">Level Code</Label>
                <Input
                  id="level_code"
                  name="level_code"
                  value={formData.level_code}
                  onChange={handleChange}
                  placeholder="Enter level code"
                  disabled
                />
                {errors.level_code && (
                  <p className="text-sm text-red-600">{errors.level_code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />
                {errors.designation && (
                  <p className="text-sm text-red-600">{errors.designation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input
                  id="dateOfJoining"
                  name="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
                {errors.dateOfJoining && (
                  <p className="text-sm text-red-600">{errors.dateOfJoining}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input
                  id="workingHours"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  placeholder="e.g., 8:00"
                />
                {errors.workingHours && (
                  <p className="text-sm text-red-600">{errors.workingHours}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/employees">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
