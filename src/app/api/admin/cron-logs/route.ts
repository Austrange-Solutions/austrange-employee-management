import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.model";
import Attendance from "@/models/attendance.model";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Verify admin authorization
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        // Get query parameters for date filtering
        const url = new URL(request.url);
        const daysBack = parseInt(url.searchParams.get('days') || '7', 10);
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        // Get auto-logout statistics
        const autoLogoutStats = await Attendance.aggregate([
            {
                $match: {
                    dateOfWorking: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    logoutTime: { $exists: true },
                    // Identify auto-logouts by checking if logout time is exactly 23:59
                    $expr: {
                        $and: [
                            { $eq: [{ $hour: "$logoutTime" }, 23] },
                            { $eq: [{ $minute: "$logoutTime" }, 59] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfWorking" } }
                    },
                    count: { $sum: 1 },
                    employees: {
                        $push: {
                            user: "$user",
                            loginTime: "$loginTime",
                            logoutTime: "$logoutTime",
                            workingHoursCompleted: "$workingHoursCompleted"
                        }
                    }
                }
            },
            {
                $sort: { "_id.date": -1 }
            }
        ]);

        // Get total attendance records for comparison
        const totalAttendanceStats = await Attendance.aggregate([
            {
                $match: {
                    dateOfWorking: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    status: 'present'
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfWorking" } }
                    },
                    totalPresent: { $sum: 1 },
                    manualLogouts: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ["$logoutTime", null] },
                                        {
                                            $not: {
                                                $and: [
                                                    { $eq: [{ $hour: "$logoutTime" }, 23] },
                                                    { $eq: [{ $minute: "$logoutTime" }, 59] }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    noLogout: {
                        $sum: {
                            $cond: [
                                { $eq: ["$logoutTime", null] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { "_id.date": -1 }
            }
        ]);

        // Combine the statistics
        const combinedStats = totalAttendanceStats.map(totalStat => {
            const autoLogoutStat = autoLogoutStats.find(
                autoStat => autoStat._id.date === totalStat._id.date
            );
            
            return {
                date: totalStat._id.date,
                totalPresent: totalStat.totalPresent,
                autoLogouts: autoLogoutStat ? autoLogoutStat.count : 0,
                manualLogouts: totalStat.manualLogouts,
                noLogout: totalStat.noLogout,
                autoLogoutEmployees: autoLogoutStat ? autoLogoutStat.employees : [],
                autoLogoutPercentage: totalStat.totalPresent > 0 
                    ? Math.round(((autoLogoutStat ? autoLogoutStat.count : 0) / totalStat.totalPresent) * 100)
                    : 0
            };
        });

        // Get recent failed attempts (simulated - in real scenario you'd log these to DB)
        const systemHealth = {
            lastSuccessfulRun: combinedStats.length > 0 ? combinedStats[0].date : null,
            avgAutoLogoutsPerDay: combinedStats.length > 0 
                ? Math.round(combinedStats.reduce((sum, stat) => sum + stat.autoLogouts, 0) / combinedStats.length)
                : 0,
            totalAutoLogouts: combinedStats.reduce((sum, stat) => sum + stat.autoLogouts, 0),
            systemStatus: "healthy", // In production, check actual system metrics
            cronJobConfigured: process.env.CRON_SECRET ? true : false
        };

        // Get employees who frequently forget to logout
        const frequentAutoLogouts = await Attendance.aggregate([
            {
                $match: {
                    dateOfWorking: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    $expr: {
                        $and: [
                            { $eq: [{ $hour: "$logoutTime" }, 23] },
                            { $eq: [{ $minute: "$logoutTime" }, 59] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$user",
                    autoLogoutCount: { $sum: 1 },
                    dates: { $push: "$dateOfWorking" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    employeeName: {
                        $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"]
                    },
                    email: "$userDetails.email",
                    autoLogoutCount: 1,
                    dates: 1
                }
            },
            {
                $sort: { autoLogoutCount: -1 }
            },
            {
                $limit: 10
            }
        ]);

        return NextResponse.json({
            success: true,
            dateRange: {
                from: startDate.toISOString().split('T')[0],
                to: endDate.toISOString().split('T')[0],
                daysAnalyzed: daysBack
            },
            dailyStats: combinedStats,
            systemHealth,
            frequentAutoLogouts,
            summary: {
                totalDaysAnalyzed: combinedStats.length,
                totalAutoLogouts: combinedStats.reduce((sum, stat) => sum + stat.autoLogouts, 0),
                totalEmployeesPresent: combinedStats.reduce((sum, stat) => sum + stat.totalPresent, 0),
                avgAutoLogoutRate: combinedStats.length > 0 
                    ? Math.round(
                        combinedStats.reduce((sum, stat) => sum + stat.autoLogoutPercentage, 0) / combinedStats.length
                    ) 
                    : 0
            }
        });

    } catch (error) {
        console.error("Error fetching cron logs:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch cron job logs",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
