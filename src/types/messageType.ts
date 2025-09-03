export type Message = {
  id: string;
  content: { text?: string; imgs: string[] };
  timestamp: Date;
  senderId: string;
  chatId: string;
  editAt?: Date;
};
