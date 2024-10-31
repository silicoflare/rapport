import { ChatState, UserState } from "@/types";

export class KeyStore<K, T> {
  private store: Map<K, T>;

  constructor() {
    this.store = new Map<K, T>();
  }

  set(key: K, value: T): void {
    this.store.set(key, value);
  }

  get(key: K): T | undefined {
    return this.store.get(key);
  }

  delete(key: K): void {
    this.store.delete(key);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }
}

// store user:user-secret pairs
export const USER_STORE = new KeyStore<string, UserState>();

// store user:chat-secrets pairs
export const CHAT_STORE = new KeyStore<string, Record<string, ChatState>>();

// store user:contact pairs
export const CONTACT_STORE = new KeyStore<string, string>();
