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
  variant?: "primary" | "secondary";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  required,
  error,
  label,
  name,
  variant = "primary",
  isPassword,
  pattern,
  ...props
}: InputProps) {
  const { id, type: typeProp = "text", className = "", ...rest } = props;

  const [isPasswordType, setIsPasswordType] = useState(isPassword);
  const type = isPasswordType ? "password" : typeProp;
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={`input-container input-container-${variant} ${className} ${error ? "input-container--error" : ""}`}>
      <label className="input-container__label" htmlFor={inputId}>
        {label}
      </label>
      <span className={`input-container__wrapper ${error ? "input-container__wrapper--error" : ""}`}>
        <input {...rest} pattern={pattern} name={name} required={required} type={type} id={inputId} />
        {isPassword && <EyeIcon open={!isPasswordType} onClick={() => setIsPasswordType(!isPasswordType)} />}
      </span>
      {error && <span className="input-container__error">{error}</span>}
    </div>
  );
}
