import "./styles.scss";
import { Link, useRouterState } from "@tanstack/react-router";
import HomeIcon from "./assets/icons/chat.svg?react";
import UserIcon from "./assets/icons/profile.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import FriendRequestIcon from "@/assets/icons/user-add.svg?react";

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
        to="/requests"
        className={`nav-bar__button ${isActive("/requests") ? "nav-bar__button--active" : ""}`}
        aria-label="requests"
      >
        <FriendRequestIcon
          className={`nav-bar__icon ${isActive("/requests") ? "nav-bar__icon--active" : ""} nav-bar__icon--request `}
        />
        <p>Request</p>
      </Link>
      <Link
        to="/"
        className={`nav-bar__button ${isActive("/profile") ? "nav-bar__button--active" : ""} `}
        aria-label="profile"
      >
        <UserIcon
          className={`nav-bar__icon ${isActive("/profile") ? "nav-bar__icon--active" : ""}  nav-bar__icon--user`}
        />
        <p>Profile</p>
      </Link>
    </nav>
  );
}
