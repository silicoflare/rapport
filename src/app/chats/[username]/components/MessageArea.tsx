"use client";

import useSWR from "swr";
import { ActionMessage, getMessages } from "../actions";
import { useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { msgMutate } from "@/utils/atoms";
import moment from "moment";
import Markdown from "react-markdown";
import DeleteMessage from "./DeleteMessage";
import EditMessage from "./EditMessage";

function SentMessage({
  message,
  name,
  to,
}: {
  message: ActionMessage;
  name: string;
  to: string;
}) {
  return (
    <div className="w-full flex items-start justify-end gap-2 px-10">
      <div className="min-w-[25%] max-w-[60%] p-2 px-3 border border-gray-300 bg-gray-300 rounded-md flex flex-col gap-2 group">
        <div
          className=" text-left text-wrap overflow-hidden break-words"
          style={{ whiteSpace: "normal" }}>
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-semibold">{children}</h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-500 pl-4 italic p-0 m-0 ">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5">{children}</ol>
              ),
              li: ({ children }) => <li className="">{children}</li>,
            }}>
            {message.message.trim()}
          </Markdown>
        </div>
        <div className="w-full flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <EditMessage
              id={message.id}
              content={message.message.trim()}
              username={to}
            />
            <DeleteMessage id={message.id} />
          </div>
          <span className="flex items-center gap-2">
            {message.edited ? "Edited " : ""}
            {moment(message.sentAt).isSame(moment(), "day")
              ? moment(message.sentAt).format("h:mm a")
              : moment(message.sentAt).calendar()}
          </span>
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
          style={{ whiteSpace: "normal" }}>
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-semibold">{children}</h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-500 pl-4 italic p-0 m-0 ">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5">{children}</ol>
              ),
              li: ({ children }) => <li className="">{children}</li>,
            }}>
            {message.message.trim()}
          </Markdown>
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
          <SentMessage
            message={msg}
            name={session!.user.name}
            to={username}
            key={msg.id}
          />
        ) : (
          <ReceivedMessage message={msg} name={name} key={msg.id} />
        )
      )}

      {/* Dummy div to act as the scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}
