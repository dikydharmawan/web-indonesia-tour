import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  Info,
  Map,
  Orbit,
  Sparkles,
  Tickets,
} from "lucide-react";
import Hero from "@/client/components/home/Hero";
import DestinationSearch from "@/client/components/destinations/DestinationSearch";
import DestinationCarousel from "@/client/components/ui/Carousel/DestinationCarousel";
import RouteCard from "@/client/components/routes/RouteCard";
import SectionHeading from "@/client/components/ui/SectionHeading";
import {
  getFeaturedDestinations,
  getFilterOptions,
  getSiteStats,
} from "@/server/data/destinations";
import { listRoutesWithItems } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { dict } = await getI18n();
  const [featured, routes, stats, filters] = await Promise.all([
    getFeaturedDestinations(4),
    listRoutesWithItems(),
    getSiteStats(),
    getFilterOptions(),
  ]);

  const heroItems = featured
    .filter((destination) => destination.panorama_url)
    .slice(0, 4)
    .map((destination) => ({
      title: destination.title,
      location: "Bali",
      panorama: destination.panorama_url,
      preview: destination.cover_image,
    }));
  const routeHighlights = routes.slice(0, 2);

  const steps = [
    {
      icon: Orbit,
      title: dict.home.step1Title,
      description: dict.home.step1Desc,
    },
    {
      icon: Map,
      title: dict.home.step2Title,
      description: dict.home.step2Desc,
    },
    {
      icon: CalendarCheck,
      title: dict.home.step3Title,
      description: dict.home.step3Desc,
    },
  ];

  const statItems = [
    { label: dict.home.statDestinations, value: stats.destinations },
    { label: dict.home.statRoutes, value: stats.routes },
    { label: dict.home.statCities, value: stats.cities },
    { label: dict.home.statPanoramas, value: stats.panoramas },
  ];

  return (
    <>
      <Hero items={heroItems.length > 0 ? heroItems : undefined} />

      <section aria-label={dict.home.searchAria} className="relative z-20">
        <div className="mx-auto -mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          <DestinationSearch categories={filters.categories} cities={filters.cities} />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {statItems.map((item) => (
            <div key={item.label} className="px-4 py-2 text-center md:text-start">
              <p className="font-display text-4xl font-semibold text-ink-900">
                {item.value}
                <span className="text-brand-600">.</span>
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={dict.home.featuredEyebrow}
            title={dict.home.featuredTitle}
            description={dict.home.featuredDesc}
            href="/destinasi"
            linkLabel={dict.home.featuredLink}
          />
          <DestinationCarousel destinations={featured} />
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={dict.home.routesEyebrow}
            title={dict.home.routesTitle}
            description={dict.home.routesDesc}
            href="/rute"
            linkLabel={dict.home.routesLink}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {routeHighlights.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={dict.home.howEyebrow}
            title={dict.home.howTitle}
            description={dict.home.howDesc}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-7"
              >
                <span className="absolute end-6 top-6 font-display text-4xl font-semibold text-slate-200">
                  0{index + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/25">
                  <step.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink-950 px-6 py-14 sm:px-12">
            <div
              className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-32 start-1/3 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
              aria-hidden
            />
            <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {dict.home.ctaEyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {dict.home.ctaTitle}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                  {dict.home.ctaDesc}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
                <Link
                  href="/destinasi"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-brand-50"
                >
                  <Compass className="h-4 w-4" aria-hidden />
                  {dict.home.ctaStart}
                </Link>
                <Link
                  href="/rute"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Tickets className="h-4 w-4" aria-hidden />
                  {dict.home.ctaRoutes}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5" aria-hidden />
            {dict.home.note}
          </p>
        </div>
      </section>
    </>
  );
}
