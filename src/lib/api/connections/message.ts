import { axiosInstance } from "../axiosInstance";

export const getMessages = async (chatId: string, take?: number, page?: number) => {
  try {
    const response = await axiosInstance.get(`/message/${chatId}page=${page}&take=${take}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const editMessage = async (msgId: string, content: string) => {
  try {
    const response = await axiosInstance.patch(`/message?messageId=${msgId}`, content);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
