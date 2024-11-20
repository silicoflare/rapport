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
      <div className="ph:w-[90%] w-2/3 flex flex-col items-center gap-3">
        <h1 className="text-5xl ph:text-2xl font-bold font-header text-center">
          End-to-end encryption.
          <br className="ph:inline-block" /> For everyone.
        </h1>
        <h2 className="text-2xl ph:text-lg font-body text-center">
          Your messages belong to you, and nobody else.
        </h2>
        <br />
        <div className="mt-10 ph:mt-5 w-2/3 ph:w-4/5 grid ph:grid-rows-2 md:grid-cols-2 gap-5 items-center justify-items-center">
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
    </div>
  );
}
