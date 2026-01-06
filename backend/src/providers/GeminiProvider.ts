import axios, { AxiosInstance } from 'axios';
import { BaseLLMProvider } from './BaseLLMProvider';
import { AIMessage, AIResponse, LLMConfig } from '../types';

export class GeminiProvider extends BaseLLMProvider {
  name = 'gemini';
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    super();
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://generativelanguage.googleapis.com/v1beta';

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 120000,
    });
  }

  private formatMessagesForGemini(messages: AIMessage[]): any {
    // Gemini expects a different format
    const contents: any[] = [];
    let systemInstruction = '';

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    return { contents, systemInstruction };
  }

  async chat(messages: AIMessage[], llmConfig: LLMConfig): Promise<AIResponse> {
    try {
      const model = llmConfig.model || 'gemini-pro';
      const { contents, systemInstruction } = this.formatMessagesForGemini(messages);

      const requestBody: any = {
        contents,
        generationConfig: {
          temperature: llmConfig.temperature || 0.7,
          maxOutputTokens: llmConfig.maxTokens || 2048,
          topP: llmConfig.topP || 1,
        },
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await this.client.post(
        `/models/${model}:generateContent?key=${this.apiKey}`,
        requestBody
      );

      const candidate = response.data.candidates[0];
      const content = candidate.content.parts.map((part: any) => part.text).join('');

      return {
        content,
        model,
        usage: {
          promptTokens: response.data.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.data.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error: any) {
      this.handleError(error, 'Gemini');
    }
  }

  async streamChat(
    messages: AIMessage[],
    llmConfig: LLMConfig,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const model = llmConfig.model || 'gemini-pro';
      const { contents, systemInstruction } = this.formatMessagesForGemini(messages);

      const requestBody: any = {
        contents,
        generationConfig: {
          temperature: llmConfig.temperature || 0.7,
          maxOutputTokens: llmConfig.maxTokens || 2048,
          topP: llmConfig.topP || 1,
        },
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await this.client.post(
        `/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`,
        requestBody,
        {
          responseType: 'stream',
        }
      );

      let fullContent = '';

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              try {
                const parsed = JSON.parse(data);
                const candidate = parsed.candidates?.[0];
                if (candidate?.content?.parts) {
                  const text = candidate.content.parts
                    .map((part: any) => part.text)
                    .join('');
                  if (text) {
                    fullContent += text;
                    onChunk(text);
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        });

        response.data.on('end', () => {
          resolve({
            content: fullContent,
            model,
          });
        });

        response.data.on('error', reject);
      });
    } catch (error: any) {
      this.handleError(error, 'Gemini');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.get(`/models?key=${this.apiKey}`, { timeout: 5000 });
      return true;
    } catch (error) {
      console.warn('[Gemini] Not available:', (error as any).message);
      return false;
    }
  }
}
