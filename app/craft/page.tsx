import React from "react";
import { BlogMeta, getAllCrafts } from "./utils/getAllCrafts";

import Link from "next/link";
import TextScramble from "../components/effects/TextScramble";

const page = () => {
  const crafts = getAllCrafts();
  return (
    <main className="w-screen min-h-screen">
      <div className="w-full min-h-screen flex flex-col items-start max-w-3xl mx-auto">
        {crafts.map((writing) => (
          <ScrambledLink key={writing.slug} title={writing.title} href={writing.relPath} date={writing.date} />
        ))}
      </div>
    </main>
  );
};


export const ScrambledLink = ({
  title,
  href,
  date,
}: {
  title: string;
  href: string;
  date: string;
}) => {
  return (
    <Link
      href={href}
      className="h-12 w-full flex items-center justify-between px-4"
    >
      <TextScramble
        text={title}
        scrambleSpeed={25}
        scrambledLetterCount={5}
        autoStart={true}
        characters="abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
      />
      <div className="text-sm font-mono text-[var(--colors-gray11)]">
        {date}
      </div>
    </Link>
  );
};
export default page;
