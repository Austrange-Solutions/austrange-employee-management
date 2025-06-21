"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, MapPin, Save, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EmployeeIdCard from "@/components/EmployeeIdCard";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'employee';
  designation: string;
  department?: string;
  level?: string;
  age?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  dateOfBirth?: string;
  dateOfJoining?: string;
  status: string;
  createdAt: string;
}

export default function UnifiedProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
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
    designation: "",
  });
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/current-user");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            age: data.user.age || "",
            address: data.user.address || "",
            city: data.user.city || "",
            state: data.user.state || "",
            country: data.user.country || "",
            zip: data.user.zip || "",
            designation: data.user.designation || "",
          });
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch("/api/employee/update-employee-by-self", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
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
            <p>Unable to load profile data. Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl font-bold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user.designation} • {user.department || 'No Department'}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge 
              variant={user.role === 'admin' ? 'default' : 'secondary'}
              className={user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}
            >
              {user.role === 'admin' ? (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  Administrator
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Employee
                </>
              )}
            </Badge>
            <Badge 
              variant={user.status === 'active' ? 'default' : 'secondary'}
              className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
            >
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-600" />
              User Information
            </CardTitle>
            <CardDescription>Your account details and system information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</Label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employee ID</Label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">#{user._id.slice(-8).toUpperCase()}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</Label>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</Label>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user.status}</p>
              </div>
              {user.department && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.department}</p>
                  </div>
                </>
              )}
              {user.level && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Level</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.level}</p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Member Since</Label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
              </div>
              {user.dateOfJoining && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Joining</Label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(user.dateOfJoining)}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                Edit Profile
              </CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1"
                        placeholder="Enter your full address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Employee ID Card */}
        <div className="lg:col-span-1">
          <EmployeeIdCard user={user} />
        </div>
      </div>
    </div>
  );
}
