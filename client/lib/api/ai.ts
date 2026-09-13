import { api } from "./axios";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export const sendChatMessageApi = async (
  data: ChatRequest
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/ai/chat", data);
  return response.data;
};
