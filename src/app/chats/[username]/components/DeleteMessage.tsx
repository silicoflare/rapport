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

export default function DeleteMessage({ id }: { id: string }) {
  const [mutate] = useAtom(msgMutate);

  async function delMessage() {
    await deleteMessage(id);
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
            This deletes the message for everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => delMessage()}>
            Yes
          </AlertDialogAction>
          <AlertDialogCancel>No</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
