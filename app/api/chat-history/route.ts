import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

/*
  Updated table needed in Supabase (run this SQL):

  -- Drop old table if it exists and recreate with session_id
  DROP TABLE IF EXISTS chat_messages;

  CREATE TABLE chat_messages (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content    TEXT NOT NULL,
    status     TEXT DEFAULT 'done',
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can read own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can delete own messages" ON chat_messages FOR DELETE USING (auth.uid() = user_id);
*/

// GET  load messages for a session (pass ?session_id=xxx)
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, status, created_at")
    .eq("user_id", user.id)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

// POST  save a new message to a session
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id, role, content, status } = await req.json();
  if (!session_id || !role || !content)
    return NextResponse.json({ error: "session_id, role, and content required" }, { status: 400 });

  const { error } = await supabase
    .from("chat_messages")
    .insert({ user_id: user.id, session_id, role, content, status: status ?? "done" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update session's updated_at timestamp
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", session_id)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}

// DELETE  clear all messages in a session
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id } = await req.json();
  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", user.id)
    .eq("session_id", session_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
