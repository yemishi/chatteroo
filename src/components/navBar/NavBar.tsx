import "./styles.scss";
import { Link, useRouterState } from "@tanstack/react-router";
import HomeIcon from "./assets/icons/chat.svg?react";
import UserIcon from "./assets/icons/profile.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import NotificationIcon from "@/assets/icons/notification.svg?react";

export default function NavBar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path + "/") || pathname === path;
  };

  return (
    <nav className="nav-bar">
      <Link to="/" className={`nav-bar__button ${isActive("/") ? "nav-bar__button--active" : ""}`} aria-label="home">
        <HomeIcon className={`nav-bar__icon ${isActive("/") ? "nav-bar__icon--active" : ""}`} />
        <p>Chat</p>
      </Link>

      <Link
        to="/search"
        className={`nav-bar__button ${isActive("/search") ? "nav-bar__button--active" : ""}`}
        aria-label="search"
      >
        <SearchIcon className={`nav-bar__icon ${isActive("/search") ? "nav-bar__icon--active" : ""}`} />
        <p>Search</p>
      </Link>
      <Link
        to="/notifications"
        className={`nav-bar__button ${isActive("/notifications") ? "nav-bar__button--active" : ""}`}
        aria-label="notifications"
      >
        <NotificationIcon
          className={`nav-bar__icon ${isActive("/notifications") ? "nav-bar__icon--active" : ""} nav-bar__icon--test `}
        />
        <p>Bell</p>
      </Link>
      <Link
        to="/account"
        className={`nav-bar__button ${isActive("/account") ? "nav-bar__button--active" : ""} `}
        aria-label="profile"
      >
        <UserIcon
          className={`nav-bar__icon ${isActive("/account") ? "nav-bar__icon--active" : ""}  nav-bar__icon--user`}
        />
        <p>Profile</p>
      </Link>
    </nav>
  );
}
