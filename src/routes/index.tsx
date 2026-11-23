import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import bgAsset from "@/assets/ui-background.avif.asset.json";
import logoIcon from "@/assets/logo-icon.png.asset.json";
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
      { title: "AI Data Storyteller — Ask questions about your documents" },
      { name: "description", content: "Upload PDF, DOCX, XLSX, CSV or TXT files and get instant AI-powered answers, summaries and tables." },
      { property: "og:title", content: "AI Data Storyteller" },
      { property: "og:description", content: "Upload a document and ask anything about it." },
    ],
  }),
  component: Index,
});

const TOOLS = [
  { title: "Upload a Document", desc: "Add a PDF, DOCX, XLSX, CSV or TXT file up to 20 MB to start asking questions.", prompt: "", upload: true },
  { title: "Summarize Key Points", desc: "Get a short, clear summary of the most important facts in your file.", prompt: "Summarize the key points of this document" },
  { title: "Find Trends & Patterns", desc: "Spot changes over time, outliers and patterns hidden in your data.", prompt: "What trends and patterns do you see in this data?" },
  { title: "Build a Comparison Table", desc: "Turn messy numbers into a tidy table you can copy and share.", prompt: "Create a comparison table of the main figures" },
];

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
  const [showUpload, setShowUpload] = useState(false);

  const active = (chats.find((c) => c.id === activeId) ?? chats[0])!;
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
        if (id === activeId) setActiveId(rest[0]!.id);
        return rest;
      });
      toast("Chat deleted");
    },
    onShare: () => setShare(true),
  };

  const hasMessages = active.messages.length > 0;
  const openUpload = () => {
    if (hasMessages) { newChat(); toast("New chat started — upload your document"); }
    setShowUpload(true);
    setUploadKey((k) => k + 1);
  };
  const input = <MessageInput onSend={send} loading={loading} onAttach={openUpload} />;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="app-bg" aria-hidden>
        <div className="app-bg-aurora" />
        <div className="app-bg-sweep" />
        <div className="app-bg-grid" style={{ backgroundImage: `url(${bgAsset.url})` }} />
        <div className="app-bg-orb o1" />
        <div className="app-bg-orb o2" />
        <div className="app-bg-orb o3" />
        <div className="app-bg-vignette" />
      </div>
      <div className="relative z-10 flex h-screen p-2 md:p-6">
        <div className="app-frame relative flex min-h-0 flex-1 gap-4 overflow-hidden rounded-[28px] border border-border p-0 text-foreground shadow-2xl md:p-3">
          <div className="frame-glow" />
          <div className="frame-glow-2" />
          <div className="relative hidden md:flex">
            <Sidebar {...sidebarProps} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          </div>
          <Sheet open={drawer} onOpenChange={setDrawer}>
            <SheetContent side="left" className="glass w-[290px] border-border bg-background p-2">
              <SheetTitle className="sr-only">Chats</SheetTitle>
              <Sidebar {...sidebarProps} collapsed={false} />
            </SheetContent>
          </Sheet>

          <main className="relative flex min-w-0 flex-1 flex-col">
            <Navbar onMenu={() => setDrawer(true)} onHome={() => setActiveId(chats[0]!.id)} />
            {hasMessages ? (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
                  <div className="space-y-5">
                    {active.doc && <div className="mx-auto max-w-3xl"><UploadedFileCard doc={active.doc} onRemove={() => setDoc(null)} /></div>}
                    <ChatWindow messages={active.messages} loading={loading} onRegenerate={regenerate} />
                  </div>
                </div>
                <div className="mx-auto w-full max-w-4xl px-3 pb-4 md:px-6">{input}</div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 pb-10 md:px-10">
                <div className="mx-auto flex max-w-4xl flex-col items-center pt-6 md:pt-10">
                  <img src={logoIcon.url} alt="AI Data Storyteller" className="logo-mark rise-in float-y size-24 object-contain md:size-28" />
                  <h2 className="rise-in mt-8 text-center font-display text-3xl font-medium md:text-4xl" style={{ animationDelay: "80ms" }}>Welcome Back <span className="text-gradient-accent text-shimmer">✨</span></h2>
                  <p className="rise-in mt-3 text-center font-display text-3xl font-medium md:text-5xl" style={{ animationDelay: "160ms" }}>What Can I Help You Analyze Today?</p>
                  <div className="rise-in mt-10 w-full" style={{ animationDelay: "240ms" }}>{input}</div>
                  {(showUpload || active.doc) && (
                    <div className="rise-in mt-4 flex w-full justify-center">
                      <DocumentUpload key={`${active.id}-${uploadKey}`} doc={active.doc} onUploaded={setDoc} onRemove={() => setDoc(null)} />
                    </div>
                  )}
                  <h3 className="rise-in mt-14 w-full font-display text-2xl font-medium text-foreground/80 md:text-3xl" style={{ animationDelay: "320ms" }}>Kickstart Your Analysis with These Tools</h3>
                  <div className="mt-6 grid w-full gap-4 md:grid-cols-2">
                    {TOOLS.map((t, i) => (
                      <button key={t.title} onClick={() => (t.upload ? openUpload() : send(t.prompt))}
                        className="tool-card rise-in glass rounded-3xl border border-border bg-surface p-6 text-left" style={{ animationDelay: `${400 + i * 80}ms` }}>
                        <div className="text-lg font-medium">{t.title}</div>
                        <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                        <div className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-sm">{t.upload ? "Upload now" : "Try it"} <ArrowRight className="size-3.5" /></div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-8 text-center text-[11px] text-subtle">Sample answers shown — AI analysis isn't connected yet.</p>
                </div>
              </div>
            )}
          </main>
        </div>
        <ShareModal open={share} onOpenChange={setShare} />
      </div>
    </TooltipProvider>
  );
}
