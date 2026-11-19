import { useRef, useState } from "react";
import { ArrowUp, AudioLines, Loader2, MoreHorizontal, Paperclip, Search } from "lucide-react";
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

  const chip = "flex h-10 items-center gap-2 rounded-xl border border-border bg-elevated px-3.5 text-sm text-foreground/90 transition hover:border-primary/40 hover:bg-hover";

  return (
    <div className="glass w-full rounded-3xl border border-border bg-surface p-3 shadow-2xl transition-colors focus-within:border-primary/40 focus-within:shadow-glow">
      <textarea
        ref={ref}
        rows={2}
        value={value}
        placeholder="Ask anything ..."
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
        }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        className="max-h-40 w-full resize-none bg-transparent px-2 pt-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-2 flex items-center gap-2">
        <button onClick={() => toast("Search across your documents is coming soon")} className={chip}><Search className="size-4" /> <span className="hidden sm:inline">Search</span></button>
        <button onClick={onAttach} className={chip}><Paperclip className="size-4" /> <span className="hidden sm:inline">Upload File</span></button>
        <button onClick={() => toast("More tools coming soon")} aria-label="More" className="grid size-10 place-items-center rounded-full border border-border bg-elevated text-foreground/80 hover:bg-hover"><MoreHorizontal className="size-4" /></button>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip><TooltipTrigger asChild>
            <button onClick={() => toast("Voice input is coming soon")} aria-label="Voice input" className="grid size-10 place-items-center rounded-full border border-border bg-elevated text-muted-foreground hover:text-foreground"><AudioLines className="size-4" /></button>
          </TooltipTrigger><TooltipContent>Voice input</TooltipContent></Tooltip>
          <button onClick={send} disabled={!canSend} aria-label="Send message"
            className="grid size-10 place-items-center rounded-full bg-foreground text-background transition hover:scale-105 disabled:opacity-60 disabled:hover:scale-100">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
