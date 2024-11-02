"use client";

import useSWR from "swr";
import { getUserData } from "./actions";
import MessageArea from "./components/MessageArea";

export default function UserChat({ params }: { params: { username: string } }) {
  const { data: userData } = useSWR(["userdata", params.username], () =>
    getUserData(params.username)
  );

  return (
    <div className="w-full">
      <MessageArea username={params.username} name={userData!.name} />
    </div>
  );
}
