"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, Mail } from "lucide-react";
import Link from "next/link";
import EmployeeIdCard from "@/components/EmployeeIdCard";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "admin" | "employee";
  designation: string;
  department?: string;
  level?: string;
  status: string;
  dateOfJoining?: string;
  employeeId?: string;
  address?: string;
  emergencyContact?: string;
}

export default function IdCardPage() {
  const [user, setUser] = useState<User | null>(null);
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

  const handleEmailIdCard = () => {
    if (user) {
      const subject = `Employee ID Card - ${user.firstName} ${user.lastName}`;
      const body = `Hello,

Please find my employee identification card details below:

Name: ${user.firstName} ${user.lastName}
Employee ID: ${user.employeeId || `EMP${(user.firstName.substring(0, 2) + user.lastName.substring(0, 2)).toUpperCase()}${user._id.substring(user._id.length - 4)}`}
Designation: ${user.designation}
Department: ${user.department || 'Not specified'}
Email: ${user.email}

This email serves as a digital copy of my employee identification.

Best regards,
${user.firstName} ${user.lastName}`;
      
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ID card...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load your ID card</p>
          <Button onClick={() => router.push("/signin")}>Go to Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/profile">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee ID Card</h1>
            <p className="text-gray-600 mt-1">Your official employee identification card</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEmailIdCard}
            className="flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Employee ID Card',
                  text: `${user.firstName} ${user.lastName} - Employee ID Card`,
                  url: window.location.href
                });
              }
            }}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ID Card */}
        <div className="lg:col-span-2">
          <EmployeeIdCard user={user} />
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
              <CardDescription>Instructions for your employee ID card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Digital Access</h4>
                <p className="text-sm text-gray-600">
                  Use this digital ID for online verification and virtual meetings.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Printing</h4>
                <p className="text-sm text-gray-600">
                  Click the print button to create a physical copy. Print on quality cardstock for best results.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Security</h4>
                <p className="text-sm text-gray-600">
                  Keep your employee ID secure. Report any lost or stolen cards to HR immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Update Profile Information
                </Button>
              </Link>
              
              <Link href="/dashboard/change-password" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
              </Link>
              
              <Link href="/dashboard/attendance" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Mark Attendance
                </Button>
              </Link>
              
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full justify-start">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Employee Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium text-gray-500">Full Name:</span>
                <p className="text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
              
              <div className="text-sm">
                <span className="font-medium text-gray-500">Employee ID:</span>
                <p className="text-gray-900 font-mono">
                  {user.employeeId || `EMP${(user.firstName.substring(0, 2) + user.lastName.substring(0, 2)).toUpperCase()}${user._id.substring(user._id.length - 4)}`}
                </p>
              </div>
              
              <div className="text-sm">
                <span className="font-medium text-gray-500">Designation:</span>
                <p className="text-gray-900">{user.designation}</p>
              </div>
              
              {user.department && (
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Department:</span>
                  <p className="text-gray-900">{user.department}</p>
                </div>
              )}
              
              <div className="text-sm">
                <span className="font-medium text-gray-500">Status:</span>
                <p className="text-gray-900 capitalize">{user.status}</p>
              </div>
              
              {user.dateOfJoining && (
                <div className="text-sm">
                  <span className="font-medium text-gray-500">Date of Joining:</span>
                  <p className="text-gray-900">
                    {new Date(user.dateOfJoining).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
