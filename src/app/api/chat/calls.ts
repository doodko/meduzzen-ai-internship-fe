import { ChatSessionMeta } from "@/types/message";

export async function createChatSession(
  system_message: string,
): Promise<ChatSessionMeta> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system_message }),
  });

  if (!res.ok) throw new Error("Failed to create chat session");
  return res.json();
}
