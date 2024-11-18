"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { MouseEventHandler, useEffect, useState } from "react";
import useSWR from "swr";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ActionContact, getContacts } from "../actions";
import AddContact from "./AddContact";
import Link from "next/link";

function UserCard({
  name,
  username,
  onClick,
}: {
  name: string;
  username: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className="w-full p-3 border-white rounded-lg hover:bg-gray-300 hover:border-gray-300 transition ease-in-out duration-200 flex items-center gap-2 cursor-pointer"
      onClick={onClick}>
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
  const { data, mutate } = useSWR<ActionContact[]>("chats", getContacts);
  const [chats, setChats] = useState<ActionContact[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

    let temp = data;
    if (search.trim() !== "") {
      temp = temp.filter(
        (ch) =>
          ch.name.toLowerCase().includes(search.toLowerCase()) ||
          ch.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    setChats(temp);
  }, [data, search]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start border-r border-black p-5">
      <div className="w-full flex items-center gap-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <AddContact mutate={mutate} />
      </div>
      <div className="w-full h-full overflow-y-auto flex flex-col gap-2 items-center mt-5">
        {chats?.map((chat) => (
          <div
            onClick={() => {
              router.push(`/chats/${chat.username}`);
              setSearch("");
            }}
            className="w-full"
            key={chat.username}>
            <UserCard name={chat.name} username={chat.username} />
          </div>
        ))}
      </div>
    </div>
  );
}
