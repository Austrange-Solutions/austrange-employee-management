/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/db/dbConnect";

export async function PATCH(request: NextRequest) {
    try {
        const { username, email, designation } = await request.json();
        
        const token = await getDataFromToken(request);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }
        
        if (token.role !== "admin") {
            return NextResponse.json({ error: "Only admins can update admin profile" }, { status: 403 });
        }

        if (!username || !email || !designation) {
            return NextResponse.json({ error: "Username, email, and designation are required" }, { status: 400 });
        }

        await dbConnect();
        
        const admin = await User.findById(token._id);
        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        // Update admin fields
        admin.username = username;
        admin.email = email;
        admin.designation = designation;
        
        await admin.save();

        return NextResponse.json({
            message: "Admin profile updated successfully",
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                designation: admin.designation
            }
        }, { status: 200 });

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to update admin profile: " + error.message }, { status: 500 });
    }
}