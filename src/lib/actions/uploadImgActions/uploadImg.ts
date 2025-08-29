import { uploadImgApi } from "@/lib/api/upload/uploadApi";
import { useMutation } from "@tanstack/react-query";

export const uploadImg = () => {
  return useMutation({
    mutationFn: ({ file, oldImg }: { file: File; oldImg?: string }) => uploadImgApi(file, oldImg),
    mutationKey: ["upload-image"],
  });
};
