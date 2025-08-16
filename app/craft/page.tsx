import React from "react";
import CraftCard from "../components/CraftCard";
import { CRAFTS } from "../crafts";

const page = () => {
  return (
    <main className="w-screen min-h-screen pb-40">
      <div className="w-full min-h-screen flex flex-col items-start max-w-2xl mx-auto px-4 space-y-25">
        {CRAFTS.map((craft, index) => (
          <CraftCard
            key={craft.id}
            id={craft.id}
            title={craft.title}
            href={craft.href}
            date={craft.date}
          />
        ))}
      </div>
    </main>
  );
};

export default page;
