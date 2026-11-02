import { useState } from "react";
import { Check, Copy, Lock, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [copied, setCopied] = useState(false);
  const [access, setAccess] = useState("restricted");
  const [email, setEmail] = useState("");
  const link = "https://ai-data-analyzer.app/w/7f3k2q";

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Workspace</DialogTitle>
          <DialogDescription>Sharing is a preview — links are not live yet.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={link} className="border-border bg-elevated text-muted-foreground" />
            <Button onClick={copy} className="shrink-0">{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy Link"}</Button>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">General access</span>
            <Select value={access} onValueChange={setAccess}>
              <SelectTrigger className="border-border bg-elevated"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="restricted"><Lock className="size-3.5" /> Restricted</SelectItem>
                <SelectItem value="anyone"><Users className="size-3.5" /> Anyone with the link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Enter a valid email"); return; }
              toast.success(`Invite prepared for ${email}`);
              setEmail("");
            }}
          >
            <Input placeholder="Invite by email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-border bg-elevated" />
            <Button type="submit" variant="outline" className="shrink-0 border-border bg-transparent">Invite</Button>
          </form>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
