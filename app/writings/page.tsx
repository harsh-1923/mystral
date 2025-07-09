import React from 'react'
import { BlogMeta, getAllWritings } from './utils/getAllWritings';
import Link from 'next/link';

const page = () => {
  const writings = getAllWritings();
  console.log(writings);
  return (
    <div>
      <h1>This is the root page of the writings section.</h1>
      {writings.map((writing) => (
        <WritingsItem key={writing.slug} writing={writing} />
      ))}
    </div>
  )
}

const WritingsItem = ({ writing }: { writing: BlogMeta }) => {
  return <Link href={writing.relPath}>{writing.title}</Link>;
};

export default page