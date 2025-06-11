/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({
            message: "Logout successful"
        }, { status: 200 });
        response.cookies.set("accessToken", "", {
            maxAge: 0, // Set maxAge to 0 to delete the cookie
            expires: new Date(0), // Set expires to a past date to delete the cookie
        });
        return response;
    } catch (error: any) {
        return NextResponse.json({
            error: "Failed to logout" + error.message
        }, { status: 500 })
    }
}