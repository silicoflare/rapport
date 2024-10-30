import { ReactNode } from "react";
import ChatList from "./components/ChatList";

export default function ChatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full grid grid-cols-4 border-t border-black">
      <ChatList />
      <div className="w-full h-full col-span-3">{children}</div>
    </div>
  );
}
