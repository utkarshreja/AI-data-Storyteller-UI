export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export type UploadedDoc = {
  name: string;
  size: number;
  type: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
  doc: UploadedDoc | null;
};

export const ACCEPTED_EXT = ["pdf", "docx", "xlsx", "csv", "txt"];
export const MAX_SIZE = 20 * 1024 * 1024;

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateFile(file: { name: string; size: number }): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ACCEPTED_EXT.includes(ext)) return "Unsupported format. Use PDF, DOCX, XLSX, CSV or TXT.";
  if (file.size > MAX_SIZE) return "File is too large. Maximum size is 20 MB.";
  if (file.size === 0) return "File is empty.";
  return null;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function mockResponse(question: string, doc: UploadedDoc | null): string {
  const docName = doc ? doc.name : "your document";
  return `## Summary
Here's what I found in **${docName}** regarding: _"${question.slice(0, 80)}"_

- The document contains structured sections with consistent formatting.
- Key figures appear concentrated in the middle sections.
- A few entries look incomplete and may need review.

| Metric | Value | Note |
| --- | --- | --- |
| Records scanned | 1,248 | All pages |
| Missing values | 37 | Mostly optional fields |
| Duplicates | 4 | Same ID repeated |

### Next steps
1. Clean the duplicate rows.
2. Ask me to break down any column in detail.

_This is a sample response — connect an AI model to get real analysis._`;
}
