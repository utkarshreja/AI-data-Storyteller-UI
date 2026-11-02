import { useState } from "react";
import { Copy, MessageSquare, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Chat } from "./types";

type Props = {
  chats: Chat[];
  activeId: string;
  collapsed: boolean;
  onToggle?: () => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: () => void;
};

export function Sidebar({ chats, activeId, collapsed, onToggle, onSelect, onNew, onRename, onDuplicate, onDelete, onShare }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (collapsed) {
    return (
      <aside className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-border bg-sidebar py-3">
        <Tooltip><TooltipTrigger asChild>
          <button onClick={onToggle} aria-label="Expand sidebar" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-hover hover:text-foreground"><PanelLeftOpen className="size-4" /></button>
        </TooltipTrigger><TooltipContent side="right">Expand</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
          <button onClick={onNew} aria-label="New chat" className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary hover:bg-primary/25"><Plus className="size-4" /></button>
        </TooltipTrigger><TooltipContent side="right">New Chat</TooltipContent></Tooltip>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[250px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-[11px] font-semibold tracking-[1.5px] text-subtle">CHATS</span>
        {onToggle && (
          <Tooltip><TooltipTrigger asChild>
            <button onClick={onToggle} aria-label="Collapse sidebar" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-hover hover:text-foreground"><PanelLeftClose className="size-4" /></button>
          </TooltipTrigger><TooltipContent side="right">Collapse</TooltipContent></Tooltip>
        )}
      </div>
      <div className="px-3">
        <button onClick={onNew} className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
          <Plus className="size-4" /> New Chat
        </button>
      </div>
      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {chats.map((c) => (
          <div
            key={c.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
              c.id === activeId ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-hover hover:text-foreground",
            )}
          >
            <MessageSquare className={cn("size-4 shrink-0", c.id === activeId && "text-primary")} />
            {editing === c.id ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => { if (draft.trim()) onRename(c.id, draft.trim()); setEditing(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setEditing(null); }}
                className="min-w-0 flex-1 rounded bg-elevated px-1 text-sm text-foreground outline-none ring-1 ring-primary"
              />
            ) : (
              <button onClick={() => onSelect(c.id)} className="min-w-0 flex-1 truncate text-left">{c.title}</button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Chat options" className="grid size-6 place-items-center rounded opacity-0 transition hover:bg-elevated group-hover:opacity-100 data-[state=open]:opacity-100">
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => { setDraft(c.title); setEditing(c.id); }}><Pencil /> Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={onShare}><Share2 /> Share</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(c.id)}><Copy /> Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(c.id)}><Trash2 /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </nav>
    </aside>
  );
}
