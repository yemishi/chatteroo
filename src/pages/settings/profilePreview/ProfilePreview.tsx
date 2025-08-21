import "./styles.scss";
import { Header } from "@/components";
import type { User } from "@/types";
export default function ProfilePreview({ user }: { user: User }) {
  return (
    <div className="profile-preview">
      <Header title="Settings" />
      <div className="profile-preview__info">
        <img className="profile-preview__avatar" src={user.picture} alt={`${user.username} picture`} />
        <div className="profile-preview__details">
          <div className="profile-preview__main">
            <p className="profile-preview__username">{user.username}</p>
            <p className="profile-preview__tag">{user.tag}</p>
          </div>
          <p className="profile-preview__email">{user.email}</p>
          {user.guestCode && <p className="profile-preview__guest-code">{user.guestCode}</p>}
        </div>
      </div>
    </div>
  );
}
