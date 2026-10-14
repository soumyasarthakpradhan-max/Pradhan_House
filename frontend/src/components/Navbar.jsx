
import { Link, NavLink } from "react-router-dom";
import { Hotel, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-amber-600 font-semibold"
        : "text-slate-600 hover:text-amber-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-xl bg-amber-500 p-2 text-white">
            <Hotel size={24} />
          </span>
          <span className="text-xl font-bold tracking-tight greentext-amber-600">
            Pradhan<span className="orangetext-amber-600">House</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/my-bookings" className={linkClass}>
            My Bookings
          </NavLink>
          <a
            href="/#rooms"
            className="rounded-full bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-amber-600"
          >
            Explore Rooms
          </a>
        </div>

        <button
          className="text-slate-800 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t px-5 py-5 md:hidden">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink
            to="/my-bookings"
            onClick={() => setMenuOpen(false)}
          >
            My Bookings
          </NavLink>
          <a href="/#rooms" onClick={() => setMenuOpen(false)}>
            Explore Rooms
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
