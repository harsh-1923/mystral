"use client";
import Link from "next/link";
import HeroBanner from "./components/HomePageComponents/HeroBanner/HeroBanner";
import CurrentTime from "./components/HomePageComponents/CurrentTime";
import WindowDimensions from "./components/HomePageComponents/WindowSize";
import Socials from "./components/HomePageComponents/Socials";
import Navbar from "./components/HomePageComponents/Navbar/Navbar";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 pb-20 gap-16 font-[family-name:var(--font-geist-sans)] sm:pt-[100px] pt-[80px] w-screen min-h-screen">
      <Navbar />
      <div className="w-full max-w-[900px]">
        <div className="flex items-center justify-center relative">
          <HeroBanner />
        </div>
        <div className="flex items-center justify-between gap-2">
          <CurrentTime />
          <WindowDimensions />
        </div>
        <h1
          className="font-[family-name:var(--font-funnel-display)] font-medium mt-[40px] hero-header tracking-tight"
          style={{ fontSize: "clamp(38px, 6vw, 92px)" }}
        >
          Design Engineer
        </h1>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mt-8">
          <div className="w-full sm:w-[70%] space-y-4">
            <p className="">
              Currently, building Design Systems and DX tools at Juspay.
            </p>
            <p className="max-w-[600px]">
              Also, experimenting with user experience, interaction design and
              other web technologies.
            </p>

            <p className="relative w-fit">
              <Link href="https://www.imharshsharma.in">2024 Portfolio</Link>
            </p>
          </div>
          <div className="w-full sm:w-[20%]">
            <Socials />
          </div>
        </div>
      </div>
    </main>
  );
}
