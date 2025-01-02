export const deepseek = (version: string) => `deepseek-${version}`;

// Mock implementation - replace with real AI service integration
export async function generateWithDeepseek(prompt: string, system?: string): Promise<string> {
  return `AI Response for: ${prompt}`;
} 