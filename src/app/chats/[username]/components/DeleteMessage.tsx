"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { deleteMessage } from "../actions";
import { useAtom } from "jotai";
import { msgMutate } from "@/utils/atoms";

export default function DeleteMessage({
  id,
  isSender,
}: {
  id: string;
  isSender: boolean;
}) {
  const [mutate] = useAtom(msgMutate);

  async function delMessage(type: number) {
    await deleteMessage(id, isSender ? (type === 1 ? "01" : "11") : "10");
    if (typeof mutate === "function") await mutate();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2Icon
          size={13}
          className="hidden group-hover:inline cursor-pointer"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the message?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can delete this message for yourselves
            {isSender ? " or for everyone" : ""}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => delMessage(1)}>
            Delete for me
          </AlertDialogAction>
          {isSender && (
            <AlertDialogAction onClick={() => delMessage(3)}>
              Delete for everyone
            </AlertDialogAction>
          )}
          <AlertDialogCancel>No</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
