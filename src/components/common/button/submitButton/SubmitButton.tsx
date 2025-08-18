import "./styles.scss";

interface PropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingMessage?: string;
  rewardId?: string;
  successMessage?: string;
  children?: React.ReactNode;
}

export default function SubmitButton({
  rewardId,
  loadingMessage = "Submitting",
  children = "Submit",
  successMessage = "Submitted",
  isSuccess,
  isLoading,
  ...props
}: PropsType) {
  const letters = loadingMessage.split("");
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`submit-button ${className} ${isSuccess ? "submit-button--success" : ""} ${
        isLoading ? "submit-button--loading" : ""
      }`}
      disabled={isLoading}
    >
      {isSuccess ? (
        <span className="success-text">{successMessage}</span>
      ) : isLoading ? (
        <span className="loading-text">
          {letters.map((letter, index) => (
            <span key={index} className="loading-letter" style={{ animationDelay: `${index * 0.1}s` }}>
              {letter}
            </span>
          ))}
        </span>
      ) : (
        <span className="button-text">{children}</span>
      )}
    </button>
  );
}
