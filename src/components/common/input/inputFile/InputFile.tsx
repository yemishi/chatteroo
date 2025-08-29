import "./styles.scss";
import ImageIcon from "@/assets/icons/picture.svg?react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  size?: number;
  onChange?: (data: { preview: string; file: File }) => void;
}

export default function InputFile({ size = 24, ...props }: Props) {
  const { className = "", onChange, ...rest } = props;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const data = {
      preview: URL.createObjectURL(file),
      file,
    };

    onChange?.(data);
  };
  return (
    <label className="input-file">
      <ImageIcon className="input-file--placeholder" width={size} height={size} />
      <input {...rest} onChange={handleFileChange} type="file" />
    </label>
  );
}
