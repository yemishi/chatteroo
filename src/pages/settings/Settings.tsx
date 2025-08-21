import { Outlet, useLocation } from "@tanstack/react-router";
import "./styles.scss";
import { useAuth } from "@/hooks";
import SettingsCardGrid from "./settingsCardGrid/SettingsCardGrid";
import { Button } from "@/components";
import ProfilePreview from "./profilePreview/ProfilePreview";
import { useState } from "react";
import DeleteAccount from "./deleteAccount/DeleteAccount";

export default function Settings() {
  const { logout, user } = useAuth();
  const match = useLocation().pathname === "/settings";

  return (
    <div className="settings-page">
      {match && (
        <>
          <ProfilePreview user={user!} />
          <main>
            <SettingsCardGrid user={user!} />
          </main>
          <Button variant="danger" className="settings-page__logout" onClick={logout}>
            Log out
          </Button>
        </>
      )}

      <Outlet />
    </div>
  );
}
