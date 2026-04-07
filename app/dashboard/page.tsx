"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { PanelLeft } from "lucide-react";
import dynamic from "next/dynamic";

import { TabId } from "./_components/types";
import ChatPanel from "./_components/ChatPanel";
import DashboardSidebar from "./_components/DashboardSidebar";
import UpgradeModal from "./_components/UpgradeModal";
import UploadToast from "./_components/UploadToast";
import { useAuth } from "./_hooks/useAuth";
import { useUsage } from "./_hooks/useUsage";
import { useSessions } from "./_hooks/useSessions";
import { useMessages } from "./_hooks/useMessages";
import { useUpload } from "./_hooks/useUpload";

const FilesPanel = dynamic(() => import("./_components/FilesPanel"), { ssr: false });
const GmailPanel = dynamic(() => import("./_components/GmailPanel"), { ssr: false });
const BillingPanel = dynamic(() => import("./_components/BillingPanel"), { ssr: false });

export default function DashboardPage() {
      const [activeTab, setActiveTab] = useState<TabId>("chat");
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [showAccountPopup, setShowAccountPopup] = useState(false);

      useEffect(() => {
            if (typeof window !== "undefined" && window.innerWidth >= 768) setSidebarOpen(true);
      }, []);

      const { userEmail, userName, userCreated, handleLogout } = useAuth();
      const { usage, setUsage, upgradeOpen, setUpgradeOpen, upgrading, handleUpgrade, fetchUsage } =
            useUsage();
      const {
            sessions,
            activeSessionId,
            setActiveSessionId,
            sessionsLoading,
            loadSessions,
            createNewSession,
            autoTitleSession,
            handleDeleteSession,
            groupedSessions,
            groupOrder,
      } = useSessions({ setActiveTab });
      const {
            messages,
            chatInput,
            setChatInput,
            chatLoading,
            chatEndRef,
            sendMessage,
            clearChat,
            stopGeneration,
            loadSessionMessages,
      } = useMessages({
            activeSessionId,
            createNewSession,
            autoTitleSession,
            setUpgradeOpen,
            setUsage,
      });
      const {
            savedFiles,
            filesLoading,
            uploading,
            uploadQueue,
            fileInputRef,
            loadFiles,
            handleUpload,
            handleDelete,
      } = useUpload({ setUsage, setUpgradeOpen });

      // Initial data load
      useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            if (params.get("upgraded") === "true") {
                  setUpgradeOpen(false);
                  window.history.replaceState({}, "", "/dashboard");
                  const subscriptionId = params.get("subscription_id");
                  if (subscriptionId) {
                        fetch("/api/dodo/activate", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ subscription_id: subscriptionId }),
                        }).then(() => fetchUsage());
                  } else {
                        fetchUsage();
                  }
            }
            loadSessions();
            loadFiles();
            fetchUsage();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const handleSelectSession = useCallback(
            async (sessionId: string) => {
                  setActiveSessionId(sessionId);
                  setActiveTab("chat");
                  await loadSessionMessages(sessionId);
            },
            [setActiveSessionId, loadSessionMessages]
      );

      const handleNewChat = useCallback(async () => {
            await createNewSession();
      }, [createNewSession]);

      return (
            <div className="relative flex h-screen overflow-hidden bg-slate-50/50 text-slate-900">
                  <div className="pointer-events-none absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-slate-50 via-white to-white" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[3rem_3rem]" />
                  </div>

                  <DashboardSidebar
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        sessions={sessions}
                        sessionsLoading={sessionsLoading}
                        activeSessionId={activeSessionId}
                        groupedSessions={groupedSessions}
                        groupOrder={groupOrder}
                        userEmail={userEmail}
                        userName={userName}
                        userCreated={userCreated}
                        usage={usage}
                        showAccountPopup={showAccountPopup}
                        setShowAccountPopup={setShowAccountPopup}
                        onNewChat={handleNewChat}
                        onSelectSession={handleSelectSession}
                        onDeleteSession={handleDeleteSession}
                        onLogout={handleLogout}
                        onOpenUpgrade={() => setUpgradeOpen(true)}
                  />

                  {!sidebarOpen && (
                        <button
                              type="button"
                              onClick={() => setSidebarOpen(true)}
                              className="absolute top-3.5 left-3.5 z-30 rounded-xl border border-slate-200/80 bg-white/90 p-2 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                              aria-label="Open sidebar"
                        >
                              <PanelLeft size={17} />
                        </button>
                  )}

                  <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center p-0 sm:p-2 md:p-4">
                        <main className="relative z-10 flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none border-0 border-slate-200 bg-white shadow-none sm:rounded-2xl sm:border sm:shadow-xl md:max-h-212.5">
                              <div className="chat-mesh pointer-events-none absolute inset-0" />
                              <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
                                    <AnimatePresence mode="wait">
                                          {activeTab === "chat" && (
                                                <ChatPanel
                                                      key="chat"
                                                      messages={messages}
                                                      input={chatInput}
                                                      onInputChange={setChatInput}
                                                      onSend={sendMessage}
                                                      onStop={stopGeneration}
                                                      onClear={clearChat}
                                                      loading={chatLoading}
                                                      chatEndRef={chatEndRef}
                                                      fileInputRef={fileInputRef}
                                                      onFileSelect={(e) => {
                                                            if (e.target.files)
                                                                  Array.from(
                                                                        e.target.files
                                                                  ).forEach(handleUpload);
                                                            e.target.value = "";
                                                      }}
                                                      fileCount={savedFiles.length}
                                                      usage={usage}
                                                      onUpgrade={() => setUpgradeOpen(true)}
                                                      uploadQueue={uploadQueue}
                                                />
                                          )}
                                          {activeTab === "files" && (
                                                <FilesPanel
                                                      key="files"
                                                      files={savedFiles}
                                                      filesLoading={filesLoading}
                                                      uploadQueue={uploadQueue}
                                                      onUpload={handleUpload}
                                                      onDelete={handleDelete}
                                                />
                                          )}
                                          {activeTab === "gmail" && <GmailPanel key="gmail" />}
                                          {activeTab === "billing" && (
                                                <BillingPanel
                                                      key="billing"
                                                      usage={usage}
                                                      userEmail={userEmail}
                                                      onUpgrade={() => setUpgradeOpen(true)}
                                                      onRefreshUsage={fetchUsage}
                                                />
                                          )}
                                    </AnimatePresence>
                              </div>
                        </main>
                  </div>

                  <UpgradeModal
                        open={upgradeOpen}
                        upgrading={upgrading}
                        onClose={() => setUpgradeOpen(false)}
                        onUpgrade={handleUpgrade}
                  />
                  <UploadToast
                        queue={uploadQueue}
                        onDismiss={(id) => {
                              /* auto-dismissed by timeout */ void id;
                        }}
                  />
            </div>
      );
}
