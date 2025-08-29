import { axiosInstance } from "../axiosInstance";

export const uploadImgApi = async (file: File, oldImg?: string) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    if (oldImg) formData.append("oldImg", oldImg);

    const response = await axiosInstance.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data as { imageUrl: string; message?: string };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Upload failed");
  }
};

