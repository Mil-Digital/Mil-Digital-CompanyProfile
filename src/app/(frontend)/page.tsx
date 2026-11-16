import { getHomeData } from "@/lib/cms";
import { HomeView } from "@/components/views/home-view";

export default async function HomePage() {
  return <HomeView data={await getHomeData()} />;
}
