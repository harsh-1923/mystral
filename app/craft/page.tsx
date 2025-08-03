import React from "react";
import CraftCard from "../components/CraftCard";
import { getAllCrafts } from "./utils/getAllCrafts";

const page = () => {
  const crafts = getAllCrafts();
  console.log(crafts);
  return (
    <main className="w-screen min-h-screen">
      <div className="w-full min-h-screen flex flex-col items-start max-w-2xl mx-auto px-4">
        {Array.from({ length: 1 }).map((_, index) => (
          <CraftCard
            key={index}
            title="Hold to Delete"
            href="https://imharsh.s3.eu-north-1.amazonaws.com/fractal/craft/hold-to-delete.mov"
            date="2025-01-01"
          />
        ))}
      </div>
    </main>
  );
};

export default page;
