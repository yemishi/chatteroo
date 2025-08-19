import Back from "../goBack/Back";
import "./styles.scss";
export default function Header({ title }: { title: string }) {
  return (
    <header className="generic-header">
      <Back />
      <h1>{title}</h1>
    </header>
  );
}
