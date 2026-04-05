"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/db/supabase-browser";
import { useRouter } from "next/navigation";

export function useAuth() {
      const supabase = createClient();
      const router = useRouter();

      const [userEmail, setUserEmail] = useState<string | null>(null);
      const [userName, setUserName] = useState<string | null>(null);
      const [userCreated, setUserCreated] = useState<string | null>(null);

      useEffect(() => {
            supabase.auth.getUser().then(({ data: { user } }) => {
                  setUserEmail(user?.email ?? null);
                  setUserCreated(user?.created_at ?? null);
                  setUserName(user?.user_metadata?.full_name ?? null);
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const handleLogout = async () => {
            await supabase.auth.signOut();
            router.push("/login");
      };

      return { userEmail, userName, userCreated, handleLogout };
}
