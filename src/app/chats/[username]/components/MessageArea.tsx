"use client";

import useSWR from "swr";
import { ActionMessage, getMessages, getUserData } from "../actions";
import { useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { msgMutate } from "@/utils/atoms";
import moment from "moment";

function SentMessage({
  message,
  name,
}: {
  message: ActionMessage;
  name: string;
}) {
  return (
    <div className="w-full flex items-start justify-end gap-2 px-10">
      <div className="min-w-[25%] max-w-[60%] p-2 px-3 border border-gray-300 bg-gray-300 rounded-md flex flex-col gap-2">
        <div
          className=" text-left text-wrap overflow-hidden break-words"
          style={{ whiteSpace: "pre-wrap" }}>
          {message.message}
        </div>
        <div className="w-full text-right text-xs text-gray-600">
          {moment(message.sentAt).isSame(moment(), "day")
            ? moment(message.sentAt).format("h:mm a")
            : moment(message.sentAt).calendar()}
        </div>
      </div>
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/9.x/notionists/svg?backgroundColor=EEEEEE&seed=${name}`}
        />
      </Avatar>
    </div>
  );
}

function ReceivedMessage({
  message,
  name,
}: {
  message: ActionMessage;
  name: string;
}) {
  return (
    <div className="w-full flex items-start justify-start gap-2 px-10">
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/9.x/notionists/svg?backgroundColor=EEEEEE&seed=${name}`}
        />
      </Avatar>
      <div className="min-w-[25%] max-w-[60%] p-2 px-3 border border-black bg-white rounded-md flex flex-col gap-2">
        <div
          className=" text-left text-wrap overflow-hidden break-words"
          style={{ whiteSpace: "pre-wrap" }}>
          {message.message}
        </div>
        <div className="w-full text-right text-xs text-gray-600">
          {moment(message.sentAt).isSame(moment(), "day")
            ? moment(message.sentAt).format("h:mm a")
            : moment(message.sentAt).calendar()}
        </div>
      </div>
    </div>
  );
}

export default function MessageArea({
  username,
  name,
}: {
  username: string;
  name: string;
}) {
  const { data: messages, mutate } = useSWR(["messages", username], () =>
    getMessages(username)
  );
  const { data: session } = useSession();
  const [, setMutate] = useAtom(msgMutate);

  // Create a ref for the container that will scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mutate) {
      setMutate(() => mutate);
    }
  }, [mutate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-fit gap-2 overflow-y-auto z-0">
      {messages?.map((msg) =>
        msg.sender ? (
          <SentMessage message={msg} name={session!.user.name} key={msg.id} />
        ) : (
          <ReceivedMessage message={msg} name={name} key={msg.id} />
        )
      )}

      {/* Dummy div to act as the scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}
