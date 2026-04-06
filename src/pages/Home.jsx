import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, ShieldCheck, Sparkles, Star, TimerReset } from "lucide-react";

const categories = [
  {
    title: "Graphic Design",
    key: "design",
    tag: "Popular",
    img: "/images/cat-design.jpg",
    desc: "Brand identity, logos, thumbnails, banners, and polished visual assets.",
  },
  {
    title: "Web Development",
    key: "development",
    tag: "High demand",
    img: "/images/cat-dev.jpg",
    desc: "Landing pages, business sites, dashboards, bug fixes, and frontend work.",
  },
  {
    title: "Writing & Translation",
    key: "writing",
    tag: "Reliable",
    img: "/images/cat-writing.jpg",
    desc: "Articles, scripts, editing, proofreading, and multilingual content support.",
  },
  {
    title: "Video Editing",
    key: "video",
    tag: "Creative",
    img: "/images/cat-video.jpg",
    desc: "Short-form content, reels, promotional edits, and creator-ready videos.",
  },
];

const highlights = [
  { title: "Fast request flow", text: "Buyer requests first, then seller decision, then delivery update.", icon: TimerReset },
  { title: "Secure accounts", text: "Verified access and clean dashboard experience for both roles.", icon: ShieldCheck },
  { title: "Better discovery", text: "Browse services by category and compare offers more easily.", icon: BriefcaseBusiness },
];

const featured = [
  { title: "Modern business landing page", seller: "Ayesha", price: 120, rating: 4.9, reviews: 34 },
  { title: "YouTube thumbnail pack", seller: "Fahim", price: 35, rating: 4.8, reviews: 21 },
  { title: "SEO blog article", seller: "Sadia", price: 25, rating: 5.0, reviews: 17 },
];

export default function Home() {
  return (
    <div className="bg-base-200">
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:py-10">
        <section className="overflow-hidden rounded-[32px] border border-base-200/80 bg-base-100 shadow-xl">
          <div className="grid lg:grid-cols-[1.08fr_.92fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles size={15} />
                Smarter service marketplace
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight text-base-content sm:text-5xl lg:text-6xl">
                Hire skilled people and manage the full project flow in one place.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/70 sm:text-lg">
                Explore services, send clear requests, review seller updates, and keep the buyer-seller process clean without changing any core functionality.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/services" className="btn btn-primary rounded-2xl px-6 shadow-md">
                  Explore services <ArrowRight size={17} />
                </Link>
                <Link to="/register" className="btn btn-outline rounded-2xl px-6">
                  Join as buyer or seller
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-base-200 bg-base-200/80 p-4">
                  <div className="text-sm text-base-content/60">Categories</div>
                  <div className="mt-1 text-3xl font-black">4+</div>
                  <div className="text-sm text-base-content/60">ready to browse</div>
                </div>
                <div className="rounded-[24px] border border-base-200 bg-base-200/80 p-4">
                  <div className="text-sm text-base-content/60">Request flow</div>
                  <div className="mt-1 text-3xl font-black">Step-by-step</div>
                  <div className="text-sm text-base-content/60">clear approval path</div>
                </div>
                <div className="rounded-[24px] border border-base-200 bg-base-200/80 p-4">
                  <div className="text-sm text-base-content/60">Account access</div>
                  <div className="mt-1 text-3xl font-black">Verified</div>
                  <div className="text-sm text-base-content/60">safe marketplace entry</div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-full">
              <img src="/images/hero.jpg" alt="FreelancerHub hero" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral/85 via-neutral/35 to-transparent" />

              <div className="absolute inset-x-5 bottom-5 space-y-3 sm:inset-x-6 sm:bottom-6">
                <div className="rounded-[28px] border border-white/20 bg-base-100/90 p-5 backdrop-blur-md shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-base-content/60">Featured flow</div>
                      <div className="mt-1 text-xl font-bold text-base-content">Request → Review → Payment</div>
                      <p className="mt-2 text-sm leading-6 text-base-content/70">
                        Buyers can request first, sellers can respond, and payment stays for the right stage.
                      </p>
                    </div>
                    <div className="badge badge-primary rounded-full px-3 py-3">Live</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[28px] border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-base-content">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-base-content/70">{item.text}</p>
              </div>
            );
          })}
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black text-base-content">Popular categories</h2>
              <p className="mt-2 text-base-content/70">Start from a category, then choose the best service for your need.</p>
            </div>
            <Link to="/services" className="btn btn-ghost rounded-2xl px-4">Browse all</Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.title}
                to={`/services?cat=${encodeURIComponent(c.key)}`}
                className="group overflow-hidden rounded-[28px] border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 badge badge-primary rounded-full border-none">{c.tag}</div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-base-content">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-base-content/70">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[32px] border border-base-200 bg-base-100 p-7 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-base-content">Featured services</h2>
                <p className="mt-2 text-base-content/70">Beautifully arranged cards with cleaner content presentation.</p>
              </div>
              <div className="hidden rounded-2xl bg-base-200 px-4 py-2 text-sm font-medium text-base-content/60 sm:block">
                Preview list
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {featured.map((service) => (
                <div key={service.title} className="rounded-[24px] border border-base-200 bg-base-200/70 p-5 transition hover:bg-base-200">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-base-content">{service.title}</h3>
                      <p className="mt-2 text-sm text-base-content/70">
                        by <span className="font-semibold text-base-content">{service.seller}</span>
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-base-100 px-3 py-1.5 text-sm font-medium text-base-content/70">
                        <Star size={14} className="text-warning" />
                        {service.rating} · {service.reviews} reviews
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-sm text-base-content/60">Starting at</div>
                      <div className="mt-1 text-3xl font-black text-primary">${service.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-base-200 bg-base-100 shadow-sm">
            <div className="relative h-full min-h-[380px]">
              <img src="/images/services.jpg" alt="Service showcase" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-base-300/95 via-base-300/45 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-white/20 bg-base-100/92 p-6 backdrop-blur">
                <div className="text-sm font-semibold text-primary">Marketplace spotlight</div>
                <h3 className="mt-2 text-2xl font-black text-base-content">Simple interface. Stronger visual hierarchy.</h3>
                <p className="mt-3 text-sm leading-7 text-base-content/70">
                  Cleaner sections, better card spacing, improved typography, and less distracting filler text.
                </p>
                <Link to="/services" className="btn btn-primary mt-5 rounded-2xl">
                  View services <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}