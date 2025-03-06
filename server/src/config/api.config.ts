export const config = {
    openRouter: {
        apiKey: process.env.OPENROUTER_API_KEY || '',
        apiUrl: 'https://openrouter.ai/api/v1',
        baseUrl: 'https://openrouter.ai/api/v1',
        defaultModel: 'google/gemini-2.0-flash'
    },
    serper: {
        apiKey: process.env.SERPER_API_KEY || ''
    }
}; 