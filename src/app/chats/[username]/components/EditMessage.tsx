import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { editMessage } from "../actions";
import { useAtom } from "jotai";
import { msgMutate } from "@/utils/atoms";

const EditMessage = ({
  id,
  content,
  username,
}: {
  id: string;
  content: string;
  username: string;
}) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [mutate] = useAtom(msgMutate);

  useEffect(() => {
    setMessage(content);
  }, [content]);

  async function edMessage() {
    await editMessage(username, id, message);
    if (typeof mutate === "function") await mutate();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(op) => setOpen(op)}>
      <DialogTrigger>
        <PencilIcon
          size={13}
          className="hidden group-hover:inline cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Message</DialogTitle>
        <div className="w-full flex flex-col items-center gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="w-full flex items-center justify-end">
            <Button onClick={() => edMessage()}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMessage;
