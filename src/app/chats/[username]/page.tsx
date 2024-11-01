"use client";

import useSWR from "swr";
import { getChat } from "./actions";

export default function UserChat({ params }: { params: { username: string } }) {
  const { data: chatID } = useSWR(["chatID", params.username], () =>
    getChat(params.username)
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {chatID}
    </div>
  );
}
