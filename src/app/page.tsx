"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/fonts";
import { userSecrets } from "@/utils/keys";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function print() {
      await userSecrets();
    }

    print();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-1/3 flex flex-col items-center gap-3">
        <Link
          href="/signup"
          className="w-full border-primary rounded-md text-xl p-3 bg-primary text-primary-foreground flex items-center justify-center font-montserrat">
          Sign Up
        </Link>
        <Link
          href="/login"
          className="w-full border-primary rounded-md text-xl p-3 bg-primary text-primary-foreground flex items-center justify-center font-montserrat">
          Login
        </Link>
      </div>
    </div>
  );
}
