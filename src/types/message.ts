export type ChatMessage = {
  type: 'user' | 'agent' | 'system';
  text: string;
};
