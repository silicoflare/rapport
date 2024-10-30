import { LockKeyholeIcon } from "lucide-react";

export default function ChatsHome() {
  return (
    <div className="w-full h-full flex flex-col gap-5 items-center justify-center text-gray-500">
      <LockKeyholeIcon size={50} />
      <div className="text-center">
        All your chats are end-to-end encrypted.
        <br />
        No one outside the chat can read them.
      </div>
    </div>
  );
}
