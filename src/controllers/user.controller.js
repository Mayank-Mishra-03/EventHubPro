import ApiError from '../utils/ApiError.util.js';
import ApiResponse from '../utils/ApiResponse.util.js';
import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler.util.js';
import { connectSQL } from '../db/connectionToSQL.js';
import jwt from 'jsonwebtoken';

const connection = await connectSQL();

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await connection.execute(
        'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'student']
    );

    if (!user) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201)
        .json(
            new ApiResponse(201, "User registered successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const [rows] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });

    return res
        .cookie("token", token, {
            httpOnly: true,
            secure: true,
        })
        .status(200)
        .json(new ApiResponse(200, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (_, res) => {
    return res
        .clearCookie("token")
        .status(200)
        .json(new ApiResponse(200, "User logged out successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [user] = await connection.execute('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "User profile retrieved successfully", user)
        );
});

const registerUserInEvents = asyncHandler(async (req, res) => {
    const { eventId } = req.body;
    if (!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const userId = req.user.id;

    const [result] = await connection.execute(
        'INSERT INTO Registrations (user_id, event_id) VALUES (?, ?)',
        [userId, eventId]
    );

    if (result.affectedRows === 0) {
        throw new ApiError(500, "Registration failed");
    }

    return res.status(201)
        .json(new ApiResponse(201, "User registered for the event successfully"));
});

const getUserRegistrations = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [registrations] = await connection.execute(
        'SELECT * FROM Registrations WHERE user_id = ?',
        [userId]
    );

    if (registrations.length === 0) {
        return res.status(404)
            .json(new ApiResponse(404, "No registrations found for this user"));
    }

    return res.status(200)
        .json(new ApiResponse(200, "User registrations retrieved successfully", registrations));
});

export { registerUser, loginUser, logoutUser, getUserProfile, registerUserInEvents, getUserRegistrations };