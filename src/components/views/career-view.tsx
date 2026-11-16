import type { Job } from "@/lib/cms-map";
import { PageHero } from "@/components/page/page-hero";
import { SectionHead } from "@/components/page/blocks";
import { Careers } from "@/components/page/careers";
import { Reveal } from "@/components/motion/reveal";

// What working at MIL is like, from facts about the team. Perks to be confirmed with HR.
const CULTURE = [
  { title: "Learn from certified experts", body: "Work next to Meta certified media buyers and strategists who explain the why, not just the what." },
  { title: "Real brands, real numbers", body: "150+ brands across F&B, retail, beauty, property and B2B. Your work shows up in results you can measure." },
  { title: "Knowledge sharing", body: "One of our core values. What one person learns on a campaign, the whole team gets to use." },
  { title: "One studio in Bandung", body: "Strategy, ads and creative at one table, so ideas move fast from brief to launch." },
];

/** The Career page: culture and open roles. Shared by the page and the CMS live preview. */
export function CareerView({ jobs }: { jobs: Job[] }) {
  return (
    <>
      <PageHero
        label="Career"
        title={"Grow brands.\nGrow with them."}
        intro="We're a team of digital marketers, strategists and creators. If you like ideas that can be measured, you'll fit right in."
        image="/photos/mil-team-working.jpg"
        focal="60% 40%"
      />
      <section className="theme-light sec" aria-label="Culture">
        <div className="container-x">
          <SectionHead label="Life at MIL" title={"Why people\njoin us."} />
          <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {CULTURE.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className="bg-background p-7">
                <p className="text-[13px] tabular-nums text-signal">0{i + 1}</p>
                <h3 className="t-display mt-8 text-[1.6rem]">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Careers jobs={jobs} />
    </>
  );
}
