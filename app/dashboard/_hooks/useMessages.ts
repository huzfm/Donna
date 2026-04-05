"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, timeNow, preprocessSlashCommand } from "../_components/types";

import type { UsageData } from "./useUsage";

interface UseMessagesOptions {
      activeSessionId: string | null;
      createNewSession: (title?: string) => Promise<string | null>;
      autoTitleSession: (id: string, msg: string) => void;
      setUpgradeOpen: (v: boolean) => void;
      setUsage: React.Dispatch<React.SetStateAction<UsageData | null>>;
}

export function useMessages({
      activeSessionId,
      createNewSession,
      autoTitleSession,
      setUpgradeOpen,
      setUsage,
}: UseMessagesOptions) {
      const [messages, setMessages] = useState<ChatMessage[]>([]);
      const [chatInput, setChatInput] = useState("");
      const [chatLoading, setChatLoading] = useState(false);
      const chatEndRef = useRef<HTMLDivElement>(null);
      const prevMsgCountRef = useRef(-1);
      const nextMsgId = useRef(1);
      const abortRef = useRef<AbortController | null>(null);

      const sessionCacheKey = (id: string) => `donna_msgs_${id}`;

      const writeMsgCache = useCallback((sessionId: string, msgs: ChatMessage[]) => {
            try {
                  sessionStorage.setItem(
                        sessionCacheKey(sessionId),
                        JSON.stringify(msgs.slice(-80))
                  );
            } catch {}
      }, []);

      const readMsgCache = useCallback((sessionId: string): ChatMessage[] | null => {
            try {
                  const raw = sessionStorage.getItem(sessionCacheKey(sessionId));
                  if (!raw) return null;
                  return JSON.parse(raw) as ChatMessage[];
            } catch {
                  return null;
            }
      }, []);

      const persistMessage = useCallback(
            (sessionId: string, role: "user" | "assistant", content: string, status?: string) => {
                  fetch("/api/chat-history", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                              session_id: sessionId,
                              role,
                              content,
                              status: status ?? "done",
                        }),
                  }).catch(() => {});
            },
            []
      );

      const loadSessionMessages = useCallback(
            async (sessionId: string) => {
                  const cached = readMsgCache(sessionId);
                  if (cached && cached.length > 0) {
                        setMessages(cached);
                        nextMsgId.current = Math.max(...cached.map((m) => m.id)) + 1;
                  }
                  try {
                        const res = await fetch(`/api/chat-history?session_id=${sessionId}`);
                        const { messages: msgs } = await res.json();
                        if (Array.isArray(msgs) && msgs.length > 0) {
                              const loaded: ChatMessage[] = msgs.map(
                                    (m: {
                                          id: number;
                                          role: "user" | "assistant";
                                          content: string;
                                          status?: string;
                                          created_at: string;
                                    }) => ({
                                          id: nextMsgId.current++,
                                          role: m.role,
                                          content: m.content,
                                          timestamp: new Date(m.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                          }),
                                          status: m.status as ChatMessage["status"],
                                    })
                              );
                              setMessages(loaded);
                              writeMsgCache(sessionId, loaded);
                        } else if (!cached) {
                              setMessages([]);
                        }
                  } catch {
                        if (!cached) setMessages([]);
                  }
            },
            [readMsgCache, writeMsgCache]
      );

      useEffect(() => {
            if (activeSessionId) {
                  prevMsgCountRef.current = -1;
                  loadSessionMessages(activeSessionId);
            }
      }, [activeSessionId, loadSessionMessages]);

      useEffect(() => {
            const prev = prevMsgCountRef.current;
            const curr = messages.length;
            prevMsgCountRef.current = curr;
            if (prev !== -1 && curr > prev) {
                  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
      }, [messages]);

      const stopGeneration = useCallback(() => {
            if (abortRef.current) {
                  abortRef.current.abort();
                  abortRef.current = null;
            }
            setChatLoading(false);
            const content = "Generation stopped.";
            setMessages((prev) => [
                  ...prev,
                  {
                        id: nextMsgId.current++,
                        role: "assistant",
                        content,
                        timestamp: timeNow(),
                        status: "cancelled",
                  },
            ]);
            if (activeSessionId) persistMessage(activeSessionId, "assistant", content, "cancelled");
      }, [persistMessage, activeSessionId]);

      const sendMessage = useCallback(
            async (overrideInput?: string) => {
                  const raw = (overrideInput ?? chatInput).trim();
                  if (!raw) return;
                  let sessionId = activeSessionId;
                  if (!sessionId) {
                        sessionId = await createNewSession(
                              raw.length > 38 ? raw.slice(0, 38) + "…" : raw
                        );
                        if (!sessionId) return;
                  }
                  const processed = preprocessSlashCommand(raw);
                  const isFirstMessage = messages.length === 0;
                  setMessages((prev) => {
                        const updated = [
                              ...prev,
                              {
                                    id: nextMsgId.current++,
                                    role: "user" as const,
                                    content: raw,
                                    timestamp: timeNow(),
                              },
                        ];
                        writeMsgCache(sessionId, updated);
                        return updated;
                  });
                  persistMessage(sessionId, "user", raw);
                  if (isFirstMessage) autoTitleSession(sessionId, raw);
                  setChatInput("");
                  setChatLoading(true);
                  const controller = new AbortController();
                  abortRef.current = controller;
                  try {
                        const history = messages
                              .filter((m) => m.status !== "cancelled")
                              .slice(-10)
                              .map((m) => ({ role: m.role, content: m.content }));

                        const res = await fetch("/api/query", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ question: processed, history }),
                              signal: controller.signal,
                        });
                        const data = await res.json();
                        if (res.status === 402 && data.error === "free_limit_reached") {
                              setChatLoading(false);
                              setUpgradeOpen(true);
                              return;
                        }
                        if (!res.ok) throw new Error(data.error || "Query failed");
                        setMessages((prev) => {
                              const updated = [
                                    ...prev,
                                    {
                                          id: nextMsgId.current++,
                                          role: "assistant" as const,
                                          content: data.answer,
                                          timestamp: timeNow(),
                                    },
                              ];
                              writeMsgCache(sessionId, updated);
                              return updated;
                        });
                        persistMessage(sessionId, "assistant", data.answer);
                        // Optimistically increment local counter so UI updates without a reload
                        setUsage((prev) =>
                              prev ? { ...prev, prompts_used: prev.prompts_used + 1 } : prev
                        );
                  } catch (err: unknown) {
                        if (err instanceof DOMException && err.name === "AbortError") return;
                        const m = err instanceof Error ? err.message : "Something went wrong";
                        const errContent = `Sorry, I hit an error: ${m}`;
                        setMessages((prev) => {
                              const updated = [
                                    ...prev,
                                    {
                                          id: nextMsgId.current++,
                                          role: "assistant" as const,
                                          content: errContent,
                                          timestamp: timeNow(),
                                    },
                              ];
                              writeMsgCache(sessionId, updated);
                              return updated;
                        });
                        persistMessage(sessionId, "assistant", errContent);
                  } finally {
                        abortRef.current = null;
                        setChatLoading(false);
                  }
            },
            [
                  chatInput,
                  persistMessage,
                  activeSessionId,
                  createNewSession,
                  autoTitleSession,
                  messages,
                  writeMsgCache,
                  setUpgradeOpen,
            ]
      );

      const clearChat = useCallback(() => {
            setMessages([]);
            if (activeSessionId) {
                  try {
                        sessionStorage.removeItem(sessionCacheKey(activeSessionId));
                  } catch {}
                  fetch("/api/chat-history", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ session_id: activeSessionId }),
                  }).catch(() => {});
            }
      }, [activeSessionId]);

      return {
            messages,
            chatInput,
            setChatInput,
            chatLoading,
            chatEndRef,
            prevMsgCountRef,
            sendMessage,
            clearChat,
            stopGeneration,
            loadSessionMessages,
      };
}
