
import { useEffect, useState } from "react";
import { X, CalendarDays, User, Mail, Phone } from "lucide-react";
import Hero from "../components/Hero";
import RoomCard from "../components/RoomCard";
import { getRooms, createBooking } from "../services/api";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        const data = response.data;
        // Map API fields to what the UI expects
        const mapped = (Array.isArray(data) ? data : []).map((room) => ({
          _id: room._id,
          name: room.name,
          description: room.description,
          price: room.pricePerNight,
          capacity: room.capacity,
          beds: room.roomType === "Family" ? "2 Double" : "1 King",
          category:
            room.roomType === "Suite"
              ? "Premium"
              : room.roomType === "Family"
                ? "Family Friendly"
                : "Most Popular",
          amenities: room.amenities || [],
          image: room.image
            ? `${room.image}?auto=format&fit=crop&w=900&q=80`
            : "",
        }));
        setRooms(mapped);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, []);


  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    setMessage("");

    if (form.checkIn < today || form.checkOut <= form.checkIn) {
      setMessage("Choose valid check-in and check-out dates.");
      return;
    }

    if (Number(form.guests) > selectedRoom.capacity) {
      setMessage(`This room allows up to ${selectedRoom.capacity} guests.`);
      return;
    }

    setLoading(true);

    const bookingData = {
      ...form,
      guests: Number(form.guests),
      room: selectedRoom._id,
      roomName: selectedRoom.name,
      pricePerNight: selectedRoom.price,
    };

    try {
      const response = await createBooking(bookingData);
      const booking = response.data.booking || response.data;

      const existing = JSON.parse(
        localStorage.getItem("pradhanHouseBookings") || "[]"
      );

      localStorage.setItem(
        "pradhanHouseBookings",
        JSON.stringify([...existing, booking])
      );

      setMessage("Booking submitted successfully!");
      setForm({
        guestName: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: "1",
      });

      setTimeout(() => {
        setSelectedRoom(null);
        setMessage("");
      }, 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to submit booking. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />

      <section id="rooms" className="bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">
              Our Accommodation
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Find Your Perfect Room
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              From relaxing getaways to family trips, find a room
              that suits your needs and budget.
            </p>
          </div>

          {roomsLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">No rooms available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onBook={(selected) => {
                    setMessage("");
                    setSelectedRoom(selected);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRoom && (
        <div
          className="fixed inset-0 z [60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4"
          onClick={() => !loading && setSelectedRoom(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-600">
                  Reserve Your Stay
                </p>
                <h2 id="booking-title" className="mt-1 text-2xl font-bold">
                  {selectedRoom.name}
                </h2>
                <p className="mt-1 text-slate-600">
                  ₹{selectedRoom.price.toLocaleString("en-IN")} per night
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => setSelectedRoom(null)}
                aria-label="Close booking form"
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Guest Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    required
                    name="guestName"
                    value={form.guestName}
                    onChange={updateForm}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateForm}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={updateForm}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Check-in
                  </label>
                  <input
                    required
                    type="date"
                    name="checkIn"
                    min={today}
                    value={form.checkIn}
                    onChange={updateForm}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Check-out
                  </label>
                  <input
                    required
                    type="date"
                    name="checkOut"
                    min={form.checkIn || today}
                    value={form.checkOut}
                    onChange={updateForm}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Number of Guests
                </label>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={updateForm}
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-amber-500"
                >
                  {Array.from(
                    { length: selectedRoom.capacity },
                    (_, i) => i + 1
                  ).map((number) => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              {message && (
                <p
                  role="status"
                  className={`rounded-xl p-3 text-sm ${
                    message.includes("successfully")
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 py-3.5 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Confirm Booking"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Your reservation will be submitted to the hotel booking API.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
