import { useRef, useState } from "react";
import { ArrowUp, Loader2, Mic, Paperclip } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export function MessageInput({ onSend, loading, onAttach }: { onSend: (t: string) => void; loading: boolean; onAttach: () => void }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !loading;

  const send = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  return (
    <div className="flex min-h-[60px] w-full items-end gap-1 rounded-[30px] glass border border-border bg-surface py-2 pl-5 pr-2 transition-colors focus-within:border-primary/70 focus-within:shadow-glow">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        placeholder="Ask anything about your document..."
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
        }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        className="max-h-40 flex-1 resize-none bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-subtle"
      />
      <Tooltip><TooltipTrigger asChild>
        <button onClick={onAttach} aria-label="Attach file" className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-hover hover:text-foreground"><Paperclip className="size-4" /></button>
      </TooltipTrigger><TooltipContent>Attach file</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild>
        <button onClick={() => toast("Voice input is coming soon")} aria-label="Voice input" className="hidden size-10 place-items-center rounded-full text-muted-foreground hover:bg-hover hover:text-foreground sm:grid"><Mic className="size-4" /></button>
      </TooltipTrigger><TooltipContent>Voice input</TooltipContent></Tooltip>
      <button
        onClick={send}
        disabled={!canSend}
        aria-label="Send message"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-accent text-primary-foreground transition hover:opacity-90 disabled:bg-none disabled:bg-elevated disabled:text-subtle"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
      </button>
    </div>
  );
}
