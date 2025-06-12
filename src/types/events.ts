export type EventType =
  | 'token'
  | 'tool_call'
  | 'tool_result'
  | 'tool_error'
  | 'completion'
  | 'error'
  | 'end';

export interface TokenEvent {
  type: 'token';
  content: string;
}

export interface ToolCallEvent {
  type: 'tool_call';
  tool: string;
  args: Record<string, never>;
  status: 'starting';
}

export interface ToolResultEvent {
  type: 'tool_result';
  result: string;
  status: 'completed';
}

export interface ToolErrorEvent {
  type: 'tool_error';
  error: string;
}

export interface CompletionEvent {
  type: 'completion';
  final_response: string;
}

export interface EndEvent {
  type: 'end';
  message: string;
}

export interface ErrorEvent {
  type: 'error';
  content: string;
}

export type ChatStreamEvent =
  | TokenEvent
  | ToolCallEvent
  | ToolResultEvent
  | ToolErrorEvent
  | CompletionEvent
  | EndEvent
  | ErrorEvent;
