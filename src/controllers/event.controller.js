import ApiResponse from "../utils/ApiResponse.util.js";
import ApiError from "../utils/ApiError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { connectSQL } from "../db/connectionToSQL.js";

const connection = await connectSQL();

const createEvent = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can create events");
    }

    const { title, description, date, location, category } = req.body;
    if (!title || !description || !date || !location || !category) {
        throw new ApiError(400, "All fields are required");
    }

    const event = await connection.execute(
        'INSERT INTO Events (title, description, date, location, category, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, date, location, category, req.user.id, 'approved']
    );

    if (!event) {
        throw new ApiError(500, "Event creation failed");
    }

    return res.status(201)
        .json(
            new ApiResponse(201, "Event created successfully")
        );
});

const getEvents = asyncHandler(async (_, res) => {
    const [events] = await connection.execute('SELECT * FROM Events WHERE status = "approved" ORDER BY date DESC');
    if (!events || events.length === 0) {
        throw new ApiError(404, "No events found");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Events retrieved successfully", events)
        );
});

const deleteEvent = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Only admins can delete events");
    }
    const { id } = req.params;
    const [result] = await connection.execute('DELETE FROM Events WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
        throw new ApiError(404, "Event not found or deletion failed");
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Event deleted successfully")
        );

});

export { createEvent, getEvents, deleteEvent };