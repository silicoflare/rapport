"use client";

import { turretroad } from "@/utils/fonts";
import { twMerge } from "tailwind-merge";

export default function Navbar({ hideLogin = true }) {
  return (
    <div className="w-full p-5 px-10 flex items-center justify-between fixed top-0 left-0 text-foreground">
      <h1 className={twMerge("text-4xl font-semibold", turretroad)}>Rapport</h1>
    </div>
  );
}
