"use client";

import useSWR from "swr";
import ChatBar from "./components/ChatBar";
import { getUserData } from "./actions";
import { ReactNode } from "react";
import SendChat from "./components/SendChat";
import { LoaderCircleIcon } from "lucide-react";

export default function ChatLayout({
  params,
  children,
}: {
  params: { username: string };
  children: ReactNode;
}) {
  const { data: userData } = useSWR(["userdata", params.username], () =>
    getUserData(params.username),
  );

  if (!userData) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-full">
        <LoaderCircleIcon size={30} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <ChatBar name={userData.name} username={userData.username} />
      </div>

      {/* Scrollable content area */}
      <div className="absolute inset-0 overflow-y-auto py-24">{children}</div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white">
        <SendChat username={params.username} />
      </div>
    </div>
  );
}
