import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith("_") && p.endsWith("_") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="rounded bg-elevated px-1 py-0.5 text-xs">{p.slice(1, -1)}</code>;
    return p;
  });
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("|")) {
        const cells = (lines[i] ?? "").split("|").slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells);
        i++;
      }
      const [head = [], ...body] = rows;
      out.push(
        <div key={i} className="my-3 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-left text-muted-foreground">
              <tr>{head.map((h, k) => <th key={k} className="px-3 py-2 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, k) => (
                <tr key={k} className="border-t border-border">
                  {r.map((c, j) => <td key={j} className="px-3 py-2">{inline(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test((lines[i] ?? "")) : /^[-*] /.test((lines[i] ?? "")))) {
        items.push((lines[i] ?? "").replace(/^([-*]|\d+\.) /, ""));
        i++;
      }
      const Tag = ordered ? "ol" : "ul";
      out.push(
        <Tag key={i} className={`my-2 space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-subtle`}>
          {items.map((it, k) => <li key={k}>{inline(it)}</li>)}
        </Tag>,
      );
      continue;
    }
    if (line.startsWith("### ")) out.push(<h4 key={i} className="mt-4 mb-1 font-display text-sm font-semibold text-foreground">{line.slice(4)}</h4>);
    else if (line.startsWith("## ")) out.push(<h3 key={i} className="mt-1 mb-2 font-display text-base font-semibold text-foreground">{line.slice(3)}</h3>);
    else if (line.trim()) out.push(<p key={i} className="my-2">{inline(line)}</p>);
    i++;
  }
  return <div className="text-sm leading-relaxed text-muted-foreground">{out}</div>;
}
