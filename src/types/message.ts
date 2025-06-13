export type ChatMessage = {
  type: "user" | "agent" | "system";
  text: string;
};

export interface ChatSessionMeta {
  session_id: string;
  system_message: string;
  created_at: string;
}
