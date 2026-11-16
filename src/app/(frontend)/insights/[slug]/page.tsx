import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/cms";
import { PageSkeleton } from "@/components/page/blocks";
import { ArticleView } from "@/components/views/article-view";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { images: a.image ? [a.image] : [] } } : {};
}

/** Inventory: article, author, related posts, consultation CTA (CMS). */
async function ArticlePageContent({ params }: { params: PageProps<"/insights/[slug]">["params"] }) {
  const { slug } = await params;
  const [a, all] = await Promise.all([getArticle(slug), getArticles()]);
  if (!a) notFound();
  const sameCat = all.filter((x) => x.slug !== a.slug && x.category === a.category);
  const related = [...sameCat, ...all.filter((x) => x.slug !== a.slug && x.category !== a.category)].slice(0, 3);

  return <ArticleView a={a} related={related} />;
}

/** URL data is read inside Suspense, so navigation to this route can be instant. */
export default function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ArticlePageContent params={params} />
    </Suspense>
  );
}
