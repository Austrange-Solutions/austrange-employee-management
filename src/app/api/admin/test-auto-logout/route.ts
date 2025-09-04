import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
    try {
        // Check if user is admin
        const tokenData = await getDataFromToken(request);
        if (!tokenData) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (tokenData.role !== "admin") {
            return NextResponse.json(
                { error: "Access denied. Admin privileges required." },
                { status: 403 }
            );
        }

        // Create a request to the cron endpoint with proper authorization
        const cronUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/auto-logout`;
        
        const response = await fetch(cronUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                error: "Failed to execute auto-logout",
                details: result
            }, { status: response.status });
        }

        return NextResponse.json({
            message: "Auto-logout test executed successfully",
            result: result
        });

    } catch (error) {
        console.error("Auto-logout test error:", error);
        return NextResponse.json(
            { 
                error: "Failed to test auto-logout",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
