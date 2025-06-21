import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenData extends JwtPayload {
    _id: string;
    username?: string;
    role: string;
}
export async function getDataFromToken(request: NextRequest) {
    try {
        // Decode the token to extract user data
        const token = request.cookies.get("accessToken")?.value || "";
        if (!token) {
            throw new Error("No token found");
        }
        const decodedToken: TokenData = jwt.verify(token, process.env.TOKEN_SECRET || "default_secret_key") as TokenData;
        if (!decodedToken) {
            throw new Error("Failed to decode token");
        }

        // Return the user data
        return decodedToken;
    } catch (error) {
        console.error("Error decoding token:", error);
        throw new Error("Invalid token");
    }
}