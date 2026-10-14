
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import Room from "./models/Room.js";
import roomRoutes from "./Routes/roomRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Pradhan House Hotel Booking API!",
  });
});

// API routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Seed sample rooms if the collection is empty
const seedRooms = async () => {
  const count = await Room.countDocuments();

  if (count > 0) {
    console.log(`Rooms already exist: ${count}`);
    return;
  }

  const sampleRooms = [
    {
      name: "Deluxe Room",
      description: "A comfortable room for a relaxing stay.",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
      pricePerNight: 2500,
      capacity: 2,
      roomType: "Deluxe",
      amenities: ["Wi-Fi", "Air Conditioning", "TV"],
    },
    {
      name: "Premium Suite",
      description: "A spacious suite for a premium experience.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      pricePerNight: 4500,
      capacity: 3,
      roomType: "Suite",
      amenities: ["Wi-Fi", "Air Conditioning", "TV", "Mini Bar"],
    },
    {
      name: "Family Room",
      description: "Extra space for families and small groups.",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      pricePerNight: 3500,
      capacity: 4,
      roomType: "Family",
      amenities: ["Wi-Fi", "Air Conditioning", "TV", "Extra Beds"],
    },
  ];

  await Room.insertMany(sampleRooms);
  console.log("Sample rooms added to the database.");
};

// Start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    await seedRooms();

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server startup error:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start the application:", error.message);
    process.exit(1);
  }
};

startServer();
