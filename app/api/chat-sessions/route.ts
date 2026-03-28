import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

/*
  Tables needed in Supabase (run this SQL in the Supabase SQL editor):

  -- Sessions table
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title      TEXT NOT NULL DEFAULT 'New Chat',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can read own sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Users can delete own sessions" ON chat_sessions FOR DELETE USING (auth.uid() = user_id);
*/

// GET – list all sessions for the user (newest first)
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [] });
}

// POST – create a new session
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json().catch(() => ({ title: "New Chat" }));

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id, title: title || "New Chat" })
    .select("id, title, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session: data });
}

// PATCH – update session title
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id, title } = await req.json();
  if (!session_id || !title)
    return NextResponse.json({ error: "session_id and title required" }, { status: 400 });

  const { error } = await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", session_id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE – delete a session (messages cascade via FK or we delete manually)
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id } = await req.json();
  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  // Delete messages first
  await supabase.from("chat_messages").delete().eq("session_id", session_id);

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", session_id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
