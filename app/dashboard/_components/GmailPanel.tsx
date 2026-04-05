"use client";

import { memo } from "react";
import GmailConnectedView from "./gmail/GmailConnectedView";
import GmailDisconnectedView from "./gmail/GmailDisconnectedView";

interface GmailPanelProps {
      gmailUser: string;
      gmailPassword: string;
      onGmailUserChange: (v: string) => void;
      onGmailPasswordChange: (v: string) => void;
      onSave: (e: React.FormEvent) => void;
      saving: boolean;
      message: string | null;
}

function GmailPanel({
      gmailUser,
      gmailPassword,
      onGmailUserChange,
      onGmailPasswordChange,
      onSave,
      saving,
      message,
}: GmailPanelProps) {
      if (gmailUser && gmailPassword) {
            return (
                  <GmailConnectedView
                        gmailUser={gmailUser}
                        onGmailUserChange={onGmailUserChange}
                        onGmailPasswordChange={onGmailPasswordChange}
                  />
            );
      }

      return (
            <GmailDisconnectedView
                  gmailUser={gmailUser}
                  gmailPassword={gmailPassword}
                  onGmailUserChange={onGmailUserChange}
                  onGmailPasswordChange={onGmailPasswordChange}
                  onSave={onSave}
                  saving={saving}
                  message={message}
            />
      );
}

export default memo(GmailPanel);
