import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Site } from "@/components/experience/Site";
import { languages } from "@/content/client";
import { content, type Lang } from "@/lib/content";

/**
 * Bản dịch của thiệp: "/vi". Tiếng Anh là trang chủ ("/"), nên không
 * dựng "/en". Dựng tĩnh lúc build; đường dẫn lạ ngoài danh sách là 404.
 */
const TRANSLATED = languages.list.filter((item) => item.id !== "en").map((item) => item.id);

export const dynamicParams = false;

export function generateStaticParams() {
  return TRANSLATED.map((lang) => ({ lang }));
}

function toLang(value: string): Exclude<Lang, "en"> | null {
  return (TRANSLATED as string[]).includes(value) ? (value as Exclude<Lang, "en">) : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = toLang((await params).lang);
  if (!lang) return {};
  const { meta } = content(lang);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: meta.locale,
      images: [{ url: meta.ogImage }],
    },
  };
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const lang = toLang((await params).lang);
  if (!lang) notFound();
  return <Site lang={lang} />;
}
