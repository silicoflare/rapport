"use client";

import { Textarea } from "@/components/ui/textarea";
import { SendHorizonalIcon } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { sendMessage } from "../actions";
import { useAtom } from "jotai";
import { msgMutate } from "@/utils/atoms";
import { Button } from "@/components/ui/button";

export default function SendChat({ username }: { username: string }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mutate] = useAtom(msgMutate);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`; // Add max height of 200px
    }
  }, [message]);

  async function messageSend() {
    await sendMessage(username, message);
    if (typeof mutate === "function") await mutate();
    setMessage("");
  }

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await messageSend();
    }
  };

  return (
    <div className="w-full p-3 flex items-center gap-3 bg-white absolute bottom-0 left-0 z-50">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="resize-none w-full"
        style={{
          overflow: "auto",
        }}
      />
      <button
        disabled={message.trim().length === 0}
        className="p-2 w-10 h-10 flex-shrink-0 disabled:text-gray-500"
        onClick={() => messageSend()}>
        <SendHorizonalIcon size={20} className="cursor-pointer" />
      </button>
    </div>
  );
}
