import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  council?: {
    members: string[];
    consensus: string;
    reasoning: string[];
  };
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          language: language 
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        council: data.council,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: t('chat.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-islamic-gold/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-islamic-primary-green to-islamic-primary-gold flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-islamic-dark">{t('chat.welcome')}</h2>
              <p className="text-sm text-islamic-dark/70">{t('chat.welcome.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-islamic-dark/70">{t('status.online')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl px-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-islamic-primary-green to-islamic-primary-gold flex items-center justify-center mx-auto mb-6">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-islamic-dark mb-3">
                {t('chat.welcome')}
              </h3>
              <p className="text-islamic-dark/70 mb-8">
                {t('chat.welcome.subtitle')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="islamic-card p-4">
                  <div className="font-semibold text-islamic-dark mb-2">Multiple Perspectives</div>
                  <p className="text-islamic-dark/70">Get answers from different Islamic schools of thought</p>
                </div>
                <div className="islamic-card p-4">
                  <div className="font-semibold text-islamic-dark mb-2">Scholarly Sources</div>
                  <p className="text-islamic-dark/70">Responses based on authentic Islamic sources</p>
                </div>
                <div className="islamic-card p-4">
                  <div className="font-semibold text-islamic-dark mb-2">Contextual Answers</div>
                  <p className="text-islamic-dark/70">Detailed explanations with proper context</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-end space-x-3">
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-islamic-primary-green to-islamic-primary-gold flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-white text-islamic-dark border border-islamic-primary-green'
                        : 'bg-white border border-islamic-gold/30 text-islamic-dark'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    {message.council && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm font-medium mb-2">
                          <span className="text-islamic-dark">
                            Council Consensus
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-islamic-dark/70">
                            <strong>Members:</strong> {message.council.members.join(', ')}
                          </div>
                          <div className="text-islamic-dark/70">
                            <strong>Reasoning:</strong>
                          </div>
                          <ul className="list-disc list-inside text-islamic-dark/70 ml-2">
                            {message.council.reasoning.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-islamic-dark/60' : 'text-islamic-dark/60'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-islamic-gold/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-islamic-dark/70" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-islamic-primary-green to-islamic-primary-gold flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-islamic-gold/30 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-islamic-primary-green/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-islamic-primary-gold/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-islamic-primary-teal/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-islamic-dark/70">{t('chat.thinking')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/70 backdrop-blur-sm border-t border-islamic-gold/20 px-6 py-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="border-islamic-gold/30 focus:border-islamic-primary-green focus:ring-islamic-primary-green"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="bg-white text-islamic-dark border border-islamic-primary-green hover:border-islamic-primary-gold px-6"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-islamic-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-islamic-dark/60 mt-2 text-center">
          Powered by multi-agent AI council • Responses may vary across Islamic schools of thought
        </p>
      </div>
    </div>
  );
};
