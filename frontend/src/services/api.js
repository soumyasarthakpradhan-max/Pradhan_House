
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRooms = () => api.get("/rooms");

export const getBookings = () => api.get("/bookings");

export const createBooking = (bookingData) =>
  api.post("/bookings", bookingData);

export default api;
