import { Link } from "react-router-dom";

const categories = [
  {
    title: "Graphic Design",
    key: "design",
    tag: "Popular",
    img: "/images/cat-design.jpg",
    desc: "Logos, banners, social posts, thumbnails, and brand visuals.",
  },
  {
    title: "Web Development",
    key: "development",
    tag: "Fast",
    img: "/images/cat-dev.jpg",
    desc: "Landing pages, business websites, dashboards, and bug fixes.",
  },
  {
    title: "Writing & Translation",
    key: "writing",
    tag: "Trusted",
    img: "/images/cat-writing.jpg",
    desc: "Content writing, editing, proofreading, and translations.",
  },
  {
    title: "Video Editing",
    key: "video",
    tag: "Creative",
    img: "/images/cat-video.jpg",
    desc: "Short-form edits, reels, motion graphics, and promo videos.",
  },
];

const featured = [
  {
    title: "Modern business landing page",
    seller: "Ayesha",
    price: 120,
    rating: 4.9,
    reviews: 34,
    badge: "Best seller",
  },
  {
    title: "YouTube thumbnail pack",
    seller: "Fahim",
    price: 35,
    rating: 4.8,
    reviews: 21,
    badge: "Quick delivery",
  },
  {
    title: "SEO blog article",
    seller: "Sadia",
    price: 25,
    rating: 5.0,
    reviews: 17,
    badge: "Top rated",
  },
];

const testimonials = [
  {
    name: "Nafis Rahman",
    role: "Startup founder",
    text: "Clean experience and easy to browse. Great for finding quick design help.",
    avatar: "N",
  },
  {
    name: "Mitu Akter",
    role: "Small business owner",
    text: "The service layout is simple and easy to understand. Loved the smooth flow.",
    avatar: "M",
  },
];

export default function Home() {
  return (
    <div className="bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <section className="rounded-[2rem] bg-base-100 shadow-xl border border-base-200 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium">
                <span className="badge badge-primary badge-sm" />
                Marketplace • Hire in minutes
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight text-base-content">
                Find the right freelancer for your next project
              </h1>
              <p className="mt-4 text-base-content/70 max-w-xl">
                Browse services, compare sellers, and start working today. Simple checkout, clear delivery, and secure accounts.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link to="/services" className="btn btn-primary shadow-sm">
                  Explore services
                </Link>
                <Link to="/register" className="btn btn-outline">
                  Become a seller
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-base-200 p-4 border border-base-200">
                  <div className="text-sm text-base-content/60">Avg. delivery</div>
                  <div className="text-2xl font-bold mt-1">48h</div>
                  <div className="text-sm text-base-content/60">for popular gigs</div>
                </div>
                <div className="rounded-2xl bg-base-200 p-4 border border-base-200">
                  <div className="text-sm text-base-content/60">Support</div>
                  <div className="text-2xl font-bold mt-1">24/7</div>
                  <div className="text-sm text-base-content/60">message anytime</div>
                </div>
                <div className="rounded-2xl bg-base-200 p-4 border border-base-200">
                  <div className="text-sm text-base-content/60">Secure</div>
                  <div className="text-2xl font-bold mt-1">JWT</div>
                  <div className="text-sm text-base-content/60">verified email</div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] lg:min-h-full">
              <img
                src="/images/hero.jpg"
                alt="FreelancerHub hero"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral/75 via-neutral/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-base-100/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-base-200">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-base-content">Today’s highlight</div>
                      <div className="text-sm text-base-content/70">Top rated gigs across categories</div>
                    </div>
                    <Link className="btn btn-sm btn-primary" to="/services">
                      View all
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-base-content">Popular categories</h2>
              <p className="text-base-content/70 mt-1">Start with a category, then pick the best fit.</p>
            </div>
            <Link to="/services" className="btn btn-sm btn-ghost hover:bg-base-100">
              Browse all →
            </Link>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <Link
                key={c.title}
                to={`/services?cat=${encodeURIComponent(c.key)}`}
                className="group card bg-base-100 shadow-md border border-base-200 hover:shadow-xl transition-all duration-200 rounded-3xl overflow-hidden"
              >
                <figure className="h-40 relative">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </figure>
                <div className="card-body">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="card-title text-lg text-base-content">{c.title}</h3>
                    <span className="badge badge-primary badge-outline">{c.tag}</span>
                  </div>
                  <p className="text-sm text-base-content/70">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-base-100 shadow-xl border border-base-200 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-base-content">Featured services</h2>
              <p className="text-base-content/70 mt-2">
                Hand-picked examples. Your real services will appear here after you publish gigs.
              </p>

              <div className="mt-6 space-y-4">
                {featured.map((s) => (
                  <div key={s.title} className="p-4 rounded-2xl bg-base-200 border border-base-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-semibold truncate text-base-content">{s.title}</div>
                          <span className="badge badge-secondary badge-outline">{s.badge}</span>
                        </div>
                        <div className="text-sm text-base-content/70 mt-1">
                          by <span className="font-medium">{s.seller}</span> • ⭐ {s.rating} ({s.reviews})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">${s.price}</div>
                        <Link to="/services" className="btn btn-xs btn-outline mt-2">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <Link to="/services" className="btn btn-primary shadow-sm">
                  See all services
                </Link>
              </div>
            </div>

            <div className="relative min-h-[260px] lg:min-h-full">
              <img src="/images/services.jpg" alt="Services banner" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/20 to-transparent" />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-base-100 shadow-xl border border-base-200 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[260px] lg:min-h-full">
              <img src="/images/testimonials.jpg" alt="Testimonials" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/70 via-secondary/20 to-transparent" />
            </div>

            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-base-content">Trusted by early users</h2>
              <p className="text-base-content/70 mt-2">A few sample reviews (static for now).</p>

              <div className="mt-6 space-y-4">
                {testimonials.map((t) => (
                  <div key={t.name} className="p-4 rounded-2xl bg-base-200 border border-base-200">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-sm">{t.avatar}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-base-content">{t.name}</div>
                        <div className="text-sm text-base-content/60">{t.role}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-base-content/80">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] overflow-hidden shadow-xl border border-base-200 bg-base-100">
          <div className="relative">
            <img src="/images/cta.jpg" alt="CTA" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-primary/80" />
            <div className="relative p-8 sm:p-12 text-primary-content">
              <h2 className="text-3xl font-extrabold">Ready to build something?</h2>
              <p className="mt-2 text-primary-content/85 max-w-xl">
                Post a gig, hire a specialist, and ship faster. Simple. Clean. Reliable.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="btn bg-white text-primary border-white hover:bg-base-100">
                  Create Account
                </Link>
                <Link to="/services" className="btn btn-outline border-white/50 text-white hover:bg-white/10">
                  See services
                </Link>
              </div>

              <div className="mt-6 text-sm text-primary-content/75">
                Join with <code className="px-1 py-0.5 bg-white/10 rounded">FreelancerHub</code> and build your idea.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}