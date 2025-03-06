import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenRouterService {
  private readonly client: OpenAI;
  private static instance: OpenRouterService;

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "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";
    console.log(`Using API key: ${apiKey.substring(0, 10)}...`);
    
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vinscan-test.com', // Required for rankings
        'X-Title': 'VinScan App', // Required for rankings
        'Content-Type': 'application/json'
      },
    });
  }

  public static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      console.log('Sending request to OpenRouter API...');
      console.log('Messages:', JSON.stringify(messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' }))));
      
      const response = await this.client.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
      });

      console.log('Received response from OpenRouter API');
      console.log('Response:', JSON.stringify(response, null, 2));
      
      if (!response.choices || response.choices.length === 0) {
        console.error('No choices in response:', response);
        return "I'm having trouble processing your response right now. Could you please try again or provide more details?";
      }
      
      if (!response.choices[0]?.message?.content) {
        console.error('No content in response:', response.choices[0]);
        return "I'm having trouble processing your response right now. Could you please try again or provide more details?";
      }
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter service error:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check if it's an API error
        if ('status' in error) {
          console.error('API Status:', (error as any).status);
          console.error('API Response:', (error as any).response);
        }
      }
      
      // Return a more specific error message if possible
      if (error instanceof Error && error.message.includes('model')) {
        return "I apologize, but I'm having trouble connecting to the AI model. Please try again in a moment.";
      }
      
      return "I'm having trouble processing your response right now. Could you please try again or provide more details?";
    }
  }

  async searchWeb(query: string): Promise<string> {
    return this.chat([
      {
        role: 'user',
        content: query
      }
    ]);
  }
} 