import { NextRequest } from "next/server";
import { getDataFromToken } from "../../../../../helpers/getDataFromToken";

export async function PATCH(request: NextRequest) {
    const { username, email, role, designation } = await request.json();
    if (!username || !email || !role || !designation) {
        return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }
    
    const token = await getDataFromToken(request);
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 401 });
    }
}