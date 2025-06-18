"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Building2, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Austrange Solutions
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Employee Management Portal
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Admin Login Card */}
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <CardHeader className="relative text-center pt-8">
              <div className="mx-auto mb-4 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-fit">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Administrator
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Manage employees, departments, and system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="relative text-center pb-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users className="h-4 w-4" />
                  <span>Employee Management</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <UserCheck className="h-4 w-4" />
                  <span>Department Control</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link href="/signin" className="block">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3">
                    Sign In as Admin
                  </Button>
                </Link>
                <Link href="/admin/signup" className="block">
                  <Button variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    Create Admin Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Employee Login Card */}
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10"></div>
            <CardHeader className="relative text-center pt-8">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Employee
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Access your profile, update information, and view details
              </CardDescription>
            </CardHeader>
            <CardContent className="relative text-center pb-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <UserCheck className="h-4 w-4" />
                  <span>Profile Management</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Building2 className="h-4 w-4" />
                  <span>Department Info</span>
                </div>
              </div>
              <Link href="/signin" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3">
                  Sign In as Employee
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Streamlined Employee Management
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
              <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Role-based authentication and secure data management
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Easy Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Intuitive interface for managing employee information
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Organized Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Department-wise organization and efficient search
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
