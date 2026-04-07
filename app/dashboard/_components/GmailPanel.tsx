"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import GmailConnectedView from "./gmail/GmailConnectedView";
import GmailDisconnectedView from "./gmail/GmailDisconnectedView";

function isLinked(email: string, appPassword: string) {
      return email.trim().length > 0 && appPassword.trim().length > 0;
}

function GmailPanel() {
      const [gmailUser, setGmailUser] = useState("");
      const [gmailPassword, setGmailPassword] = useState("");
      const [connected, setConnected] = useState(false);
      const [updateMode, setUpdateMode] = useState(false);
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [removing, setRemoving] = useState(false);
      const [message, setMessage] = useState<string | null>(null);

      const load = useCallback(async () => {
            try {
                  const res = await fetch("/api/settings", { cache: "no-store" });
                  if (!res.ok) return;
                  const json = (await res.json()) as {
                        settings: {
                              gmail_user?: string | null;
                              gmail_app_password?: string | null;
                        } | null;
                  };
                  const email = String(json.settings?.gmail_user ?? "").trim();
                  const pass = String(json.settings?.gmail_app_password ?? "").trim();
                  setGmailUser(email);
                  setGmailPassword(pass);
                  setConnected(isLinked(email, pass));
                  if (isLinked(email, pass)) setUpdateMode(false);
            } catch {
                  // ignore
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            load();
      }, [load]);

      async function handleSave(e: React.FormEvent) {
            e.preventDefault();
            const email = gmailUser.trim();
            const appPw = gmailPassword.replace(/\s+/g, "").trim();
            if (!email || !appPw) {
                  setMessage("error:Enter your Gmail address and app password.");
                  return;
            }
            setSaving(true);
            setMessage(null);
            try {
                  const res = await fetch("/api/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                              gmail_user: email,
                              gmail_app_password: appPw,
                        }),
                  });
                  const data = (await res.json()) as { error?: string };
                  if (!res.ok) throw new Error(data.error ?? "Failed to save");
                  await load();
                  setMessage("success:Gmail connected successfully.");
            } catch (err) {
                  setMessage(
                        `error:${err instanceof Error ? err.message : "Something went wrong"}`
                  );
            } finally {
                  setSaving(false);
            }
      }

      async function handleRemove() {
            if (
                  typeof window !== "undefined" &&
                  !window.confirm(
                        "Remove Gmail from this account? Donna will no longer be able to read your inbox until you connect again."
                  )
            ) {
                  return;
            }
            setRemoving(true);
            setMessage(null);
            try {
                  const res = await fetch("/api/settings", { method: "DELETE" });
                  const data = (await res.json()) as { error?: string };
                  if (!res.ok) throw new Error(data.error ?? "Failed to remove");
                  setGmailUser("");
                  setGmailPassword("");
                  setConnected(false);
                  setUpdateMode(false);
                  setMessage("success:Gmail disconnected.");
                  await load();
            } catch (err) {
                  setMessage(
                        `error:${err instanceof Error ? err.message : "Something went wrong"}`
                  );
            } finally {
                  setRemoving(false);
            }
      }

      function handleChangeCredentials() {
            setConnected(false);
            setUpdateMode(true);
            setGmailPassword("");
            setMessage(null);
      }

      if (loading) {
            return (
                  <div className="flex flex-1 items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-slate-400" />
                  </div>
            );
      }

      if (connected) {
            return (
                  <GmailConnectedView
                        gmailUser={gmailUser}
                        onGmailUserChange={setGmailUser}
                        onGmailPasswordChange={setGmailPassword}
                        onRemoveGmail={handleRemove}
                        onChangeGmail={handleChangeCredentials}
                        removing={removing}
                        message={message}
                  />
            );
      }

      return (
            <GmailDisconnectedView
                  gmailUser={gmailUser}
                  gmailPassword={gmailPassword}
                  onGmailUserChange={setGmailUser}
                  onGmailPasswordChange={setGmailPassword}
                  onSave={handleSave}
                  saving={saving}
                  removing={removing}
                  updateMode={updateMode}
                  message={message}
            />
      );
}

export default memo(GmailPanel);
