"use client";

import { Attendance } from "@/schema/attendanceSchema";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin, Timer, Edit } from "lucide-react";
import formatDuration from "@/helpers/formatDuration";
import Link from "next/link";
import useAuthStore from "@/store/authSlice";
import formatTime from "@/helpers/formatTime";

// Actions cell component
const ActionsCell = ({ attendance }: { attendance: Attendance }) => {
  const userDetails = useAuthStore((state) => state.user);

  // Only show edit button for admin users
  if (userDetails?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Link href={`/dashboard/attendance/edit/${attendance._id}`}>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </Link>
    </div>
  );
};

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "dateOfWorking",
    header: () => (
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4" />
        <span>Date</span>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfWorking"));
      return (
        <div className="font-medium">
          {date.toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "loginTime",
    header: () => (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>Login Time</span>
      </div>
    ),
    cell: ({ row }) => {
      const loginTime = row.getValue("loginTime");
      if (!loginTime) return <span className="text-gray-400">-</span>;

      return (
        <div className="font-medium">
          {new Date(loginTime as string).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "logoutTime",
    header: () => (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>Logout Time</span>
      </div>
    ),
    cell: ({ row }) => {
      const logoutTime = row.getValue("logoutTime");
      if (!logoutTime) return <span className="text-gray-400">-</span>;
      console.log("Logout Time:", logoutTime);
      return (
        <div className="font-medium">
          {formatTime(logoutTime as string)}
        </div>
      );
    },
  },
  {
    accessorKey: "breakDuration",
    header: () => (
      <div className="flex items-center space-x-2">
        <Timer className="h-4 w-4" />
        <span>Break Duration</span>
      </div>
    ),
    cell: ({ row }) => {
      const breakDuration = row.getValue("breakDuration") as number;
      if (!breakDuration) return <span className="text-gray-400">0 min</span>;

      return <div className="font-medium">{formatDuration(breakDuration)}</div>;
    },
  },
  {
    accessorKey: "hoursWorked",
    header: () => (
      <div className="flex items-center space-x-2">
        <Timer className="h-4 w-4" />
        <span>Hours worked</span>
      </div>
    ),
    cell: ({ row }) => {
      const loginTime = row.original.loginTime as string;
      const logoutTime = row.original.logoutTime as string;
      if (!loginTime || !logoutTime)
        return <span className="text-gray-400">-</span>;
      const hoursWorked = formatDuration(
        new Date(logoutTime).getTime() - new Date(loginTime).getTime()
      );
      return <div className="font-medium">{hoursWorked}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
          case "present":
            return "bg-green-100 text-green-800 border-green-200";
          case "absent":
            return "bg-red-100 text-red-800 border-red-200";
          case "on_leave":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "on_break":
            return "bg-blue-100 text-blue-800 border-blue-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <Badge
          variant="outline"
          className={`${getStatusColor(status)} font-medium`}
        >
          {status?.replace("_", " ").toUpperCase() || "UNKNOWN"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "workingHoursCompleted",
    header: "Hours Completed",
    cell: ({ row }) => {
      const completed = row.getValue("workingHoursCompleted") as boolean;
      return (
        <Badge
          variant={completed ? "default" : "secondary"}
          className={completed ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {completed ? "✓ Complete" : "Incomplete"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startLatitude",
    header: () => (
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4" />
        <span>Login Location</span>
      </div>
    ),
    cell: ({ row }) => {
      const lat = row.getValue("startLatitude") as number;
      const lng = row.original.startLongitude as number;
      if (!lat || !lng)
        return <span className="text-gray-400">No location</span>;

      return (
        <div className="text-sm">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center space-x-1"
          >
            <MapPin className="h-4 w-4" /> View on Maps
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "endLatitude",
    header: () => (
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4" />
        <span>Logout Location</span>
      </div>
    ),
    cell: ({ row }) => {
      const lat = row.getValue("endLatitude") as number;
      const lng = row.original.endLongitude as number;
      if (!lat || !lng)
        return <span className="text-gray-400">No location</span>;

      return (
        <div className="text-sm">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center space-x-1"
          >
            <MapPin className="h-4 w-4" /> View on Maps
          </Link>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const attendance = row.original;
      return <ActionsCell attendance={attendance} />;
    },
  },
];
