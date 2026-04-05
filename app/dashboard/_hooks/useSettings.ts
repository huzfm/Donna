"use client";

import { useState, useCallback } from "react";

export function useSettings() {
      const [gmailUser, setGmailUser] = useState("");
      const [gmailPassword, setGmailPassword] = useState("");
      const [settingsSaving, setSettingsSaving] = useState(false);
      const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

      const loadSettings = useCallback(async () => {
            try {
                  const r = await fetch("/api/settings");
                  const { settings } = await r.json();
                  if (settings) {
                        setGmailUser(settings.gmail_user ?? "");
                        setGmailPassword(settings.gmail_app_password ?? "");
                  }
            } catch {}
      }, []);

      const handleSaveSettings = useCallback(
            async (e: React.FormEvent) => {
                  e.preventDefault();
                  setSettingsSaving(true);
                  setSettingsMsg(null);
                  try {
                        const res = await fetch("/api/settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                    gmail_user: gmailUser,
                                    gmail_app_password: gmailPassword,
                              }),
                        });
                        const data = await res.json();
                        setSettingsMsg(
                              res.ok ? "success:Settings saved successfully" : `error:${data.error}`
                        );
                  } catch {
                        setSettingsMsg("error:Failed to save settings");
                  } finally {
                        setSettingsSaving(false);
                  }
            },
            [gmailUser, gmailPassword]
      );

      return {
            gmailUser,
            setGmailUser,
            gmailPassword,
            setGmailPassword,
            settingsSaving,
            settingsMsg,
            loadSettings,
            handleSaveSettings,
      };
}
