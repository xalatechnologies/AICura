import { GenerateOptions, GenerateResponse, StreamResponse } from './types';
import { generateWithDeepseek } from './deepseek';

export async function generateText(options: GenerateOptions): Promise<GenerateResponse> {
  const text = await generateWithDeepseek(options.prompt, options.system);
  return { text };
}

export async function* streamText(options: GenerateOptions): AsyncGenerator<StreamResponse> {
  const text = await generateWithDeepseek(options.prompt, options.system);
  yield { text, done: false };
  yield { text: '', done: true };
}

export * from './types';
export * from './deepseek'; 