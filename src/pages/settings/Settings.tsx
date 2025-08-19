import UserSettings from "./profileSettings/ProfileSettings";
import "./styles.scss";
import { useAuth } from "@/hooks";

export default function Settings() {
  const { user } = useAuth()!;
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <UserSettings user={user!} />
    </div>
  );
}
