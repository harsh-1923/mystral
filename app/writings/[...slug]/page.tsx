import React from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { ArrowLeft, ClockFading, Tag } from "lucide-react";
import { useMDXComponents } from "../../../mdx-components";
import { getWritingBySlug } from "../utils/getAllWritings";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string[] }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const writing = getWritingBySlug(slug);

  if (!writing) {
    return {
      title: "Writing Not Found",
      description: "The requested writing could not be found.",
    };
  }

  return {
    title: writing.title,
    description: writing.tldr,
    alternates: {
      canonical: `/writings/${slug}`,
    },
    openGraph: {
      title: writing.title,
      description: writing.tldr,
      type: "article",
      publishedTime: writing.date,
      tags: writing.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: writing.title,
      description: writing.tldr,
    },
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const writing = getWritingBySlug(slug);

  if (!writing) {
    notFound();
  }

  const components = useMDXComponents();

  return (
    <article className="max-w-[80ch] w-full mx-auto px-4">
      <div className="w-full flex items-center justify-center mb-10">
        <Link
          href="/writings"
          className="text-sm flex items-center gap-2 text-[var(--colors-grayA10)] hover:text-[var(--foreground)] focus-visible::outline-2 focus-visible:outline-[var(--colors-focus)] focus-visible:outline-offset-2 px-2 py-1 rounded-md transition-colors duration-75"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all writings
        </Link>
      </div>
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
        <Balancer ratio={0.5}>{writing.title}</Balancer>
      </h1>
      <div className="flex items-center justify-between gap-2 py-8">
        <span className="text-sm text-[var(--colors-grayA10)] flex items-center gap-2">
          <ClockFading className="w-4 h-4" />
          {writing.date}
        </span>
      </div>
      <div className="w-full max-w-[80ch] mx-auto">
        <MDXRemote source={writing.content} components={components} />
      </div>
    </article>
  );
};

export default Page;
