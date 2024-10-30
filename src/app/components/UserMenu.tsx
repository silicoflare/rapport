"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="">
      {!session ? (
        <Button className="font-header" onClick={() => router.push("/login")}>
          Login
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger disabled={!session?.user}>
            <div className="flex items-center justify-center gap-3 px-5 py-3 border-white rounded-md hover:bg-gray-200 hover:border-gray-200 transition ease-in-out duration-300 text-lg cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/notionists/svg?backgroundColor=EEEEEE&seed=${
                    session.user!.name
                  }`}
                />
              </Avatar>
              <div className="flex flex-col items-start justify-center leading-tight">
                {session.user!.name}
                <span className="text-xs text-gray-700">
                  {session.user!.username}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border border-primary shadow-none font-body">
            <DropdownMenuLabel>Chats</DropdownMenuLabel>
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary" />
            <DropdownMenuLabel
              className="text-red-600 cursor-pointer"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              Log Out
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
