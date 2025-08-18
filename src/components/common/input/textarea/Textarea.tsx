import "../style.scss";
import "./styles.scss";

interface TextareaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder?: string;
  value?: string;
  error?: string;
  name?: string;
  required?: boolean;
  variant?: "primary" | "secondary";
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({ required, error, label, name, variant = "primary", ...props }: TextareaProps) {
  const { id, className = "", ...rest } = props;
  const textareaId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className={`input-container input-container-${variant} ${className} ${
        error ? `input-container--error input-container-${variant}--error` : ""
      }`}
    >
      <label className="input-container__label" htmlFor={textareaId}>
        {label}
      </label>
      <span className={`input-container__wrapper ${error ? "input-container__wrapper--error" : ""}`}>
        <textarea {...rest} name={name} required={required} id={textareaId} placeholder={props.placeholder} />
      </span>
      {error && <span className="input-container__error">{error}</span>}
    </div>
  );
}
