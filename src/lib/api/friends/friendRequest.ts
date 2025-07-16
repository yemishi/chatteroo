import { axiosInstance } from "../axiosInstance";

export const sendFriendRequest = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/request/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    const response = await axiosInstance.patch(`/request/${requestId}/accept`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const deleteFriendRequest = async (requestId: string) => {
  try {
    const response = await axiosInstance.delete(`/request/${requestId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
