import { Link } from "react-router-dom";

const categories = [
  { title: "Graphic Design", desc: "Logos, branding, UI kits", img: "/images/cat-design.jpg", tag: "Design" },
  { title: "Web Development", desc: "React, Django, APIs", img: "/images/cat-dev.jpg", tag: "Development" },
  { title: "Writing & Translation", desc: "Blog, copy, CV", img: "/images/cat-writing.jpg", tag: "Writing" },
  { title: "Video & Motion", desc: "Edits, reels, ads", img: "/images/cat-video.jpg", tag: "Video" },
];

const featured = [
  { title: "Landing Page in 48 Hours", price: 49, seller: "seller1", rating: 4.9, reviews: 128, badge: "Fast delivery" },
  { title: "Logo + Brand Kit (Pro)", price: 35, seller: "seller1", rating: 4.8, reviews: 92, badge: "Best seller" },
  { title: "Django REST API Setup", price: 79, seller: "seller1", rating: 4.9, reviews: 64, badge: "Secure" },
];

const testimonials = [
  { name: "Ayesha", role: "Small business owner", text: "Hired a designer and got a full brand kit in 2 days. Super smooth!", avatar: "A" },
  { name: "Rafi", role: "Startup founder", text: "The dev delivered clean API + docs. Payments and messaging next!", avatar: "R" },
  { name: "Nabila", role: "Content lead", text: "Great writers here. My blog output doubled without sacrificing quality.", avatar: "N" },
];

export default function Home() {
  return (
    <div className="bg-base-200/30">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-base-100 shadow">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-sm">
                <span className="badge badge-primary badge-sm" />
                Marketplace • Hire in minutes
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
                Find the right freelancer for your next project
              </h1>
              <p className="mt-4 text-base-content/70 max-w-xl">
                Browse services, compare portfolios, and start working today. Simple checkout, clear delivery, and secure accounts.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link to="/services" className="btn btn-primary">
                  Explore services
                </Link>
                <Link to="/register" className="btn btn-outline">
                  Become a seller
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-base-200 p-4">
                  <div className="text-sm text-base-content/60">Avg. delivery</div>
                  <div className="text-2xl font-bold mt-1">48h</div>
                  <div className="text-sm text-base-content/60">for popular gigs</div>
                </div>
                <div className="rounded-2xl bg-base-200 p-4">
                  <div className="text-sm text-base-content/60">Support</div>
                  <div className="text-2xl font-bold mt-1">24/7</div>
                  <div className="text-sm text-base-content/60">message anytime</div>
                </div>
                <div className="rounded-2xl bg-base-200 p-4">
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
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-base-100/85 backdrop-blur rounded-2xl p-4 shadow">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">Today’s highlight</div>
                      <div className="text-sm text-base-content/70">Top rated gigs across categories</div>
                    </div>
                    <Link className="btn btn-sm btn-outline" to="/services">
                      View all
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Popular categories</h2>
              <p className="text-base-content/70 mt-1">Start with a category, then pick the best fit.</p>
            </div>
            <Link to="/services" className="btn btn-sm btn-ghost">
              Browse all →
            </Link>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <Link
                key={c.title}
                to="/services"
                className="group card bg-base-100 shadow hover:shadow-xl transition"
              >
                <figure className="h-40 relative">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </figure>
                <div className="card-body">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="card-title text-lg">{c.title}</h3>
                    <span className="badge badge-outline">{c.tag}</span>
                  </div>
                  <p className="text-sm text-base-content/70">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED */}
        <section className="rounded-3xl bg-base-100 shadow overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold">Featured services</h2>
              <p className="text-base-content/70 mt-2">
                Hand-picked examples. Your real services will appear here after you publish gigs.
              </p>

              <div className="mt-6 space-y-4">
                {featured.map((s) => (
                  <div key={s.title} className="p-4 rounded-2xl bg-base-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-semibold truncate">{s.title}</div>
                          <span className="badge badge-primary badge-outline">{s.badge}</span>
                        </div>
                        <div className="text-sm text-base-content/70 mt-1">
                          by <span className="font-medium">{s.seller}</span> • ⭐ {s.rating} ({s.reviews})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold">${s.price}</div>
                        <Link to="/services" className="btn btn-xs btn-outline mt-2">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <Link to="/services" className="btn btn-primary">
                  See all services
                </Link>
              </div>
            </div>

            <div className="relative min-h-[260px] lg:min-h-full">
              <img src="/images/services.jpg" alt="Services banner" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="rounded-3xl bg-base-100 shadow p-8 sm:p-12">
          <h2 className="text-2xl font-bold">How it works</h2>
          <p className="text-base-content/70 mt-1">Three simple steps, no confusion.</p>

          <ul className="steps steps-vertical lg:steps-horizontal mt-6 w-full">
            <li className="step step-primary">Create account</li>
            <li className="step step-primary">Choose a service</li>
            <li className="step">Place order</li>
            <li className="step">Chat & deliver</li>
          </ul>

          <div className="mt-6 grid md:grid-cols-3 gap-5">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Verified login</h3>
                <p className="text-sm text-base-content/70">Email verification keeps accounts safer and reduces spam.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Clear order status</h3>
                <p className="text-sm text-base-content/70">Pending → In progress → Completed. No guessing.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Simple API</h3>
                <p className="text-sm text-base-content/70">Swagger docs included. Easy to test and extend.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="rounded-3xl bg-base-100 shadow overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[260px] lg:min-h-full">
              <img src="/images/testimonials.jpg" alt="Testimonials" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
            </div>

            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold">Trusted by early users</h2>
              <p className="text-base-content/70 mt-2">A few sample reviews (static for now).</p>

              <div className="mt-6 space-y-4">
                {testimonials.map((t) => (
                  <div key={t.name} className="p-4 rounded-2xl bg-base-200">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-sm">{t.avatar}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{t.name}</div>
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

        {/* CTA */}
        <section className="rounded-3xl overflow-hidden shadow bg-base-100">
          <div className="relative">
            <img src="/images/cta.jpg" alt="CTA" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative p-8 sm:p-12 text-white">
              <h2 className="text-3xl font-extrabold">Ready to build something?</h2>
              <p className="mt-2 text-white/80 max-w-xl">
                Do something new.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="btn btn-primary">
                  Create account
                </Link>
                <Link to="/services" className="btn btn-outline btn-ghost text-white border-white/40">
                  See services
                </Link>
              </div>

              <div className="mt-6 text-sm text-white/70">
                join with <code className="px-1 py-0.5 bg-white/10 rounded">US</code> to buid your idea.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}