import type { Chat } from "@/types";
import { axiosInstance } from "../axiosInstance";

export const getChatInfo = async (chatId: string) => {
  try {
    const response = await axiosInstance.get(`/chat/${chatId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getChats = async () => {
  try {
    const response = await axiosInstance.get(`/chat`);
    return response.data as Chat[];
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
