import axios, { AxiosInstance } from 'axios';
import { BaseLLMProvider } from './BaseLLMProvider';
import { AIMessage, AIResponse, LLMConfig } from '../types';

export class AnthropicProvider extends BaseLLMProvider {
  name = 'anthropic';
  private client: AxiosInstance;

  constructor(apiKey: string, baseUrl?: string) {
    super();
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.client = axios.create({
      baseURL: baseUrl || 'https://api.anthropic.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 120000,
    });
  }

  private formatMessagesForAnthropic(messages: AIMessage[]): { system?: string; messages: any[] } {
    let system: string | undefined;
    const formattedMessages: any[] = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        system = msg.content;
      } else {
        formattedMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    return { system, messages: formattedMessages };
  }

  async chat(messages: AIMessage[], llmConfig: LLMConfig): Promise<AIResponse> {
    try {
      const { system, messages: formattedMessages } = this.formatMessagesForAnthropic(messages);
      
      const requestBody: any = {
        model: llmConfig.model || 'claude-3-5-sonnet-20241022',
        messages: formattedMessages,
        max_tokens: llmConfig.maxTokens || 2048,
        temperature: llmConfig.temperature || 0.7,
        top_p: llmConfig.topP || 1,
      };

      if (system) {
        requestBody.system = system;
      }

      const response = await this.client.post('/messages', requestBody);

      const content = response.data.content
        .map((block: any) => block.text)
        .join('');

      return {
        content,
        model: response.data.model,
        usage: {
          promptTokens: response.data.usage.input_tokens,
          completionTokens: response.data.usage.output_tokens,
          totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
        },
      };
    } catch (error: any) {
      this.handleError(error, 'Anthropic');
    }
  }

  async streamChat(
    messages: AIMessage[],
    llmConfig: LLMConfig,
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    try {
      const { system, messages: formattedMessages } = this.formatMessagesForAnthropic(messages);
      
      const requestBody: any = {
        model: llmConfig.model || 'claude-3-5-sonnet-20241022',
        messages: formattedMessages,
        max_tokens: llmConfig.maxTokens || 2048,
        temperature: llmConfig.temperature || 0.7,
        top_p: llmConfig.topP || 1,
        stream: true,
      };

      if (system) {
        requestBody.system = system;
      }

      const response = await this.client.post('/messages', requestBody, {
        responseType: 'stream',
      });

      let fullContent = '';
      let modelName = '';

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'content_block_delta') {
                  const text = parsed.delta?.text || '';
                  if (text) {
                    fullContent += text;
                    onChunk(text);
                  }
                }
                
                if (parsed.type === 'message_start') {
                  modelName = parsed.message?.model || '';
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
            model: modelName,
          });
        });

        response.data.on('error', reject);
      });
    } catch (error: any) {
      this.handleError(error, 'Anthropic');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Anthropic doesn't have a simple health check endpoint
      // We'll consider it available if we can reach the API
      await this.client.post('/messages', {
        model: 'claude-3-5-sonnet-20241022',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      });
      return true;
    } catch (error: any) {
      // If it's an auth error, the API is available but key is wrong
      if (error.response?.status === 401) {
        return true;
      }
      console.warn('[Anthropic] Not available:', error.message);
      return false;
    }
  }
}
