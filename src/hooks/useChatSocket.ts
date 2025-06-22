import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/message";
import { config } from "@/config/config";
import { ChatStreamEvent } from "@/types/events";

export function useChatSocket(
  setMessages: (fn: (prev: ChatMessage[]) => ChatMessage[]) => void,
  setLoading: (loading: boolean) => void,
  sessionId: string | null,
  url: string = "",
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = new WebSocket(`${config.WS_URL}${url}/${sessionId}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data: ChatStreamEvent = JSON.parse(event.data);

      switch (data.type) {
        case "token":
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.type === "agent") {
              return [
                ...prev.slice(0, -1),
                { ...last, text: last.text + data.content },
              ];
            }
            return [...prev, { type: "agent", text: data.content }];
          });
          break;

        case "completion":
          setLoading(false);
          break;

        case "error":
          setMessages((prev) => [
            ...prev,
            { type: "system", text: data.content },
          ]);
          setLoading(false);
          break;

        case "tool_call":
          setMessages((prev) => [
            ...prev,
            {
              type: "system",
              text: `Calling tool: ${data.tool} with args: ${JSON.stringify(data.args)}`,
            },
          ]);
          break;

        case "end":
          break;
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
      setLoading(false);
    };

    socket.onclose = () => {
      setLoading(false);
    };

    return () => {
      socket.close();
    };
  }, [sessionId]);

  return socketRef;
}
