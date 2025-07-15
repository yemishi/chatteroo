import { axiosInstance } from "../axiosInstance";

export const getChats = async (take?: number, page?: number) => {
  try {
    const response = await axiosInstance.get(`/chat?page=${page}&take=${take}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getChatInfo = async (chatId: string) => {
  try {
    const response = await axiosInstance.get(`/chat/${chatId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
