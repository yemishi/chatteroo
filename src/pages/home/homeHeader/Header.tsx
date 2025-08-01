import "./style.scss";
import type { User } from "@/types";

type Props = {
  user?: User;
  search: string;
  onChangeSearch: (search: string) => void;
};
export default function HomeHeader({ onChangeSearch, search, user }: Props) {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "evening";
  };
  const timeOfDay = getTimeOfDay();
  const emoji = {
    morning: "☀️",
    afternoon: "🌤️",
    evening: "🌙",
  }[timeOfDay];
  const greeting = `Good ${timeOfDay} ${emoji}`;

  return (
    <header className={`home-header ${timeOfDay}`}>
      <h1>{greeting}</h1>
      <div className="header-input__container">
        <input
          className="primary-input"
          placeholder="Search a chat"
          type="text"
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
        />
      </div>
    </header>
  );
}
