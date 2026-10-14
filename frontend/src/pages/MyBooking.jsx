
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings } from "../services/api";

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookings();
      const data = response.data;

      // Accept either an array or { bookings: [...] }
      const bookingList = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
          ? data.bookings
          : null;

      if (!bookingList) {
        throw new Error("Invalid response received from the server.");
      }

      setBookings(bookingList);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      console.error("Server response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load bookings. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) return "Not available";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="min-h-[70vh] bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Bookings
          </h1>
          <p className="mt-2 text-slate-600">
            View your hotel reservations at Pradhan House.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">Loading bookings...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchBookings}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              No bookings yet
            </h2>

            <p className="mt-3 text-slate-600">
              Your reservations will appear here after you make a booking.
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400"
            >
              Explore Rooms
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-5 p-6 sm:flex-row">
                  {booking.room?.image && (
                    <img
                      src={booking.room.image}
                      alt={booking.room.name || "Hotel room"}
                      className="h-48 w-full rounded-xl object-cover sm:w-56"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {booking.room?.name || "Hotel Room"}
                        </h2>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          Booking ID:{" "}
                          {booking.bookingReference || booking._id || "N/A"}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold capitalize text-amber-800">
                        {booking.status || "Pending"}
                      </span>
                    </div>

                    <p className="mt-4 text-slate-700">
                      <span className="font-semibold">Guest:</span>{" "}
                      {booking.guestName || "Not available"}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-slate-500">Check-in</p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Check-out</p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Guests</p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {booking.guests ?? "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Total Price</p>
                        <p className="mt-1 text-lg font-bold text-amber-600">
                          {formatPrice(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyBooking;
