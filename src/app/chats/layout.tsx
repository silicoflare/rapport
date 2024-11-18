"use client";

import { ReactNode, useEffect } from "react";
import ChatList from "./components/ChatList";
import useMounted from "@/hooks/useMounted";
import { usePathname, useRouter } from "next/navigation";

export default function ChatsLayout({ children }: { children: ReactNode }) {
  const isMounted = useMounted();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (pathname && pathname.startsWith("/chats/")) {
          router.push("/chats");
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [router]);

  if (!isMounted) return <></>;

  return (
    <>
      <div className="w-full h-full hidden md:grid grid-cols-4 border-t border-black overflow-hidden">
        <ChatList />
        <div className="w-full h-full col-span-3">{children}</div>
      </div>
      <div className="w-full h-full grid md:hidden border-t border-black overflow-hidden">
        {pathname === "/chats" ? (
          <ChatList />
        ) : (
          <div className="w-full h-full col-span-3">{children}</div>
        )}
      </div>
    </>
  );
}
