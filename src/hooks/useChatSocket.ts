import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/message';
import { ChatStreamEvent } from '@/types/events';

export function useChatSocket(
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>,
  setLoading: (val: boolean) => void,
  systemMessage: string | null
) {
  const socketRef = useRef<WebSocket | null>(null);
  const assistantMessageRef = useRef('');

  useEffect(() => {
    if (!systemMessage) return;

    const sessionId = Date.now().toString();
    const socket = new WebSocket(`ws://localhost:5000/api/chat/ws/${sessionId}`);
    socketRef.current = socket;
    assistantMessageRef.current = '';

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ type: 'system', content: systemMessage }));
    };

    socket.onmessage = (event) => {
      const parsed: ChatStreamEvent = JSON.parse(event.data);

      switch (parsed.type) {
        case 'token': {
          assistantMessageRef.current += parsed.content;
          setMessages((prev) => {
            const hasPending = prev[prev.length - 1]?.type === 'agent';
            if (hasPending) {
              const updated = [...prev];
              updated[updated.length - 1] = { type: 'agent', text: assistantMessageRef.current };
              return updated;
            } else {
              return [...prev, { type: 'agent', text: assistantMessageRef.current }];
            }
          });
          break;
        }

        case 'tool_call': {
          setMessages((prev) => [
            ...prev,
            {
              type: 'system',
              text: `Calling tool: ${parsed.tool} with args: ${JSON.stringify(parsed.args)}`,
            },
          ]);
          break;
        }

        case 'completion': {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { type: 'agent', text: parsed.final_response },
          ]);
          assistantMessageRef.current = '';
          setLoading(false);
          break;
        }

        case 'error': {
          setMessages((prev) => [...prev, { type: 'system', text: parsed.content }]);
          break;
        }

        default:
          console.warn('Unknown event type:', parsed);
      }
    };

    socket.onclose = () => console.log('WebSocket disconnected');

    return () => socket.close();
  }, [systemMessage, setMessages, setLoading]);

  return socketRef;
}
