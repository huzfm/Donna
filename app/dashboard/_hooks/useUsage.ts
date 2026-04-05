"use client";

import { useState, useCallback } from "react";

export interface UsageData {
      prompts_used: number;
      uploads_used: number;
      is_subscribed: boolean;
      dodo_subscription_id?: string | null;
      subscription_status?: string | null;
}

export function useUsage() {
      const [usage, setUsage] = useState<UsageData | null>(null);
      const [upgradeOpen, setUpgradeOpen] = useState(false);
      const [upgrading, setUpgrading] = useState(false);

      const fetchUsage = useCallback(async () => {
            const r = await fetch("/api/usage");
            const { usage: u } = await r.json();
            if (u) setUsage(u);
      }, []);

      const handleUpgrade = useCallback(async () => {
            setUpgrading(true);
            try {
                  const res = await fetch("/api/dodo/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.checkout_url) window.location.href = data.checkout_url;
            } catch {
                  alert("Could not start checkout. Please try again.");
            } finally {
                  setUpgrading(false);
            }
      }, []);

      return {
            usage,
            setUsage,
            upgradeOpen,
            setUpgradeOpen,
            upgrading,
            handleUpgrade,
            fetchUsage,
      };
}
