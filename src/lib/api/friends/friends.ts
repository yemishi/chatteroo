import { axiosInstance } from "../axiosInstance";

export const removeFriend = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/friends/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
