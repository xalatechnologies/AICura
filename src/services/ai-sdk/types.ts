export interface GenerateOptions {
  model: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateResponse {
  text: string;
}

export interface StreamResponse {
  text: string;
  done: boolean;
} 