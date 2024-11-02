"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatBar({
  username,
  name,
}: {
  username: string;
  name: string;
}) {
  const router = useRouter();

  return (
    <div className="w-full p-3 px-7 flex items-center justify-between border-b-[0.5px] border-black absolute top-0 left-0 z-50 bg-white">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/9.x/notionists/svg?backgroundColor=EEEEEE&seed=${name}`}
          />
        </Avatar>
        <div className="flex flex-col items-start justify-center leading-tight">
          {name}
          <span className="text-xs text-gray-700">{username}</span>
        </div>
      </div>
      <XIcon
        size={20}
        className="cursor-pointer"
        onClick={() => router.push("/chats")}
      />
    </div>
  );
}
