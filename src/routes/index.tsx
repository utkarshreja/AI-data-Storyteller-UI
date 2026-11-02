import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Navbar } from "@/components/analyzer/Navbar";
import { Sidebar } from "@/components/analyzer/Sidebar";
import { DocumentUpload, UploadedFileCard } from "@/components/analyzer/DocumentUpload";
import { MessageInput } from "@/components/analyzer/MessageInput";
import { ChatWindow } from "@/components/analyzer/ChatWindow";
import { ShareModal } from "@/components/analyzer/ShareModal";
import { mockResponse, uid, type Chat, type UploadedDoc } from "@/components/analyzer/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Data Analyzer — Ask questions about your documents" },
      { name: "description", content: "Upload PDF, DOCX, XLSX, CSV or TXT files and get instant AI-powered answers, summaries and tables." },
      { property: "og:title", content: "AI Data Analyzer" },
      { property: "og:description", content: "Upload a document and ask anything about it." },
    ],
  }),
  component: Index,
});

const seed: Chat[] = [
  { id: "c1", title: "Q3 sales breakdown", messages: [], doc: null },
  { id: "c2", title: "Customer churn CSV", messages: [], doc: null },
  { id: "c3", title: "Contract clause review", messages: [], doc: null },
  { id: "c4", title: "Survey responses 2026", messages: [], doc: null },
];

function Index() {
  const [chats, setChats] = useState<Chat[]>(seed);
  const [activeId, setActiveId] = useState("c1");
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [share, setShare] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const active = chats.find((c) => c.id === activeId) ?? chats[0];
  const update = (id: string, fn: (c: Chat) => Chat) => setChats((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));

  const newChat = () => {
    const c: Chat = { id: uid(), title: "New chat", messages: [], doc: null };
    setChats((cs) => [c, ...cs]);
    setActiveId(c.id);
    setDrawer(false);
  };

  const respond = (chatId: string, question: string, doc: UploadedDoc | null) => {
    setLoading(true);
    setTimeout(() => {
      update(chatId, (c) => ({ ...c, messages: [...c.messages, { id: uid(), role: "ai", content: mockResponse(question, doc) }] }));
      setLoading(false);
    }, 1100);
  };

  const send = (text: string) => {
    const id = active.id;
    update(id, (c) => ({
      ...c,
      title: c.messages.length === 0 && c.title === "New chat" ? text.slice(0, 32) : c.title,
      messages: [...c.messages, { id: uid(), role: "user", content: text }],
    }));
    respond(id, text, active.doc);
  };

  const regenerate = () => {
    const msgs = active.messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    update(active.id, (c) => ({ ...c, messages: c.messages[c.messages.length - 1]?.role === "ai" ? c.messages.slice(0, -1) : c.messages }));
    respond(active.id, lastUser.content, active.doc);
  };

  const setDoc = (doc: UploadedDoc | null) => {
    update(active.id, (c) => ({ ...c, doc }));
    if (doc) toast.success(`${doc.name} uploaded`);
  };

  const sidebarProps = {
    chats,
    activeId: active?.id ?? "",
    onSelect: (id: string) => { setActiveId(id); setDrawer(false); },
    onNew: newChat,
    onRename: (id: string, title: string) => update(id, (c) => ({ ...c, title })),
    onDuplicate: (id: string) => {
      const src = chats.find((c) => c.id === id);
      if (!src) return;
      const copy = { ...src, id: uid(), title: `${src.title} (copy)` };
      setChats((cs) => { const i = cs.findIndex((c) => c.id === id); const n = [...cs]; n.splice(i + 1, 0, copy); return n; });
    },
    onDelete: (id: string) => {
      setChats((cs) => {
        const rest = cs.filter((c) => c.id !== id);
        if (rest.length === 0) { const c = { id: uid(), title: "New chat", messages: [], doc: null }; setActiveId(c.id); return [c]; }
        if (id === activeId) setActiveId(rest[0].id);
        return rest;
      });
      toast("Chat deleted");
    },
    onShare: () => setShare(true),
  };

  const hasMessages = active.messages.length > 0;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <Navbar onMenu={() => setDrawer(true)} onHome={() => setActiveId(chats[0].id)} />
        <div className="flex min-h-0 flex-1">
          <div className="hidden md:flex">
            <Sidebar {...sidebarProps} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          </div>
          <Sheet open={drawer} onOpenChange={setDrawer}>
            <SheetContent side="left" className="w-[260px] border-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Chats</SheetTitle>
              <Sidebar {...sidebarProps} collapsed={false} />
            </SheetContent>
          </Sheet>

          <main className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
              {hasMessages ? (
                <div className="space-y-5">
                  {active.doc && <div className="mx-auto max-w-3xl"><UploadedFileCard doc={active.doc} onRemove={() => setDoc(null)} /></div>}
                  <ChatWindow messages={active.messages} loading={loading} onRegenerate={regenerate} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="font-display text-2xl font-semibold md:text-3xl">
                      Understand your data, <span className="text-gradient-accent">instantly</span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Upload a document, then ask questions in plain language.</p>
                  </div>
                  <DocumentUpload key={`${active.id}-${uploadKey}`} doc={active.doc} onUploaded={setDoc} onRemove={() => setDoc(null)} />
                </div>
              )}
            </div>
            <div className="flex justify-center px-3 pb-4 pt-2 md:px-0 md:pb-6">
              <div className="w-full md:w-[90%] md:max-w-4xl">
                <MessageInput
                  onSend={send}
                  loading={loading}
                  onAttach={() => {
                    if (hasMessages) { newChat(); toast("New chat started — upload your document"); return; }
                    setUploadKey((k) => k + 1);
                    toast("Use the upload area to add a document");
                  }}
                />
                <p className="mt-2 text-center text-[11px] text-subtle">Sample answers shown — AI analysis isn't connected yet.</p>
              </div>
            </div>
          </main>
        </div>
        <ShareModal open={share} onOpenChange={setShare} />
      </div>
    </TooltipProvider>
  );
}
