import { axiosInstance } from "../axiosInstance";

export const getFriendRequests = async (take?: number, page?: number) => {
  try {
    const response = await axiosInstance.get(`/requests?take=${take}&page=${page}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const sendFriendRequest = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/requests/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    const response = await axiosInstance.patch(`/requests/${requestId}/accept`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const deleteFriendRequest = async (requestId: string) => {
  try {
    const response = await axiosInstance.delete(`/requests/${requestId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
