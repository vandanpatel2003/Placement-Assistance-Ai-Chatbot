import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateResponse(prompt: string) {
    try {
        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        // Define the initial chat history
        const initialHistory = [
            {
                role: "user",
                parts: [
                    { text: "System prompt: You are a highly experienced placement advisor for college students at Parul University. Provide advice on interview preparation, resume building, career paths, and how to excel in campus placements. You should only focus on topics related to placements and careers." },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "Namaste! As a placement advisor at Parul University, I'm here to guide you towards a successful career launch." },
                ],
            },
            {
                role: "user",
                parts: [{ text: prompt }], // Include the user's prompt as part of the conversation
            },
        ];

        // Start a chat session with the initial history
        const chatSession = model.startChat({
            generationConfig,
            history: initialHistory,
        });

        // Send the user's message and get the response
        const result = await chatSession.sendMessage(prompt);
        const response = result.response;

        return response.text(); // Return the response text
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error('Failed to generate response');
    }
}
