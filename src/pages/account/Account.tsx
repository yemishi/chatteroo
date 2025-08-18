import UserSettings from "./userSettings/UserSettings";
import "./styles.scss";
import { useAuth } from "@/hooks";

export default function Account() {
  const { user } = useAuth()!;
  return (
    <div className="account-page">
      <h1>Settings</h1>
      <UserSettings user={user!} />
    </div>
  );
}
