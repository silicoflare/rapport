"use client";

import { turretroad } from "@/utils/fonts";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="w-full p-2 px-5 md:px-10 flex items-center justify-between text-foreground">
      <Link href="/">
        <h1 className="text-3xl md:text-4xl font-semibold font-header">
          Rapport
        </h1>
      </Link>
      <UserMenu />
    </div>
  );
}
