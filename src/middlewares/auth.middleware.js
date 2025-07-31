import ApiError from "../utils/ApiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken";
import { connectSQL } from "../db/connectionToSQL.js";

const connection = await connectSQL();

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const [rows] = await connection.execute(
            "SELECT id, name, email, role FROM Users WHERE id = ?",
            [decodedToken.userId]
        );

        const user = rows[0];

        if (!user) {
            throw new ApiError(401, "Invalid user access token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        next(error instanceof ApiError ? error : new ApiError(401, error.message || "JWT verification failed"));
    }
});
