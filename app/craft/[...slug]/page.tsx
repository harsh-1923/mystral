import React from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCraftBySlug } from "../utils/getAllCrafts";
import { useMDXComponents } from "../../../mdx-components";
import CraftHeader from "@/app/components/ui/CraftHeader";
import CraftFooter from "@/app/components/ui/CraftFooter";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string[] }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const craft = getCraftBySlug(slug);

  if (!craft) {
    return {
      title: "Craft Not Found",
      description: "The requested craft could not be found.",
    };
  }

  return {
    title: `${craft.title} | Harsh Sharma`,
    description: craft.tldr,
    alternates: {
      canonical: `/craft/${slug}`,
    },
    openGraph: {
      title: craft.title,
      description: craft.tldr,
      type: "article",
      publishedTime: craft.date,
      tags: craft.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: craft.title,
      description: craft.tldr,
    },
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const writing = getCraftBySlug(slug);

  if (!writing) {
    notFound();
  }

  const components = useMDXComponents();

  

  return (
    <article className="max-w-[80ch] w-full mx-auto px-4">
      <CraftHeader header={writing.title} date={writing.date} />
      <div className="w-full max-w-[80ch] mx-auto">
        <MDXRemote source={writing.content} components={components} />
      </div>
      <CraftFooter
        next={{ title: "Glyph Inspector", link: "/craft/glyph-inspector" }}
      />
    </article>
  );
};

export default Page;
