import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Clock,
  Cpu,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  metadata?: {
    model?: string;
    responseTime?: number;
    tokensUsed?: number;
  };
}

interface AIServiceResponse {
  response: string;
  metadata: {
    model: string;
    responseTime: number;
    tokensUsed: number;
    timestamp: string;
  };
}

const AI_SERVICE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : '';

const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user?.name}! I'm your AI assistant for ToggleLab. I can help you optimize experiments, analyze metrics, and suggest improvements. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date(),
      metadata: {
        model: 'AI Assistant',
        responseTime: 0,
        tokensUsed: 0
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState('Connecting...');
  const [serviceStatus, setServiceStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);

  // Check AI service health on component mount
  useEffect(() => {
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    try {
      const healthUrl = process.env.NODE_ENV === 'development'
        ? `${AI_SERVICE_URL}/health`
        : '/api/health';

      console.log('🔍 Checking AI service health at:', healthUrl);
      const response = await fetch(healthUrl);
      const data = await response.json();

      if (data.status === 'healthy') {
        setServiceStatus('connected');
        setCurrentModel('AI Assistant');
        setError(null);
      } else {
        setServiceStatus('error');
        setError('AI service is not healthy');
      }
    } catch (error) {
      console.error('AI service health check failed:', error);
      setServiceStatus('error');
      const errorMessage = process.env.NODE_ENV === 'development'
        ? 'AI service is not available. Please ensure the backend server is running on port 3001.'
        : 'AI service is not available. Please check your environment configuration.';
      setError(errorMessage);
    }
  };

  const callAIService = async (message: string): Promise<AIServiceResponse> => {
    // Create user context for LaunchDarkly
    const userContext = {
      key: user?.id || 'anonymous',
      name: user?.name || 'Anonymous User',
      email: user?.email || 'anonymous@togglelab.com',
      role: user?.role || 'standard-user'
    };

    const chatUrl = process.env.NODE_ENV === 'development'
      ? `${AI_SERVICE_URL}/api/ai-chat`
      : '/api/ai-chat';

    console.log('🤖 Sending AI chat request to:', chatUrl);
    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userContext
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponse = await callAIService(userMessage.text);

      // Update current model from response
      setCurrentModel(aiResponse.metadata.model);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        sender: 'ai',
        timestamp: new Date(),
        metadata: aiResponse.metadata
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update service status to connected since we got a successful response
      if (serviceStatus !== 'connected') {
        setServiceStatus('connected');
      }

    } catch (error) {
      console.error('AI service error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setServiceStatus('error');

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I'm having trouble connecting to the AI service. ${error instanceof Error ? error.message : 'Please try again later.'}`,
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          model: 'Error',
          responseTime: 0,
          tokensUsed: 0
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    switch (serviceStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'error':
        return <WifiOff className="h-3 w-3 text-red-500" />;
      default:
        return <Sparkles className="h-3 w-3 animate-spin text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (serviceStatus) {
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <Card className="border-purple-500/50 bg-purple-500/5 max-w-2xl w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-purple-700">
          <Bot className="mr-2 h-5 w-5" />
          AI Assistant
          <Badge className="ml-2 bg-purple-100 text-purple-700">Beta</Badge>
          <div className={`ml-auto flex items-center text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            <Cpu className="mx-1 h-3 w-3" />
            {currentModel}
          </div>
        </CardTitle>
        {error && (
          <div className="flex items-center text-xs text-red-600 mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto space-y-3 bg-white rounded-lg p-3 border">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-purple-500 text-white'
                  }`}
                >
                  {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <div
                  className={`rounded-lg p-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <div className={`text-xs mt-1 flex items-center justify-between ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(message.timestamp)}
                    </div>
                    {message.metadata && message.sender === 'ai' && (
                      <div className="text-xs">
                        {message.metadata.responseTime && message.metadata.responseTime > 0 && (
                          <span>{message.metadata.responseTime}ms</span>
                        )}
                        {message.metadata.tokensUsed && message.metadata.tokensUsed > 0 && (
                          <span className="ml-2">{message.metadata.tokensUsed} tokens</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="bg-gray-100 rounded-lg p-2 text-sm text-gray-800">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about experiments, metrics, or performance..."
            className="flex-1"
            disabled={isTyping || serviceStatus === 'error'}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || serviceStatus === 'error'}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Service Status */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span>
              {serviceStatus === 'connected' ? 'Connected to AI Service' :
               serviceStatus === 'error' ? 'Service Unavailable' : 'Connecting...'}
            </span>
          </div>
          {serviceStatus === 'error' && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs"
              onClick={checkServiceHealth}
            >
              Retry
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1">
          {['How to optimize experiments?', 'Check performance metrics', 'Team productivity tips'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs h-6"
              onClick={() => setInputValue(suggestion)}
              disabled={isTyping || serviceStatus === 'error'}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatbot;