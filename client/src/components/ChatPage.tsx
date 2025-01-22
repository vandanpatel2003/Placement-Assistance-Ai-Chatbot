import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import { Card } from "./ui/card";
import { useAuth } from '../context/AuthContext';
import { generateResponse } from '../services/gemini';
import Logo from '../assets/logo.png'
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollArea = scrollAreaRef.current;
            scrollArea.scrollTop = scrollArea.scrollHeight; // Scroll to the bottom
        }
    };

    useEffect(() => {
        scrollToBottom(); // Auto-scroll whenever messages change
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await generateResponse(userMessage);
            setMessages(prev => [...prev, { role: 'model', content: response }]);
        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [...prev, {
                role: 'model',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="flex justify-between items-center">
                    <div className={' px-2 w-[250px]'}>
                        <img src={Logo} alt={'parul logo'}/>
                    </div>
                    <Button onClick={handleLogout} variant="outline">
                        Logout
                    </Button>
                </div>
            </div>
            <div className="flex-1 p-4 flex flex-col">
            <Card className="flex-1 flex flex-col bg-white bg-hero-pattern bg-no-repeat bg-center">
                    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">

                        <div className="space-y-2"> {/* Adjusted space between messages */}
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-2.5 ${
                                        message.role === 'model' ? 'flex-row' : 'flex-row-reverse'
                                    }`}
                                >
                                    <Avatar className={`w-8 h-8 ${
                                        message.role === 'model' ? 'bg-blue-500' : 'bg-green-500'
                                    }`}>
                                        <span className="text-white text-sm">
                                            {message.role === 'model' ? 'AI' : 'You'}
                                        </span>
                                    </Avatar>
                                    <div
                                        className={`flex flex-col w-auto max-w-[75%] p-2 border ${
                                            message.role === 'model'
                                                ? 'bg-white-100 rounded-e-xl rounded-es-xl'
                                                : 'bg-blue-500 text-white rounded-s-xl rounded-ee-xl'
                                        }`}
                                        style={{
                                            display: 'inline-block', // Auto adjust height based on content
                                            maxWidth: '100%', // Allow container to grow to a maximum width
                                            overflowWrap: 'break-word', // Wrap long words to prevent overflow
                                        }}
                                    >
                                        {/* Use ReactMarkdown to render the content */}
                                        <ReactMarkdown className="text-sm font-normal break-words">
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="animate-pulse">AI is typing...</div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !inputMessage.trim()}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
