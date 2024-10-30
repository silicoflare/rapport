"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { recAtom } from "@/utils/atoms";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { turretroad } from "@/utils/fonts";

export default function Passphrase() {
  const [passphrase, setPassphrase] = useAtom(recAtom);
  const router = useRouter();

  useEffect(() => {
    // If passphrase is null or undefined, redirect to home
    if (!passphrase) {
      router.push("/");
    }
  }, [passphrase, router]); // Ensure passphrase and router are dependencies

  return (
    <div className="flex flex-col w-screen h-screen gap-3 justify-center items-center">
      <div className="w-1/3 flex flex-col items-center">
        <h2 className={cn("text-3xl font-semibold", turretroad)}>
          Recovery phrase
        </h2>
        <span className="w-full text-center">
          This is the recovery phrase required to reset the password. If you
          lose it, <b>you cannot recover your account</b>.
        </span>
        <div
          className="mt-5 p-5 font-mono bg-gray-300 border border-gray-300 rounded-md cursor-pointer grid grid-cols-4 gap-3 items-center align-middle text-center justify-items-center"
          onClick={async () => {
            await navigator.clipboard.writeText(passphrase ?? "");
            toast.success("Copied to clipboard!");
          }}
        >
          {passphrase?.split(" ").map((x, index) => (
            <span key={index}>{x}</span>
          ))}
        </div>
        <Button
          className="mt-10 px-20"
          onClick={() => {
            setPassphrase(null);
            router.replace("/");
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
