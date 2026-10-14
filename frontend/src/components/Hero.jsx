
import { ArrowRight, Star } from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury hotel swimming pool"
          className="h-full w-full object-cover opacity-40"
        />
      </div>

      <div className="relative mx-auto grid min-h[540px] max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <div className="text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            Comfort, elegance and hospitality
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Your Perfect Stay,
            <span className="block text-amber-400">
              Your Way.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
            Discover beautiful rooms, exceptional comfort and
            memorable experiences at Pradhan House.
          </p>

          <a
            href="#rooms"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Discover Our Rooms
            <ArrowRight size={19} />
          </a>

          <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-200">
            <div>
              <p className="text-2xl font-bold text-white">Comfort</p>
              <p>Thoughtful spaces</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Quality</p>
              <p>Premium amenities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Care</p>
              <p>Guest-first service</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="ml-auto max-w-sm rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
            <img
              src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85"
              alt="Elegant hotel bedroom"
              className="h-64 w-full rounded-2xl object-cover"
            />
            <div className="px-2 pb-2 pt-5 text-white">
              <p className="text-xl font-semibold">
                Relax in style
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Find the right room for your next getaway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
