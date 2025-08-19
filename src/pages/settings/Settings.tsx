import { Outlet, useLocation } from "@tanstack/react-router";
import "./styles.scss";
import { useAuth } from "@/hooks";
import SettingsCardGrid from "./settingsCardGrid/SettingsCardGrid";
import { Header } from "@/components";

export default function Settings() {
  const user = useAuth().user!;
  const match = useLocation().pathname === "/settings";

  return (
    <div className="settings-page">
      {match && (
        <>
          <Header title="Settings" />
          <SettingsCardGrid user={user} />
        </>
      )}
      <Outlet />
    </div>
  );
}
