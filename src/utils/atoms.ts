import { ActionMessage } from "@/app/chats/[username]/actions";
import { atom } from "jotai";
import { type KeyedMutator } from "swr";

export const recAtom = atom<string | null>(null);

export const msgMutate = atom<KeyedMutator<ActionMessage[]> | null>(null);
