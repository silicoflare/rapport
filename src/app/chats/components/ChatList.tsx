"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ActionContact, getContacts } from "../actions";
import AddContact from "./AddContact";

function UserCard({
  name,
  username,
  chat_id,
}: {
  name: string;
  username: string;
  chat_id: string;
}) {
  const router = useRouter();

  return (
    <div
      className="w-full p-3 border-white rounded-lg hover:bg-gray-300 hover:border-gray-300 transition ease-in-out duration-200 flex items-center gap-2 cursor-pointer"
      onClick={() => router.push(`/chats/${chat_id}`)}>
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
  );
}

export default function ChatList() {
  const [search, setSearch] = useState("");
  const { data: chats, mutate } = useSWR<ActionContact[]>("chats", getContacts);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start border-r border-black p-5">
      <div className="w-full flex items-center gap-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <AddContact mutate={mutate} />
      </div>
      <div className="w-full h-full overflow-y-auto flex flex-col gap-2 items-center mt-5">
        {chats?.map((chat) => (
          <UserCard
            name={chat.name}
            username={chat.username}
            chat_id={chat.chat_id}
            key={chat.chat_id}
          />
        ))}
      </div>
    </div>
  );
}
