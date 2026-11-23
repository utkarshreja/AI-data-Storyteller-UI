import { useState } from "react";
import { Bell, Lightbulb, Menu, MoreVertical, Settings } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png.asset.json";
import logoWordmark from "@/assets/logo-wordmark.png.asset.json";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShareModal } from "./ShareModal";
import { toast } from "sonner";

export function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 rounded-lg px-1 py-1 transition-opacity hover:opacity-90" aria-label="AI Data Storyteller — go to dashboard">
      <img src={logoIcon.url} alt="" aria-hidden className="logo-mark size-12 shrink-0 object-contain" />
      <img src={logoWordmark.url} alt="AI Data Storyteller" className="h-9 w-auto max-w-[130px] object-contain object-left" />
    </button>
  );
}

function IconBtn({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={onClick} aria-label={label} className="relative grid size-10 place-items-center rounded-full bg-elevated/70 text-muted-foreground transition-colors hover:bg-hover hover:text-foreground">
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const NOTIFS = [
  { t: "Analysis complete", d: "Sales_Q3.xlsx is ready to explore", time: "2m" },
  { t: "New feature", d: "Table summaries now support CSV", time: "1h" },
  { t: "Workspace shared", d: "Priya viewed your workspace", time: "1d" },
];

export function Navbar({ onMenu, onHome }: { onMenu: () => void; onHome: () => void }) {
  const [share, setShare] = useState(false);
  const [settings, setSettings] = useState(false);
  const [help, setHelp] = useState(false);
  const [unread, setUnread] = useState(true);

  const profileMenu = (
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="text-sm">Alex Morgan</div>
        <div className="text-xs font-normal text-muted-foreground">alex@company.com</div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => toast("My Profile")}>My Profile</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSettings(true)}>Account Settings</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSettings(true)}>Appearance</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast("You're on the Free plan")}>Subscription / Plan</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setHelp(true)}>Help & Support</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => toast("Signed out")}>Sign Out</DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between px-4 md:justify-end md:px-8">
      <div className="flex items-center gap-1">
        <button onClick={onMenu} aria-label="Open chats" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-hover md:hidden">
          <Menu className="size-5" />
        </button>
        <div className="md:hidden"><Logo onClick={onHome} /></div>
      </div>

      <nav className="mr-6 hidden items-center gap-6 text-sm md:flex">
        <button onClick={onHome} className="relative pb-1 text-primary after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">Dashboard</button>
        <button onClick={() => toast("Library is coming soon")} className="pb-1 text-muted-foreground transition hover:text-foreground">Library</button>
        <button onClick={() => setHelp(true)} className="pb-1 text-foreground/90 transition hover:text-foreground">Help & Support</button>
        <button onClick={() => setShare(true)} className="pb-1 text-foreground/90 transition hover:text-foreground">Share</button>
      </nav>

      <div className="hidden items-center gap-0.5 md:flex">
        <IconBtn label="Tips" onClick={() => setHelp(true)}><Lightbulb className="size-4" /></IconBtn>
        <DropdownMenu onOpenChange={(o) => o && setUnread(false)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full bg-elevated/70 text-muted-foreground hover:bg-hover hover:text-foreground">
                  <Bell className="size-4" />
                  {unread && <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-sidebar" />}
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFS.map((n) => (
              <DropdownMenuItem key={n.t} className="flex flex-col items-start gap-0.5">
                <div className="flex w-full justify-between text-sm"><span>{n.t}</span><span className="text-xs text-subtle">{n.time}</span></div>
                <span className="text-xs text-muted-foreground">{n.d}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <IconBtn label="Settings" onClick={() => setSettings(true)}><Settings className="size-4" /></IconBtn>
                <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Profile" className="ml-2 grid size-10 place-items-center rounded-full bg-gradient-accent text-xs font-semibold text-primary-foreground ring-2 ring-border transition hover:ring-primary">AM</button>
          </DropdownMenuTrigger>
          {profileMenu}
        </DropdownMenu>
      </div>

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Actions" className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-hover"><MoreVertical className="size-5" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => setShare(true)}>Share</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("No new notifications")}>Notifications</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSettings(true)}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHelp(true)}>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("Signed out")}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ShareModal open={share} onOpenChange={setShare} />

      <Dialog open={settings} onOpenChange={setSettings}>
        <DialogContent className="glass border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Personalize your workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {["Compact message layout", "Show table previews", "Email notifications"].map((s, i) => (
              <div key={s} className="flex items-center justify-between rounded-lg border border-border bg-elevated px-3 py-2.5">
                <Label htmlFor={`s${i}`} className="text-sm font-normal">{s}</Label>
                <Switch id={`s${i}`} defaultChecked={i !== 0} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent className="glass border-border bg-popover sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>Get the most out of AI Data Storyteller.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
            <li className="rounded-lg border border-border bg-elevated px-3 py-2.5">Upload a PDF, DOCX, XLSX, CSV or TXT (max 20 MB).</li>
            <li className="rounded-lg border border-border bg-elevated px-3 py-2.5">Ask questions in plain language below.</li>
            <li className="rounded-lg border border-border bg-elevated px-3 py-2.5">Press Shift + Enter for a new line.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  );
}
