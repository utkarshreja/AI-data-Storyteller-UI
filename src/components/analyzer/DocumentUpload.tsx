import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, CloudUpload, FileText, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatSize, validateFile, type UploadedDoc } from "./types";

export function UploadedFileCard({ doc, onRemove, onReplace }: { doc: UploadedDoc; onRemove: () => void; onReplace?: () => void }) {
  return (
    <div className="flex items-center gap-3 glass rounded-xl border border-border bg-surface px-3 py-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"><FileText className="size-4" /></span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{doc.name}</div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3 text-success" /> {formatSize(doc.size)} · Ready
        </div>
      </div>
      {onReplace && (
        <button onClick={onReplace} aria-label="Replace file" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-hover hover:text-foreground"><RefreshCw className="size-4" /></button>
      )}
      <button onClick={onRemove} aria-label="Remove file" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-hover hover:text-destructive"><X className="size-4" /></button>
    </div>
  );
}

export function DocumentUpload({ doc, onUploaded, onRemove }: { doc: UploadedDoc | null; onUploaded: (d: UploadedDoc) => void; onRemove: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ name: string; pct: number } | null>(null);

  const handle = (file?: File) => {
    if (!file) return;
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError(null);
    setProgress({ name: file.name, pct: 0 });
    let pct = 0;
    const t = setInterval(() => {
      pct += 12 + Math.random() * 18;
      if (pct >= 100) {
        clearInterval(t);
        setProgress(null);
        onUploaded({ name: file.name, size: file.size, type: file.type });
      } else setProgress({ name: file.name, pct });
    }, 140);
  };

  const fileInput = (
    <input ref={input} type="file" hidden accept=".pdf,.docx,.xlsx,.csv,.txt" onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }} />
  );

  if (doc) {
    return (
      <div className="w-full max-w-[550px]">
        {fileInput}
        <UploadedFileCard doc={doc} onRemove={onRemove} onReplace={() => input.current?.click()} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[550px]">
      {fileInput}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !progress && input.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
        className={cn(
          "group flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl glass border border-dashed bg-surface px-6 py-8 text-center transition-all",
          drag ? "border-primary bg-primary/10 shadow-glow" : "border-border-strong hover:border-primary/70 hover:bg-elevated",
          error && "border-destructive/70",
        )}
      >
        {progress ? (
          <div className="w-full max-w-xs">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span className="truncate">{progress.name}</span><span>{Math.round(progress.pct)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
              <div className="h-full rounded-full bg-gradient-accent transition-all" style={{ width: `${progress.pct}%` }} />
            </div>
            <p className="mt-3 text-xs text-subtle">Uploading…</p>
          </div>
        ) : (
          <>
            <span className="mb-3 grid size-12 place-items-center rounded-xl bg-gradient-accent shadow-glow transition-transform group-hover:-translate-y-0.5">
              <CloudUpload className="size-6 text-primary-foreground" />
            </span>
            <h2 className="font-display text-base font-semibold">Upload Your Document</h2>
            <p className="mt-1 text-sm text-muted-foreground">Drag and drop your files here or browse</p>
            <Button size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); input.current?.click(); }}>Browse Files</Button>
            <p className="mt-3 text-[11px] tracking-wide text-subtle">PDF · DOCX · XLSX · CSV · TXT — up to 20 MB</p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive"><AlertCircle className="size-3.5" /> {error}</p>
      )}
    </div>
  );
}
