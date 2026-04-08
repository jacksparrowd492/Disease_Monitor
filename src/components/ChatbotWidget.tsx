import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ChatbotWidgetProps {
  onClose: () => void;
}

const PRESET_RESPONSES: Record<string, string> = {
  "spread": "Based on current data, the disease is spreading fastest in metropolitan areas like Chennai, Mumbai, and Delhi. The average growth rate is 2.2% daily, with Chennai showing the highest at 4.2%. Urban density and population mobility are key factors driving transmission.",
  "chennai": "Chennai is classified as HIGH RISK with 15,420 confirmed cases, a growth rate of 4.2%, and ICU capacity at 90%. The high population density (7M+) and limited remaining hospital beds (800 of 5,000) make it a priority for resource allocation. Immediate actions recommended: deploy additional ICU units and oxygen supplies.",
  "resource": "Based on the prediction model, resources should be prioritized to: 1) Chennai - needs 200+ additional ICU beds and 500 oxygen cylinders. 2) Mumbai - needs expanded testing capacity. 3) Delhi - needs mobile testing units in high-density areas. The allocation algorithm considers case growth rate, hospital capacity utilization, and population density.",
  "predict": "Over the next 7 days, the model predicts: Total national cases will increase from ~98K to ~113K. Chennai may see 2,000+ new cases. Mumbai growth may slow slightly due to natural immunity buildup. Districts with growth rates above 3% should prepare for surge capacity. Use the Scenario Prediction panel for custom projections.",
  "prevent": "Key preventive measures recommended: 1) Targeted lockdowns in high-risk zones (growth rate >3%). 2) Enhanced surveillance in medium-risk areas. 3) Vaccination drives in districts with low coverage. 4) Public awareness campaigns focusing on hygiene and social distancing. 5) Contact tracing intensification in newly affected areas.",
  "risk": "Risk zones are classified using a combination of: case rate per 100K population, daily growth rate, hospital capacity utilization, and population density. HIGH: case rate >150 or growth >3%. MEDIUM: case rate >80 or growth >1.5%. LOW: below medium thresholds. Currently, 3 districts are high risk, 4 medium, and 5 low.",
};

function findResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("chennai")) return PRESET_RESPONSES.chennai;
  if (lower.includes("spread") || lower.includes("spreading")) return PRESET_RESPONSES.spread;
  if (lower.includes("resource") || lower.includes("allocat") || lower.includes("where should")) return PRESET_RESPONSES.resource;
  if (lower.includes("predict") || lower.includes("next") || lower.includes("future") || lower.includes("happen")) return PRESET_RESPONSES.predict;
  if (lower.includes("prevent") || lower.includes("measure") || lower.includes("stop")) return PRESET_RESPONSES.prevent;
  if (lower.includes("risk") || lower.includes("zone") || lower.includes("classif")) return PRESET_RESPONSES.risk;
  return "I can help you understand disease trends, risk zones, resource allocation, and predictions. Try asking:\n- Why is Chennai high risk?\n- What will happen in the next 7 days?\n- Where should resources be sent?\n- How is the disease spreading?\n- What preventive measures are recommended?";
}

export default function ChatbotWidget({ onClose }: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Hello! I'm your AI Disease Monitoring Assistant. I can help analyze trends, explain risk zones, suggest resource allocation, and predict outbreaks. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = findResponse(userMsg.content);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[520px] bg-card rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 fade-in">
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-semibold">AI Assistant</h3>
            <p className="text-[10px] opacity-80">Disease Monitoring Support</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === "user" ? "bg-primary" : "bg-accent"
            }`}>
              {msg.role === "user" ? (
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-accent-foreground" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <div className="bg-muted rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about disease trends..."
            className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
