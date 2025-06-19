/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Building2,
  CalendarDays,
  Key,
  Clock,
  History,
} from "lucide-react";
import Image from "next/image";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "employee";
  designation: string;
  department?: string;
  status: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for signin/signup pages
  const isAuthPage =
    pathname?.includes("/signin") || pathname?.includes("/signup");  useEffect(() => {
    const checkAuthAsync = async () => {
      try {
        const response = await fetch("/api/current-user");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Redirect to unified signin page
          router.push("/signin");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthPage) {
      checkAuthAsync();
    } else {
      setLoading(false);
    }
  }, [isAuthPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Role-based navigation
  const getNavigation = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Attendance", href: "/dashboard/attendance", icon: Clock },
      { name: "Attendance History", href: "/dashboard/attendance/history", icon: History },
      { name: "My Profile", href: "/dashboard/profile", icon: User },
      {
        name: "Change Password",
        href: "/dashboard/change-password",
        icon: Key,
      },
    ];

    // Admin-only features
    const adminNavigation = [
      { name: "All Employees", href: "/dashboard/employees", icon: Users },
      {
        name: "Add Employee",
        href: "/dashboard/employees/add",
        icon: UserPlus,
      },
      { name: "Departments", href: "/dashboard/departments", icon: Building2 },
      { name: "Reports", href: "/dashboard/reports", icon: CalendarDays },
      {
        name: "Admin Settings",
        href: "/dashboard/admin-settings",
        icon: Settings,
      },
    ];

    return user?.role === "admin"
      ? [...baseNavigation, ...adminNavigation]
      : baseNavigation;
  };

  const navigation = getNavigation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Return children directly for auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
              <Image
                src="/assets/images/Austrange Logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Austrange
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {String(user?.role.charAt(0).toUpperCase()) + String(user?.role.slice(1))}{" "}
                Portal
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SidebarContent
          navigation={navigation}
          pathname={pathname}
          user={user}
        />
      </div>

      {/* Main content */}
      <div className="w-full">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                  {pathname === "/dashboard"
                    ? "Dashboard"
                    : pathname
                        ?.split("/")
                        .pop()
                        ?.replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Role Badge */}
              <Badge
                variant={user?.role === "admin" ? "default" : "secondary"}
                className={
                  user?.role === "admin"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {user?.role === "admin" ? "Administrator" : "Employee"}
              </Badge>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-medium">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.designation}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/attendance" className="cursor-pointer">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Attendance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/change-password"
                      className="cursor-pointer"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      <span>Change Password</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/admin-settings"
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  navigation,
  pathname,
  user,
}: {
  navigation: any[];
  pathname: string | null;
  user: User | null;
}) {
  return (
    <>
      <div className="flex-1 py-6 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive
                    ? "text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* User info at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.designation}
            </p>
            {user?.department && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.department}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
