export type Notification = {
  id: string;
  content: string;
  createAt: Date;
  read: boolean;
  title: string;
  type: "FRIEND_REQUEST" | "SYSTEM";
  senderId?: string;
  requestId?: string;
  icon?: string;
  requestStatus?: "ACCEPTED" | "REJECTED";
};
