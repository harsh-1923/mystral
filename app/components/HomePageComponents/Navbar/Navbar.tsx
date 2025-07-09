"use client";
import "./Navbar.css";
import Link from "next/link";
import React from "react";
import Sign from "../Sign/Sign";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-screen fixed left-0 top-0 z-30">
      <div className="gradient-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="max-w-[900px] mx-auto flex items-center justify-between p-4 relative">
        <Link href="/" className="z-[999999]">
          <Sign />
        </Link>
{/* 
        <button
          className="sm:hidden z-[999999]"
          onClick={() => toast("In Progress")}
        >
          <Menu />
        </button> */}

        <div className="space-x-6 block z-[999999]">
          <Link
            href="/craft"
            className={`font-[family-name:var(--font-geist-mono)] bg-blend-difference text-sm font-medium hover:text-[var(--foreground)] transition-colors dura ${
              pathname === "/craft"
                ? "text-[var(--foreground)]"
                : "dark:text-neutral-400 text-neutral-500"
            }`}
          >
            Craft
          </Link>
          {/* <Link
            href="/writings"
            className={`font-[family-name:var(--font-geist-mono)] bg-blend-difference text-sm font-medium hover:text-[var(--foreground)] transition-colors dura ${
              pathname === "/writing"
                ? "text-[var(--foreground)]"
                : "dark:text-neutral-400 text-neutral-500"
            }`}
          >
            Writing
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
