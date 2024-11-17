"use client";

import useSWR from "swr";
import { getUserData } from "./actions";
import MessageArea from "./components/MessageArea";
import { use } from "react";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function UserChat({ params }: PageProps) {
  const { username } = use(params);

  const { data: userData } = useSWR(["userdata", username], () =>
    getUserData(username)
  );

  return (
    <div className="w-full">
      <MessageArea username={username} name={userData!.name} />
    </div>
  );
}
