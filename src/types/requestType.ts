export type FriendRequest = {
  id: string;
  toId: string;
  createAt: Date;
  from: From;
  fromId: string;
};

type From = {
  guestId?: string;
  picture: string;
  username: string;
};
