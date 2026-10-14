
import { BedDouble, Users, Wifi, CheckCircle2 } from "lucide-react";

function RoomCard({ room, onBook }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow">
          {room.category}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-900">
            {room.name}
          </h3>
          <p className="shrink-0 text-right">
            <span className="text-xl font-bold text-amber-600">
              ₹{room.price.toLocaleString("en-IN")}
            </span>
            <span className="block text-xs text-slate-500">
              per night
            </span>
          </p>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {room.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 border-b border-slate-100 pb-5 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <BedDouble size={17} />
            {room.beds} bed
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={17} />
            {room.capacity} guests
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi size={17} />
            Free Wi-Fi
          </span>
        </div>

        <div className="my-4 space-y-2">
          {room.amenities.map((amenity) => (
            <p
              key={amenity}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />
              {amenity}
            </p>
          ))}
        </div>

        <button
          onClick={() => onBook(room)}
          className="mt-2 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          Book This Room
        </button>
      </div>
    </article>
  );
}

export default RoomCard;
