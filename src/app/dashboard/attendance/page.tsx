"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Coffee,
  LogOut,
  LogIn,
  Plane,
  AlertTriangle,
  Timer,
  User,
} from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  workingHours: string;
}

interface AttendanceRecord {
  _id: string;
  user: string;
  dateOfWorking: string;
  dayOfWeek: string;
  loginTime?: string;
  logoutTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  breakDuration?: number;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  workingHoursCompleted?: boolean;
  status:
    | "present"
    | "absent"
    | "on_leave"
    | "on_break"
    | "active"
    | "inactive";
  createdAt: string;
  updatedAt: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []); // Fetch current user and today's attendance
  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await fetch("/api/current-user");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          await fetchTodayAttendance(data.user._id);
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

    initializeData();
    getCurrentLocation();
  }, [router]);
  const fetchTodayAttendance = async (userId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `/api/attendance/get-all-attendance?userId=${userId}&date=${today}&limit=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.attendance && data.attendance.length > 0) {
          setTodayAttendance(data.attendance[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Could not get your location. Please enable location services."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const markLogin = async () => {
    if (!user || !currentLocation) {
      toast.error("User data or location not available");
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date();
      const response = await fetch("/api/attendance/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          dateOfWorking: now.toISOString().split("T")[0],
          dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
          loginTime: now.getTime(),
          startLatitude: currentLocation.latitude,
          startLongitude: currentLocation.longitude,
          status: "present",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login attendance marked successfully!");
        await fetchTodayAttendance(user._id);
      } else {
        toast.error(data.error || "Failed to mark login attendance");
      }
    } catch (error) {
      console.error("Error marking login:", error);
      toast.error("An error occurred while marking attendance");
    } finally {
      setActionLoading(false);
    }
  };

  const markLogout = async () => {
    if (!user || !currentLocation || !todayAttendance) {
      toast.error("Cannot mark logout without login attendance");
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date();
      const response = await fetch("/api/attendance/logout-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          dateOfWorking: now.toISOString().split("T")[0],
          logoutTime: now.getTime(),
          endLatitude: currentLocation.latitude,
          endLongitude: currentLocation.longitude,
          status: "inactive",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Logout attendance marked successfully!");
        await fetchTodayAttendance(user._id);
      } else {
        toast.error(data.error || "Failed to mark logout attendance");
      }
    } catch (error) {
      console.error("Error marking logout:", error);
      toast.error("An error occurred while marking logout");
    } finally {
      setActionLoading(false);
    }
  };

  const startBreak = async () => {
    if (!user || !todayAttendance) {
      toast.error("Cannot start break without login attendance");
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date();
      const response = await fetch("/api/attendance/start-break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          dateOfWorking: now.toISOString().split("T")[0],
          breakStartTime: now.getTime(),
          status: "on_break",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Break started successfully!");
        await fetchTodayAttendance(user._id);
      } else {
        toast.error(data.error || "Failed to start break");
      }
    } catch (error) {
      console.error("Error starting break:", error);
      toast.error("An error occurred while starting break");
    } finally {
      setActionLoading(false);
    }
  };

  const endBreak = async () => {
    if (!user || !todayAttendance || !todayAttendance.breakStartTime) {
      toast.error("Cannot end break without starting it first");
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date();
      const response = await fetch("/api/attendance/end-break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          dateOfWorking: now.toISOString().split("T")[0],
          breakEndTime: now.getTime(),
          status: "active",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Break ended successfully!");
        await fetchTodayAttendance(user._id);
      } else {
        toast.error(data.error || "Failed to end break");
      }
    } catch (error) {
      console.error("Error ending break:", error);
      toast.error("An error occurred while ending break");
    } finally {
      setActionLoading(false);
    }
  };

  const markLeave = async () => {
    if (!user || !currentLocation) {
      toast.error("User data or location not available");
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date();
      const response = await fetch("/api/attendance/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          dateOfWorking: now.toISOString().split("T")[0],
          dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
          loginTime: now.getTime(),
          startLatitude: currentLocation.latitude,
          startLongitude: currentLocation.longitude,
          status: "on_leave",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Leave marked successfully!");
        await fetchTodayAttendance(user._id);
      } else {
        toast.error(data.error || "Failed to mark leave");
      }
    } catch (error) {
      console.error("Error marking leave:", error);
      toast.error("An error occurred while marking leave");
    } finally {
      setActionLoading(false);
    }
  };

  const markAbsent = async () => {
    if (!user || !currentLocation) {
      toast.error("User data or location not available");
      return;
    }

    setActionLoading(true);
    try {
      const now = new Date();
      const response = await fetch("/api/attendance/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          dateOfWorking: now.toISOString().split("T")[0],
          dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
          loginTime: now.getTime(),
          startLatitude: currentLocation.latitude,
          startLongitude: currentLocation.longitude,
          status: "absent",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Absent status marked successfully!");
        await fetchTodayAttendance(user._id);
      } else {
        toast.error(data.error || "Failed to mark absent");
      }
    } catch (error) {
      console.error("Error marking absent:", error);
      toast.error("An error occurred while marking absent");
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timestamp: string | number) => {
    const date = new Date(
      typeof timestamp === "number" ? timestamp : parseInt(timestamp)
    );
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      absent: { color: "bg-red-100 text-red-800", icon: XCircle },
      on_leave: { color: "bg-blue-100 text-blue-800", icon: Plane },
      on_break: { color: "bg-yellow-100 text-yellow-800", icon: Coffee },
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      inactive: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user data</p>
          <Button onClick={() => router.push("/signin")}>Go to Sign In</Button>
        </div>
      </div>
    );
  }
  const isLoggedIn =
    todayAttendance && todayAttendance.loginTime && !todayAttendance.logoutTime;
  const isLoggedOut = !!(todayAttendance && todayAttendance.logoutTime);
  const isOnBreak = !!(
    todayAttendance && todayAttendance.status === "on_break"
  );
  const hasAttendanceToday = todayAttendance !== null;
  const isLeaveOrAbsent = !!(
    todayAttendance &&
    (todayAttendance.status === "on_leave" ||
      todayAttendance.status === "absent")
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance System
          </h1>
          <p className="text-gray-600 mt-1">
            Mark your daily attendance and track your work hours
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-gray-600 mb-1">
            <User className="h-4 w-4 mr-2" />
            {user.firstName} {user.lastName}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {currentTime.toLocaleTimeString("en-US", { hour12: true })}
          </div>
        </div>
      </div>

      {/* Current Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today&apos;s Status
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasAttendanceToday ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No attendance recorded for today. Please mark your attendance.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status:</span>
                {getStatusBadge(todayAttendance.status)}
              </div>

              {todayAttendance.loginTime && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Login Time</span>
                    <span className="font-medium">
                      {formatTime(todayAttendance.loginTime)}
                    </span>
                  </div>

                  {todayAttendance.logoutTime && (
                    <div>
                      <span className="text-gray-500 block">Logout Time</span>
                      <span className="font-medium">
                        {formatTime(todayAttendance.logoutTime)}
                      </span>
                    </div>
                  )}

                  {todayAttendance.breakDuration &&
                    todayAttendance.breakDuration > 0 && (
                      <div>
                        <span className="text-gray-500 block">
                          Break Duration
                        </span>
                        <span className="font-medium">
                          {formatDuration(todayAttendance.breakDuration)}
                        </span>
                      </div>
                    )}

                  {todayAttendance.workingHoursCompleted !== undefined && (
                    <div>
                      <span className="text-gray-500 block">Working Hours</span>
                      <span
                        className={`font-medium ${
                          todayAttendance.workingHoursCompleted
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {todayAttendance.workingHoursCompleted
                          ? "Completed"
                          : "Incomplete"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Location: {currentLocation ? "Available" : "Requesting..."}
            </span>
            {!currentLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                className="ml-auto"
              >
                Refresh Location
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Login Button */}
        <Button
          onClick={markLogin}
          disabled={actionLoading || hasAttendanceToday || !currentLocation}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant={!hasAttendanceToday ? "default" : "outline"}
        >
          <LogIn className="h-6 w-6" />
          <span>Mark Login</span>
        </Button>

        {/* Logout Button */}
        <Button
          onClick={markLogout}
          disabled={
            actionLoading || !isLoggedIn || isLoggedOut || !currentLocation
          }
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant={isLoggedIn && !isLoggedOut ? "default" : "outline"}
        >
          <LogOut className="h-6 w-6" />
          <span>Mark Logout</span>
        </Button>

        {/* Break Button */}
        <Button
          onClick={isOnBreak ? endBreak : startBreak}
          disabled={
            actionLoading || !isLoggedIn || isLoggedOut || isLeaveOrAbsent
          }
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant={isLoggedIn && !isLoggedOut ? "default" : "outline"}
        >
          <Coffee className="h-6 w-6" />
          <span>{isOnBreak ? "End Break" : "Start Break"}</span>
        </Button>

        {/* Leave/Absent Button */}
        <div className="space-y-2">
          <Button
            onClick={markLeave}
            disabled={actionLoading || hasAttendanceToday || !currentLocation}
            className="w-full h-10 flex items-center justify-center space-x-2"
            variant="outline"
          >
            <Plane className="h-4 w-4" />
            <span>Mark Leave</span>
          </Button>
          <Button
            onClick={markAbsent}
            disabled={actionLoading || hasAttendanceToday || !currentLocation}
            className="w-full h-10 flex items-center justify-center space-x-2"
            variant="outline"
          >
            <XCircle className="h-4 w-4" />
            <span>Mark Absent</span>
          </Button>
        </div>
      </div>

      {/* Working Hours Info */}
      {user.workingHours && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="h-5 w-5 mr-2" />
              Working Hours Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Expected Hours</span>
                <span className="font-medium">{user.workingHours} daily</span>
              </div>

              {isLoggedIn && todayAttendance?.loginTime && (
                <div>
                  <span className="text-gray-500 block">
                    Hours Worked Today
                  </span>
                  <span className="font-medium">
                    {formatDuration(
                      (isLoggedOut && todayAttendance.logoutTime
                        ? new Date(
                            typeof todayAttendance.logoutTime === "number"
                              ? todayAttendance.logoutTime
                              : parseInt(todayAttendance.logoutTime)
                          ).getTime()
                        : currentTime.getTime()) -
                        new Date(
                          typeof todayAttendance.loginTime === "number"
                            ? todayAttendance.loginTime
                            : parseInt(todayAttendance.loginTime)
                        ).getTime() -
                        (todayAttendance.breakDuration || 0)
                    )}
                  </span>
                </div>
              )}

              <div>
                <span className="text-gray-500 block">Status</span>
                <span className="font-medium">
                  {user.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
