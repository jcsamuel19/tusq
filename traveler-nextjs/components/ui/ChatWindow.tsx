'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'system' | 'user';
  timestamp: Date;
}

interface ChatWindowProps {
  phoneNumber: string;
  userId: string;
  firstName: string;
  onComplete?: () => void;
}

export default function ChatWindow({ phoneNumber, userId, firstName, onComplete }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to generate random delay between 1-5 seconds (inclusive)
  const getRandomSystemDelay = (): number => {
    return Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000; // 1000ms to 5000ms
  };

  // Helper function to add system message with random delay
  const addSystemMessageWithDelay = (text: string, baseId?: string, onComplete?: () => void) => {
    const delay = getRandomSystemDelay();
    setTimeout(() => {
      const systemMessage: Message = {
        id: baseId || (Date.now() + Math.random()).toString(),
        text: text,
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
      // Call onComplete callback if provided (to set isLoading to false)
      if (onComplete) {
        onComplete();
      }
    }, delay);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Prevent duplicate initialization
    if (initializedRef.current) return;
    
    // Initialize conversation and get welcome message
    const initializeConversation = async () => {
      // Mark as initialized immediately to prevent duplicate runs
      initializedRef.current = true;
      
      try {
        const response = await fetch('/api/conversation/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            phoneNumber,
            firstName,
            message: '__INIT__', // Special message to initialize
          }),
        });

        const data = await response.json();
        
        if (data.welcomeMessages && Array.isArray(data.welcomeMessages)) {
          // Display messages sequentially with cumulative random delays (1-5 seconds each)
          // Show typing animation between each message
          let cumulativeDelay = 0;
          data.welcomeMessages.forEach((text: string, index: number) => {
            const messageDelay = getRandomSystemDelay(); // Random delay for this message
            cumulativeDelay += messageDelay;
            
            // Show typing animation before this message
            setTimeout(() => {
              setIsLoading(true);
            }, cumulativeDelay - messageDelay);
            
            // Hide typing animation and show message
            setTimeout(() => {
              setIsLoading(false);
              const newMessage: Message = {
                id: (Date.now() + index).toString(),
                text: text,
                sender: 'system',
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, newMessage]);
            }, cumulativeDelay);
          });
        } else if (data.welcomeMessage) {
          // Fallback for single message (backward compatibility)
          addSystemMessageWithDelay(data.welcomeMessage, Date.now().toString());
        }
      } catch (error) {
        console.error('Error initializing conversation:', error);
        // Fallback welcome messages
        const fallbackMessages = [
          `I heard you want a side quests ${firstName}??`,
          `I dont think your ready 😂`,
          `Where you at rn? `
        ];
        
        let cumulativeDelay = 0;
        fallbackMessages.forEach((text, index) => {
          const messageDelay = getRandomSystemDelay(); // Random delay for this message
          cumulativeDelay += messageDelay;
          
          // Show typing animation before this message
          setTimeout(() => {
            setIsLoading(true);
          }, cumulativeDelay - messageDelay);
          
          // Hide typing animation and show message
          setTimeout(() => {
            setIsLoading(false);
            const newMessage: Message = {
              id: (Date.now() + index).toString(),
              text: text,
              sender: 'system',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newMessage]);
          }, cumulativeDelay);
        });
      }
    };
    
    if (userId && phoneNumber && firstName) {
      initializeConversation();
    }
  }, [userId, phoneNumber, firstName]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to our API (in-app mode)
      const response = await fetch('/api/conversation/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phoneNumber,
          firstName,
          message: inputValue.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        // Check if this is a restart scenario with welcome messages
        if (data.welcomeMessages && Array.isArray(data.welcomeMessages)) {
          // First show the restart confirmation message
          addSystemMessageWithDelay(
            data.response,
            (Date.now() + 1).toString(),
            () => {
              // After restart confirmation, show welcome messages sequentially with typing animation
              let cumulativeDelay = 0;
              data.welcomeMessages.forEach((text: string, index: number) => {
                const messageDelay = getRandomSystemDelay();
                cumulativeDelay += messageDelay;
                
                // Show typing animation before this message
                setTimeout(() => {
                  setIsLoading(true);
                }, cumulativeDelay - messageDelay);
                
                // Hide typing animation and show message
                setTimeout(() => {
                  setIsLoading(false);
                  const newMessage: Message = {
                    id: (Date.now() + index + 1000).toString(),
                    text: text,
                    sender: 'system',
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, newMessage]);
                }, cumulativeDelay);
              });
            }
          );
        } else {
          // Regular response - add system message with random delay (1-5 seconds)
          // Keep isLoading true until message appears
          addSystemMessageWithDelay(
            data.response,
            (Date.now() + 1).toString(),
            () => {
              setIsLoading(false);
            }
          );
        }

        // Survey is complete - keep chat window open (no redirect)
        // onComplete callback removed to keep user on chat window
      } else {
        // Add error message with random delay (1-5 seconds)
        // Keep isLoading true until message appears
        addSystemMessageWithDelay(
          data.error || "I'm not really sure what you're saying. Could you try again?",
          (Date.now() + 1).toString(),
          () => {
            setIsLoading(false);
          }
        );
      }
    } catch (error) {
      // Add error message with random delay (1-5 seconds)
      // Keep isLoading true until message appears
      addSystemMessageWithDelay(
        'Sorry, something went wrong. Please try again.',
        (Date.now() + 1).toString(),
        () => {
          setIsLoading(false);
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      // Blur the textarea after sending
      textareaRef.current?.blur();
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-300 rounded-lg bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            T
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Weekend Event Finder</h3>
            <p className="text-sm text-gray-500">{phoneNumber}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

