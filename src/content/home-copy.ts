/**
 * The homepage's section copy as it reads today. The CMS (Website →
 * Homepage) starts from these texts: an empty field shows and uses them,
 * so the site never renders a blank heading. Sections reused on other
 * pages (services, values, team) keep these texts there.
 */
export const HOME_COPY = {
  about: {
    label: "About MIL Digital",
    statement:
      "We're not just an agency. We're your partner in growth, combining strategy and execution so your brand reaches its next milestone.",
    linkLabel: "About MIL Digital",
    pillars: [
      { title: "Graph", body: "Growth you can measure." },
      { title: "People", body: "The team and the brands we grow with." },
      { title: "Scaling", body: "Reaching the next milestone." },
    ],
  },
  clients: {
    title: "Trusted by 150+ brands",
  },
  work: {
    label: "Selected works",
    title: "Results, not\njust reports.",
  },
  services: {
    title: "Three disciplines,\none growth team.",
    intro:
      "Start anywhere: a strategy audit, a campaign that needs to perform, or content that needs to stand out. The same team carries it from first plan to the numbers.",
  },
  why: {
    label: "Why MIL Digital",
    title: "We treat every brand\nas our own.",
    intro:
      "Our approach is holistic and caring: we look at every part of your business, and we care about its long-term growth. That promise has a name.",
    certCaption: "Meta certified media buying & digital marketing",
    values: [
      { mark: "A", title: "Attention", body: "We pay attention to our clients: their performance, their data, their concerns and challenges." },
      { mark: "C", title: "Care", body: "We show real dedication to every brand we work with, and treat it as our own." },
      { mark: "T", title: "Tailored strategy", body: "Strategies relevant to each client's goals, always backed by data." },
      { mark: "I", title: "Initiatives", body: "We act proactively and bring solutions before they're asked for." },
      { mark: "V", title: "Visionary", body: "We plan for where your brand is going, not just where it is today." },
      { mark: "E", title: "Excellence", body: "Excellent digital marketing work, with the attitude and work ethic to match." },
    ],
  },
  team: {
    label: "The team",
    title: "The people behind\nthe numbers.",
    intro: "15 certified digital marketing experts with 7 years of combined experience, growing brands across Indonesia from Bandung.",
  },
  testimonials: {
    label: "What our Milers say",
  },
  insights: {
    label: "Insights & reports",
    title: "Thinking out loud,\nwith receipts.",
  },
  contact: {
    label: "Contact us",
    title: "Tell us about\nyour brand.",
    intro:
      "Fill in this short brief for a free 1x consultation with our certified experts. We continue the conversation on WhatsApp or email.",
  },
};

export type HomeCopy = typeof HOME_COPY;
