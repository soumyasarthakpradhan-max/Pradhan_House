
import express from "express";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET: Fetch all available rooms
router.get("/", async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    const filter = { available: true };

    if (guests) {
      const guestCount = Number(guests);

      if (!Number.isInteger(guestCount) || guestCount < 1) {
        return res.status(400).json({
          message: "Guests must be a positive whole number.",
        });
      }

      filter.capacity = { $gte: guestCount };
    }

    let rooms = await Room.find(filter).sort({ pricePerNight: 1 });

    // If dates are provided, hide rooms with overlapping active bookings.
    if (checkIn || checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (
        !checkIn ||
        !checkOut ||
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
      ) {
        return res.status(400).json({
          message: "Provide valid check-in and check-out dates.",
        });
      }

      const bookings = await Booking.find({
        status: { $in: ["Pending", "Confirmed"] },
        checkIn: { $lt: end },
        checkOut: { $gt: start },
      }).select("room");

      const bookedRoomIds = bookings.map((booking) =>
        booking.room.toString()
      );

      rooms = rooms.filter(
        (room) => !bookedRoomIds.includes(room._id.toString())
      );
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rooms.",
      error: error.message,
    });
  }
});

// GET: Fetch one room by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid room ID." });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch room.",
      error: error.message,
    });
  }
});

export default router;
