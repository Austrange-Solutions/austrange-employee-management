import { Attendance } from "@/schema/attendanceSchema";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

function AttendanceTable({ attendanceData }: { attendanceData: Attendance[] }) {
  return (
    <div className="w-full">
      <DataTable columns={columns} data={attendanceData} />
    </div>
  );
}

export default AttendanceTable;
