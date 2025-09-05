import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import User from "@/models/user.model";

export async function POST() {
    const startTime = Date.now();

    try {
        await dbConnect();

        // Get current date in IST (Indian Standard Time)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istDate = new Date(now.getTime() + istOffset);

        // Get today's date in YYYY-MM-DD format
        const today = istDate.toISOString().split('T')[0];

        // Set logout time to 11:59 PM IST
        const logoutTime = new Date(istDate);
        logoutTime.setHours(23, 59, 0, 0); // 11:59 PM

        console.log(`Starting auto-logout cron job for date: ${today} at ${istDate.toISOString()}`);

        // Find all attendance records for today that are present but haven't logged out
        const attendanceRecords = await Attendance.find({
            dateOfWorking: {
                $gte: new Date(today + 'T00:00:00.000Z'),
                $lt: new Date(today + 'T23:59:59.999Z')
            },
            status: 'present',
            $or: [
                { logoutTime: { $exists: false } },
                { logoutTime: null }
            ]
        }).populate('user', 'firstName lastName email workingHours status');

        console.log(`Found ${attendanceRecords.length} attendance records to process`);

        let processedCount = 0;
        let errorCount = 0;
        const processedEmployees: string[] = [];
        const failedEmployees: { name: string; error: string }[] = [];

        // Process each attendance record
        for (const attendance of attendanceRecords) {
            try {
                const user = attendance.user as {
                    _id: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    workingHours?: string;
                    status: string;
                };

                if (!user) {
                    console.error(`No user found for attendance ID: ${attendance._id}`);
                    errorCount++;
                    continue;
                }

                const employeeName = `${user.firstName} ${user.lastName}`;

                // Calculate working hours
                const loginTime = new Date(attendance.loginTime);
                const workingHoursMs = logoutTime.getTime() - loginTime.getTime();

                // Get user's expected working hours (default to 8 hours if not set)
                let userWorkingHours = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
                if (user.workingHours && user.workingHours !== '00:00') {
                    try {
                        const [hours, minutes] = user.workingHours.split(':').map(Number);
                        userWorkingHours = (hours * 60 + (minutes || 0)) * 60 * 1000;
                    } catch {
                        console.warn(`Invalid workingHours format for ${employeeName}: ${user.workingHours}`);
                        // Keep default 8 hours
                    }
                }

                // Determine if working hours are completed
                const workingHoursCompleted = workingHoursMs >= userWorkingHours;

                // Calculate break duration if breaks exist
                const totalBreakDuration = attendance.breakDuration || 0;

                // Update attendance record with retry mechanism
                let retryCount = 0;
                const maxRetries = 3;
                let updateSuccess = false;

                while (retryCount < maxRetries && !updateSuccess) {
                    try {
                        await Attendance.findByIdAndUpdate(attendance._id, {
                            logoutTime: logoutTime,
                            workingHoursCompleted: workingHoursCompleted,
                            endLatitude: attendance.startLatitude || 0,
                            endLongitude: attendance.startLongitude || 0,
                            breakDuration: totalBreakDuration,
                            updatedAt: new Date()
                        }, { new: true });

                        updateSuccess = true;
                    } catch (updateError) {
                        retryCount++;
                        console.warn(`Retry ${retryCount}/${maxRetries} for attendance update - ${employeeName}:`, updateError);

                        if (retryCount < maxRetries) {
                            // Wait before retry (exponential backoff)
                            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                        }
                    }
                }

                if (!updateSuccess) {
                    throw new Error(`Failed to update attendance after ${maxRetries} retries`);
                }

                // Update user status to inactive if they were active/on_break
                if (user.status === 'active' || user.status === 'on_break') {
                    try {
                        await User.findByIdAndUpdate(user._id, {
                            status: 'inactive',
                            updatedAt: new Date()
                        });
                    } catch (userUpdateError) {
                        console.warn(`Failed to update user status for ${employeeName}:`, userUpdateError);
                        // Don't fail the entire process for user status update
                    }
                }

                processedCount++;
                processedEmployees.push(employeeName);

                console.log(`✅ Auto-logout processed for ${employeeName} (${user.email}) - Working hours completed: ${workingHoursCompleted}`);

            } catch (error) {
                const user = attendance.user as { firstName?: string; lastName?: string };
                const employeeName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown';
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                console.error(`❌ Error processing auto-logout for ${employeeName} (ID: ${attendance._id}):`, error);

                failedEmployees.push({
                    name: employeeName,
                    error: errorMessage
                });
                errorCount++;
            }
        }

        const executionTime = Date.now() - startTime;

        // Prepare detailed summary
        const summary = {
            success: true,
            date: today,
            timestamp: istDate.toISOString(),
            executionTimeMs: executionTime,
            totalRecordsFound: attendanceRecords.length,
            processedSuccessfully: processedCount,
            errors: errorCount,
            processedEmployees: processedEmployees,
            failedEmployees: failedEmployees,
            message: errorCount === 0
                ? `Auto-logout completed successfully: ${processedCount} employees logged out automatically`
                : `Auto-logout completed with ${errorCount} errors: ${processedCount} employees logged out, ${errorCount} failed`
        };

        console.log('🎯 Auto-logout cron job completed:', summary);

        // Return appropriate status based on results
        const statusCode = errorCount === 0 ? 200 : (processedCount > 0 ? 207 : 500); // 207 = Multi-Status

        return NextResponse.json(summary, { status: statusCode });

    } catch (error) {
        const executionTime = Date.now() - startTime;
        const errorDetails = {
            success: false,
            error: 'Auto-logout cron job failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            executionTimeMs: executionTime,
            stack: error instanceof Error ? error.stack : undefined
        };

        console.error('💥 Auto-logout cron job critical failure:', errorDetails);

        return NextResponse.json(errorDetails, { status: 500 });
    }
}