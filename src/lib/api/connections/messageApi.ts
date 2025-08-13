import { axiosInstance } from "../axiosInstance";

export const editMessageApi = async (msgId: string, content: string) => {
  try {
    const response = await axiosInstance.patch(`/message?messageId=${msgId}`, content);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
