import type { Message } from "./index";

export type Chat = {
  id: string;
  isGroup: boolean;
  lastMessageAt?: Date;
  members: User[];
  messages: Message[];
};

type User = {
  id: string;
  picture: string;
  username: string;
};
