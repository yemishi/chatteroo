import { axiosInstance } from "../axiosInstance";

export const getFriends = async (userId: string, take?: number, page?: number) => {
  try {
    const response = await axiosInstance.get(`/friends/${userId}?take=${take}&page=${page}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const removeFriend = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/friends/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
