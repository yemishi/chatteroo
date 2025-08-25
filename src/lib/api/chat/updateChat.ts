import { axiosInstance } from "../axiosInstance";

export const markChatAsReadApi = async (chatId: string) => {
  try {
    const response = await axiosInstance.patch("/chat/read", { chatId });
    return response.data as { message: string; lastMessageReadAt: Date };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
