import { useEffect, useRef, useState } from "react";
import { Check, Copy, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Markdown } from "./Markdown";
import type { ChatMessage } from "./types";

function Action({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip><TooltipTrigger asChild>
      <button onClick={onClick} aria-label={label} className={cn("grid size-7 place-items-center rounded-md text-subtle hover:bg-hover hover:text-foreground", active && "text-primary")}>{children}</button>
    </TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
  );
}

function AIResponse({ msg, onRegenerate, isLast }: { msg: ChatMessage; onRegenerate: () => void; isLast: boolean }) {
  const [copied, setCopied] = useState(false);
  const [fb, setFb] = useState<"up" | "down" | null>(null);
  return (
    <div className="rise-in flex gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-accent"><Sparkles className="size-3.5 text-primary-foreground" /></span>
      <div className="min-w-0 flex-1">
        <div className="rounded-xl glass border border-border bg-surface px-4 py-3"><Markdown content={msg.content} /></div>
        <div className="mt-1 flex gap-0.5">
          <Action label={copied ? "Copied" : "Copy"} onClick={() => { navigator.clipboard?.writeText(msg.content).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </Action>
          {isLast && <Action label="Regenerate" onClick={onRegenerate}><RotateCcw className="size-3.5" /></Action>}
          <Action label="Good response" active={fb === "up"} onClick={() => setFb(fb === "up" ? null : "up")}><ThumbsUp className="size-3.5" /></Action>
          <Action label="Bad response" active={fb === "down"} onClick={() => setFb(fb === "down" ? null : "down")}><ThumbsDown className="size-3.5" /></Action>
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({ messages, loading, onRegenerate }: { messages: ChatMessage[]; loading: boolean; onRegenerate: () => void }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length, loading]);
  const lastAi = [...messages].reverse().find((m) => m.role === "ai")?.id;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="rise-in flex justify-end">
            <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-primary/25 bg-primary/15 px-4 py-2.5 text-sm">{m.content}</div>
          </div>
        ) : (
          <AIResponse key={m.id} msg={m} isLast={m.id === lastAi && !loading} onRegenerate={onRegenerate} />
        ),
      )}
      {loading && (
        <div className="flex gap-3">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-accent"><Sparkles className="size-3.5 text-primary-foreground" /></span>
          <div className="flex items-center gap-1 rounded-xl glass border border-border bg-surface px-4 py-3">
            {[0, 150, 300].map((d) => <span key={d} className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${d}ms` }} />)}
          </div>
        </div>
      )}
      <div ref={end} />
    </div>
  );
}
