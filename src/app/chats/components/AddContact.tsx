"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSWR, { KeyedMutator } from "swr";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MouseEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import { ActionContact, ActionUser, addContact, getUsers } from "../actions";

function UserCard({
  id,
  name,
  username,
  onClick,
}: {
  id: string;
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

export default function AddContact({
  mutate,
}: {
  mutate: KeyedMutator<ActionContact[]>;
}) {
  const { data: users } = useSWR("users", getUsers);
  const [open, setOpen] = useState(false);

  async function contact(id: string) {
    await addContact(id);
    toast.success("Added contact successfully!");
    setOpen(false);
    await mutate();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger className="w-10 h-full bg-primary border-primary rounded-md text-white text-sm p-2 flex items-center justify-center">
        <PlusIcon size={15} />
      </DialogTrigger>
      <DialogContent className="max-h-[66.666667%]">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col items-center gap-3 overflow-y-auto">
          {users?.map((u) => (
            <UserCard
              id={u.id}
              name={u.name}
              username={u.username}
              key={u.id}
              onClick={(e) => contact(u.id)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
