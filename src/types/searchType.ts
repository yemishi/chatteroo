import type { Chat } from "./chatType";

export type SearchUser = {
  id: string;
  chat?: Chat;
  username: string;
  receivedRequests: Requests[];
  sentRequests: Requests[];
  picture: string;
};

type Requests = {
  createdAt: Date;
  fromId: string;
  id: string;
  toId: string;
  updatedAt: string;
};
