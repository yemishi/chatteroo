import type { Message } from "./index";

export type Chat = {
  id: string;
  isGroup: boolean;
  lastMessageAt?: Date;
  members: ChatMember[];
  messages: Message[];
};

export type ChatMember = {
  id: string;
  picture: string;
  username: string;
};
