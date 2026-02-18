import "./styles.scss";

type Props = {
  isTyping: boolean;
  withDesc?: boolean;
};
export default function TypingIndicator({ withDesc = false, isTyping }: Props) {
  return (
    <div className={`typing-indicator ${isTyping ? "show" : "hidden"}`}>
      {withDesc && <p>typing</p>}
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
