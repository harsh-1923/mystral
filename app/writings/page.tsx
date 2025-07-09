import React from 'react'
import { BlogMeta, getAllWritings } from './utils/getAllWritings';
import Link from 'next/link';
import { ScrambledLink } from '../craft/page';

const page = () => {
  const writings = getAllWritings();
  return (
    <main className="w-screen min-h-screen">
      <div className="w-full min-h-screen flex flex-col items-start max-w-3xl mx-auto">
        {writings.map((writing) => (
          <ScrambledLink
            key={writing.slug}
            title={writing.title}
            href={writing.relPath}
            date={writing.date}
          />
        ))}
      </div>
    </main>
  );
}

const WritingsItem = ({ writing }: { writing: BlogMeta }) => {
  return <Link href={writing.relPath}>{writing.title}</Link>;
};

export default page