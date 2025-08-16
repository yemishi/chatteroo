import { useState } from "react";
import EyeIcon from "./eyeIcon/EyeIcon";
import "./style.scss";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  value?: string | number;
  type?: "text" | "number" | "email" | "password";
  error?: string;
  name?: string;
  required?: boolean;
  pattern?: string;
  isPassword?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ required, error, label, name, isPassword, pattern, ...props }: InputProps) {
  const { id, type: typeProp = "text", ...rest } = props;

  const [isPasswordType, setIsPasswordType] = useState(isPassword);
  const type = isPasswordType ? "password" : typeProp;
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={`input-container ${error ? " input-container--error" : ""}`}>
      <label className="input-label" htmlFor={inputId}>
        {label}
      </label>
      <span className="input-wrapper">
        <input {...rest} pattern={pattern} name={name} required={required} type={type} id={inputId} />
        {isPassword && <EyeIcon open={!isPasswordType} onClick={() => setIsPasswordType(!isPasswordType)} />}
      </span>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
