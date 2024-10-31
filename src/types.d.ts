import ECDH from "./utils/crypto/ECDH";

export interface UserState {
  user_secret: string;
  ecdh: ECDH;
}

export interface ChatState {
  chat_secret: string;
  shared_key: string;
}
