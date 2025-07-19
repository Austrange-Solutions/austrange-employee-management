"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Clock,
    User,
    Save,
    ArrowLeft,
    AlertTriangle,
} from "lucide-react";
import useAuthStore from "@/store/authSlice";
import { TUser } from "@/models/user.model";
import { Switch } from "@/components/ui/switch";
import formatDuration from "@/helpers/formatDuration";
import formatDate from "@/helpers/formatDate";
import formatTime from "@/helpers/formatTime";

// Zod schema for form validation
const attendanceSchema = z.object({
    loginTime: z.string().optional(),
    logoutTime: z.string().optional(),
    breakStartTime: z.string().optional(),
    breakEndTime: z.string().optional(),
    breakDuration: z.number().min(0, "Break duration must be positive").optional(),
    status: z.enum(["present", "absent", "on_leave"]),
    workingHoursCompleted: z.boolean(),
}).refine((data) => {
    // Validate that logout time is after login time
    if (data.loginTime && data.logoutTime) {
        const loginTime = new Date(data.loginTime);
        const logoutTime = new Date(data.logoutTime);
        if (logoutTime <= loginTime) {
            return false;
        }
    }
    return true;
}, {
    message: "Logout time must be after login time",
    path: ["logoutTime"],
}).refine((data) => {
    // Validate that break end time is after break start time
    if (data.breakStartTime && data.breakEndTime) {
        const breakStartTime = new Date(data.breakStartTime);
        const breakEndTime = new Date(data.breakEndTime);
        if (breakEndTime < breakStartTime) {
            return false;
        }
    }
    return true;
}, {
    message: "Break end time must be after break start time",
    path: ["breakEndTime"],
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceRecord {
    _id: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        department?: string;
        workingHours?: string;
    };
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
    status: "present" | "absent" | "on_leave";
    createdAt: string;
    updatedAt: string;
}

export default function EditAttendancePage() {
    const router = useRouter();
    const params = useParams();
    const attendanceId = params.attendanceId as string;

    const [currentUser, setCurrentUser] = useState<TUser | null>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const userDetails = useAuthStore((state) => state.user);

    // Initialize form with react-hook-form
    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            loginTime: "",
            logoutTime: "",
            breakStartTime: "",
            breakEndTime: "",
            breakDuration: 0,
            status: "present",
            workingHoursCompleted: false,
        },
    });

    // Helper function to format datetime for input
    const formatForInput = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
            // Handle both string and number inputs
            let date: Date;
            if (typeof dateString === 'string') {
                date = new Date(dateString);
            } else {
                date = new Date(dateString);
            }

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return "";
            }

            // Format for datetime-local input (YYYY-MM-DDTHH:mm)
            // Using local timezone
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
            return formatted;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    // Check admin authentication
    useEffect(() => {
        if (userDetails && userDetails.role !== "admin") {
            toast.error("Access denied. Admin privileges required.");
            router.push("/dashboard");
        }
        setCurrentUser(userDetails);
    }, [userDetails, router]);

    // Fetch attendance record
    useEffect(() => {
        const fetchAttendanceRecord = async () => {
            try {
                const response = await fetch(`/api/attendance/get-attendance/${attendanceId}`);
                if (response.ok) {
                    const data = await response.json();

                    setAttendance(data.attendance);

                    // Populate form with existing data using react-hook-form
                    const formValues: AttendanceFormData = {
                        loginTime: formatForInput(data.attendance.loginTime),
                        logoutTime: formatForInput(data.attendance.logoutTime),
                        breakStartTime: formatForInput(data.attendance.breakStartTime),
                        breakEndTime: formatForInput(data.attendance.breakEndTime),
                        breakDuration: Number(formatDuration(data.attendance.breakDuration)) || 0,
                        status: data.attendance.status || "present",
                        workingHoursCompleted: data.attendance.workingHoursCompleted || false,
                    };

                    // Reset form with new values
                    form.reset(formValues);
                } else {
                    toast.error("Failed to fetch attendance record");
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Error fetching attendance:", error);
                toast.error("Error fetching attendance record");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && attendanceId) {
            fetchAttendanceRecord();
        }
    }, [currentUser, attendanceId, router, form]);

    const handleSubmit = async (data: AttendanceFormData) => {
        setSaving(true);

        try {
            const response = await fetch("/api/admin/update-attendance", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    attendanceId,
                    ...data,
                }),
            });
            const responseData = await response.json();
            if (response.ok) {
                toast.success("Attendance updated successfully");
                router.push(`/dashboard/attendance/${responseData.attendance.user._id}`);
            } else {
                toast.error(responseData.error || "Failed to update attendance");
            }
        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error("Error updating attendance");
        } finally {
            setSaving(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return "Not set";
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return "Invalid date";
            }

            // Use the helper functions for consistent formatting
            const formattedDate = formatDate(dateString);
            const formattedTime = formatTime(dateString);

            return `${formattedDate} at ${formattedTime}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "present":
                return <Badge className="bg-green-100 text-green-800">Present</Badge>;
            case "absent":
                return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
            case "on_leave":
                return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!attendance) {
        return (
            <div className="p-6">
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Attendance record not found or you don&apos;t have permission to edit it.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard/attendance")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Attendance
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Attendance Record
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Modify attendance details for {attendance.user.firstName} {attendance.user.lastName}
                    </p>
                </div>
            </div>

            {/* Employee Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Employee Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Name</Label>
                            <p className="text-sm font-medium">
                                {attendance.user.firstName} {attendance.user.lastName}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Email</Label>
                            <p className="text-sm font-medium">{attendance.user.email}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Department</Label>
                            <p className="text-sm font-medium">{attendance.user.department || "Not specified"}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Date</Label>
                            <p className="text-sm font-medium">
                                {new Date(attendance.dateOfWorking).toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Day</Label>
                            <p className="text-sm font-medium">{attendance.dayOfWeek}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                            <div className="mt-1">{getStatusBadge(attendance.status)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Edit Attendance Details
                    </CardTitle>
                    <CardDescription>
                        Update the attendance information for this employee
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Login Time */}
                                <FormField
                                    control={form.control}
                                    name="loginTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Login Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Original: {formatDateTime(attendance?.loginTime || "")}
                                                {attendance?.loginTime && (
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        Raw: {attendance.loginTime}
                                                    </div>
                                                )}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Logout Time */}
                                <FormField
                                    control={form.control}
                                    name="logoutTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logout Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Original: {formatDateTime(attendance?.logoutTime || "")}
                                                {attendance?.logoutTime && (
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        Raw: {attendance.logoutTime}
                                                    </div>
                                                )}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Break Start Time */}
                                <FormField
                                    control={form.control}
                                    name="breakStartTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Break Start Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Original: {formatDateTime(attendance?.breakStartTime || "")}
                                                {attendance?.breakStartTime && (
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        Raw: {attendance.breakStartTime}
                                                    </div>
                                                )}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Break End Time */}
                                <FormField
                                    control={form.control}
                                    name="breakEndTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Break End Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="mt-1"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Original: {formatDateTime(attendance?.breakEndTime || "")}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Break Duration */}
                                <FormField
                                    control={form.control}
                                    name="breakDuration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Break Duration (minutes)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    className="mt-1"
                                                    min="0"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">
                                                Original: {formatDuration(attendance?.breakDuration as number) || "0 minutes"}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Status */}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="present">Present</SelectItem>
                                                    <SelectItem value="absent">Absent</SelectItem>
                                                    <SelectItem value="on_leave">On Leave</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Working Hours Completed */}
                            <FormField
                                control={form.control}
                                name="workingHoursCompleted"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Working Hours Completed</FormLabel>
                                            <FormDescription>
                                                Originally: {attendance?.workingHoursCompleted ? "Yes" : "No"}
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard/attendance")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Attendance
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
