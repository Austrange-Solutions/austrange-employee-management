import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";

export async function PATCH(request: NextRequest) {
    try {
        const { firstName, lastName, email, phone, age, address, city, state, country, zip, designation } = await request.json();
        const token = await getDataFromToken(request);
        if (!token) {
            return NextResponse.json({
                error: "Unauthorized access"
            }, { status: 401 });
        }

        // Both admin and employee can update their own details
        if (!firstName || !lastName || !email || !phone) {
            return NextResponse.json({
                error: "First name, last name, email, and phone are required"
            }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(token._id);
        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        // Update user details
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone;
        if (age) user.age = age;
        if (address) user.address = address;
        if (city) user.city = city;
        if (state) user.state = state;
        if (country) user.country = country;
        if (zip) user.zip = zip;
        if (designation) user.designation = designation;
          await user.save();
        
        // Return user without password
        const userObj = user.toObject();
        const { password, ...userWithoutPassword } = userObj;
        
        return NextResponse.json({
            message: "Profile updated successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}