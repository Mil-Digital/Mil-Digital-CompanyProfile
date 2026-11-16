import type { HomeData } from "@/lib/cms-map";
import { Hero } from "@/components/sections/hero";
import { Studio, StudioNumbers } from "@/components/sections/studio";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { Services } from "@/components/sections/services";
import { Values } from "@/components/sections/values";
import { Team } from "@/components/sections/team";
import { Testimonials } from "@/components/sections/testimonials";
import { Insights } from "@/components/sections/insights";
import { Contact } from "@/components/sections/contact";
import { CaseCarousel } from "@/components/page/case-carousel";

const TEAM_PHOTOS = ["/photos/mil-team-working.jpg", "/photos/mil-team-group.jpg", "/photos/indra-pratama-ceo.jpg"];

/**
 * Homepage: exactly the inventory items (hero, stats, portfolio, case
 * study, our services, why MIL & values, team, testimonials, articles &
 * reports, contact form). Dark and light chapters alternate. Deeper
 * content lives on its own page (e.g. the approach on Consultation).
 * Shared by the page and the CMS live preview.
 */
export function HomeView({ data }: { data: HomeData }) {
  const wheel = [...new Set([...TEAM_PHOTOS, ...data.caseStudies.map((c) => c.image), ...data.gallery.map((g) => g.src)])];

  return (
    <>
      <Hero hero={data.hero} video={data.hero.video} clients={data.clients} cases={data.caseStudies} />
      <Studio copy={data.copy.about} />
      <ClientMarquee clients={data.clients} title={data.copy.clients.title} />
      <CaseCarousel cases={data.caseStudies} label={data.copy.work.label} title={data.copy.work.title} />
      <Services copy={data.copy.services} />
      <Values copy={data.copy.why} />
      <StudioNumbers stats={data.stats} wheel={wheel} />
      <Team copy={data.copy.team} />
      <Testimonials testimonials={data.testimonials} label={data.copy.testimonials.label} />
      <Insights insights={data.insights} copy={data.copy.insights} />
      <Contact copy={data.copy.contact} />
    </>
  );
}
