"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { MessageSquare, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI coach. I can help you understand your mental health patterns, provide insights, and support your self-awareness journey. What would you like to explore today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "How has my mood been trending?",
    "What are my energy patterns?",
    "How can I reduce my burnout risk?",
    "What insights do you have about my data?",
  ];

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Mood-related responses
    if (lowerMessage.includes("mood")) {
      const recentMood = mockData.mood.slice(-7);
      const avgMood = Math.round(recentMood.reduce((sum, d) => sum + d.value, 0) / recentMood.length);
      return `Based on your recent data, your average mood over the past week is ${avgMood}/100. ${
        avgMood > 70
          ? "That's quite positive! You seem to be in a good place emotionally."
          : avgMood > 50
          ? "You're in a moderate range. This is normal and healthy."
          : "I notice your mood has been lower recently. This is common and nothing to be ashamed of. Consider what might be contributing, and remember that mood naturally fluctuates."
      }`;
    }

    // Energy-related responses
    if (lowerMessage.includes("energy")) {
      const recentEnergy = mockData.energy.slice(-7);
      const avgEnergy = Math.round(recentEnergy.reduce((sum, d) => sum + d.value, 0) / recentEnergy.length);
      return `Your average energy level over the past week is ${avgEnergy}/100. ${
        avgEnergy > 70
          ? "You have good energy levels! Consider using this energy for important tasks."
          : avgEnergy > 50
          ? "Your energy is in a moderate range. Make sure you're getting adequate rest."
          : "Your energy seems lower. This could be related to stress, sleep, or other factors. Prioritizing rest and recovery might help."
      }`;
    }

    // Burnout-related responses
    if (lowerMessage.includes("burnout")) {
      const currentBurnout = mockData.burnout[mockData.burnout.length - 1];
      return `Your current burnout risk is ${currentBurnout.risk}%. ${
        currentBurnout.risk < 50
          ? "That's manageable. Keep maintaining balance between work and rest."
          : currentBurnout.risk < 70
          ? "Your burnout risk is moderate. Consider setting clearer boundaries and scheduling regular breaks."
          : "Your burnout risk is high. It's important to prioritize rest, reduce commitments where possible, and consider seeking support."
      }`;
    }

    // Insights-related responses
    if (lowerMessage.includes("insight") || lowerMessage.includes("pattern")) {
      return `Based on your data, I notice a few patterns: Your mood tends to be relatively stable, which is a good sign of emotional regulation. Your energy levels follow natural circadian rhythms, with peaks in the morning. You've been consistent with tracking, which shows commitment to self-awareness. Remember, understanding yourself is a journey—be patient and kind with yourself.`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Based on your data, I can see you've been tracking your mental health consistently. That's a meaningful step toward self-awareness. Would you like to explore a specific aspect of your mental health, such as mood patterns, energy levels, or burnout risk?`;
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col pb-8" style={{ minHeight: "calc(100vh - 12rem)" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AI Coach</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Your intelligent companion for mental health insights</p>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 bg-card border border-border rounded-lg flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-4 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg transition-colors min-h-[44px]"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your mental health..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

