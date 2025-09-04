import { axiosInstance } from "../axiosInstance";

export const editMessageApi = async (
  msgId: string,
  content: { text?: string; imgs: string[] },
  removedImgs: string[]
) => {
  try {
    const response = await axiosInstance.patch("/message", { content, removedImgs, msgId });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const deleteMessageApi = async (msgId: string, imgs: string[]) => {
  try {
    const response = await axiosInstance.delete("/message", { data: { msgId, imgs } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
