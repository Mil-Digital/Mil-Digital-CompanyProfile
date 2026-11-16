import type { Metadata } from "next";
import { getJobs } from "@/lib/cms";
import { CareerView } from "@/components/views/career-view";

export const metadata: Metadata = {
  title: "Career",
  description: "Join MIL Digital in Bandung: open roles in strategy, performance marketing and creative.",
};

/** Inventory: culture and open roles, directing to the application form (CMS). */
export default async function CareerPage() {
  const jobs = await getJobs();
  return <CareerView jobs={jobs} />;
}
