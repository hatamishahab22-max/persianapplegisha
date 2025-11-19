import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string; message: string}>>([
    { role: "assistant", message: "سلام! من دستیار هوشمند پرشین اپل استور هستم. چطور می‌تونم کمکتون کنم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", message: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت پاسخ');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: "assistant", 
        message: data.message 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        message: "متأسفانه در حال حاضر خطایی رخ داده است. لطفاً بعداً امتحان کنید." 
      }]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full h-14 w-14 p-0 shadow-lg"
        size="icon"
        data-testid="button-chatbot-open"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-96 h-[600px] shadow-xl flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">دستیار هوشمند پرشین اپل</h3>
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
          data-testid="button-chatbot-close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-muted rounded-lg px-4 py-2">
                <p className="text-sm">در حال تایپ...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            disabled={isLoading}
            className="flex-1"
            data-testid="input-chatbot-message"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            data-testid="button-chatbot-send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}