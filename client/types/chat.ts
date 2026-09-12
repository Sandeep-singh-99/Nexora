export type GenerativeUIResponse = {
  type: string;
  props: Record<string, unknown>;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string | Date;
  ui?: GenerativeUIResponse;
  thinkingTime?: string;
  toolsUsed?: string[];
};

export type ConversationSession = {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
  model: string;
  category: "Today" | "Yesterday" | "Previous 7 Days";
};

export type AIModelOption = {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  description: string;
  icon?: string;
};
