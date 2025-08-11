import "./style.scss";
import SearchIcon from "@/assets/icons/search.svg?react";
import UserOptions from "./userOptions/userOptions";
type Props = {
  search: string;
  onChangeSearch: (search: string) => void;
};
export default function HomeHeader({ onChangeSearch, search }: Props) {
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
      <div className="home-header__top">
        <h1>{greeting}</h1>
        <div>
          <UserOptions />
        </div>
      </div>

      <div className="header-input__container primary-input">
        <SearchIcon className="header-input__icon" />
        <input
          placeholder="Search a chat"
          type="text"
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
        />
      </div>
    </header>
  );
}
