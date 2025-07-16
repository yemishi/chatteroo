import { axiosInstance } from "../axiosInstance";

export const getChatInfo = async (chatId: string) => {
  try {
    const response = await axiosInstance.get(`/chat/${chatId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
