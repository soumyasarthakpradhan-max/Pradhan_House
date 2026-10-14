
import { Hotel, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <Hotel className="text-amber-400" />
            PradhanHouse
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7">
            A welcoming place to relax, recharge and make
            every stay memorable.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="hover:text-amber-400">
              Home
            </Link>
            <a href="/#rooms" className="hover:text-amber-400">
              Explore Rooms
            </a>
            <Link
              to="/my-bookings"
              className="hover:text-amber-400"
            >
              My Bookings
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex items-center gap-3">
              <MapPin size={17} className="text-amber-400" />
              Bhubaneswar, Odisha, India
            </p>
            <p className="flex items-center gap-3">
              <Phone size={17} className="text-amber-400" />
              Contact details coming soon
            </p>
            <p className="flex items-center gap-3">
              <Mail size={17} className="text-amber-400" />
              Email details coming soon
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Pradhan House. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
