import express from 'express';
import {
    getUserProfile,
    getUserRegistrations,
    loginUser,
    logoutUser,
    registerUser,
    registerUserInEvents
} from '../controllers/user.controller.js';
import {
    createEvent,
    deleteEvent,
    getEvents
} from '../controllers/event.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/events/register").post(verifyJWT, registerUserInEvents);
router.route("/events").get(verifyJWT, getUserRegistrations);
router.route("/createEvent").post(verifyJWT, createEvent);
router.route("/getEvents").get(verifyJWT, getEvents);
router.route("/deleteEvent").delete(verifyJWT, deleteEvent);


export default router;