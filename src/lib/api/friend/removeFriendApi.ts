import { axiosInstance } from "../axiosInstance";

export const removeFriendApi = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/friends/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
