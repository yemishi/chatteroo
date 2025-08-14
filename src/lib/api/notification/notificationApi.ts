import { axiosInstance } from "../axiosInstance";

export const readNotificationsApi = async (id: string) => {
  try {
    const response = await axiosInstance.patch("/notification/read", { id });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const deleteNotificationsApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete("/notification", { data: { id } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
