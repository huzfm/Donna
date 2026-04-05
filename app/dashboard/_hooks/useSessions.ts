"use client";

import { useState, useCallback } from "react";
import { ChatSession } from "../_components/types";
import type { TabId } from "../_components/types";

export function useSessions({ setActiveTab }: { setActiveTab: (t: TabId) => void }) {
      const [sessions, setSessions] = useState<ChatSession[]>([]);
      const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
      const [sessionsLoading, setSessionsLoading] = useState(true);

      const loadSessions = useCallback(async () => {
            try {
                  const r = await fetch("/api/chat-sessions");
                  const { sessions: s } = await r.json();
                  if (Array.isArray(s) && s.length > 0) {
                        setSessions(s);
                        setActiveSessionId(s[0].id);
                  }
            } finally {
                  setSessionsLoading(false);
            }
      }, []);

      const createNewSession = useCallback(
            async (title?: string): Promise<string | null> => {
                  try {
                        const res = await fetch("/api/chat-sessions", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ title: title || "New Chat" }),
                        });
                        const { session } = await res.json();
                        if (session) {
                              setSessions((prev) => [session, ...prev]);
                              setActiveSessionId(session.id);
                              setActiveTab("chat");
                              return session.id as string;
                        }
                  } catch {}
                  return null;
            },
            [setActiveTab]
      );

      const autoTitleSession = useCallback((sessionId: string, firstMessage: string) => {
            const title = firstMessage.length > 38 ? firstMessage.slice(0, 38) + "…" : firstMessage;
            fetch("/api/chat-sessions", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ session_id: sessionId, title }),
            }).catch(() => {});
            setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)));
      }, []);

      const handleDeleteSession = useCallback(
            async (sessionId: string) => {
                  try {
                        await fetch("/api/chat-sessions", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ session_id: sessionId }),
                        });
                        setSessions((prev) => {
                              const updated = prev.filter((s) => s.id !== sessionId);
                              if (activeSessionId === sessionId) {
                                    setActiveSessionId(updated.length > 0 ? updated[0].id : null);
                              }
                              return updated;
                        });
                  } catch {}
            },
            [activeSessionId]
      );

      const groupedSessions = sessions.reduce<Record<string, ChatSession[]>>((acc, s) => {
            const d = new Date(s.updated_at);
            const diff = Date.now() - d.getTime();
            const group =
                  diff < 86400000
                        ? "Today"
                        : diff < 172800000
                          ? "Yesterday"
                          : diff < 604800000
                            ? "This week"
                            : "Older";
            return { ...acc, [group]: [...(acc[group] ?? []), s] };
      }, {});

      const groupOrder = ["Today", "Yesterday", "This week", "Older"];

      return {
            sessions,
            setSessions,
            activeSessionId,
            setActiveSessionId,
            sessionsLoading,
            loadSessions,
            createNewSession,
            autoTitleSession,
            handleDeleteSession,
            groupedSessions,
            groupOrder,
      };
}
