
import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const router = express.Router();

// GET: Fetch all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("room");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings.",
      error: error.message,
    });
  }
});

// POST: Create a new booking
router.post("/", async (req, res) => {
  try {
    const { guestName, email, phone, checkIn, checkOut, guests, room, roomName, pricePerNight } =
      req.body;

    // Validate required fields
    if (!guestName || !email || !phone || !checkIn || !checkOut || !guests || !room) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate room ID
    if (!mongoose.isValidObjectId(room)) {
      return res.status(400).json({ message: "Invalid room ID." });
    }

    // Validate dates
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        message: "Provide valid check-in and check-out dates.",
      });
    }

    // Check the room exists
    const existingRoom = await Room.findById(room);
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      room,
      status: { $in: ["Pending", "Confirmed"] },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });

    if (overlap) {
      return res.status(409).json({
        message: "This room is already booked for the selected dates.",
      });
    }

    // Calculate total price
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const price = pricePerNight || existingRoom.pricePerNight;
    const totalPrice = nights * price;

    const booking = await Booking.create({
      guestName,
      email,
      phone,
      checkIn: start,
      checkOut: end,
      guests: Number(guests),
      room,
      roomName: roomName || existingRoom.name,
      pricePerNight: price,
      totalPrice,
    });

    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking.",
      error: error.message,
    });
  }
});

// GET: Fetch a single booking by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await Booking.findById(req.params.id).populate("room");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking.",
      error: error.message,
    });
  }
});

export default router;
