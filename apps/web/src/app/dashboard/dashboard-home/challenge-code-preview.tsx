import { Code2 } from "lucide-react";

function getCodeLineClassName(line: string) {
  if (line.includes("useEffect") || line.includes("setInterval")) {
    return "font-semibold text-[var(--dojo-accent)]";
  }
  if (line.includes("count")) {
    return "text-[var(--dojo-rose)]";
  }
  return "";
}

export function ChallengeCodePreview({ code }: { code: string }) {
  return (
    <div className="min-h-120 overflow-hidden rounded-xl border border-[color:var(--dojo-border)] bg-transparent">
      <div className="flex h-12 items-center justify-between border-b border-[color:var(--dojo-border)] px-4 text-xs text-[var(--dojo-muted)]">
        <div className="flex items-center gap-3">
          <Code2 className="size-4" aria-hidden="true" />
          <span>Counter.tsx</span>
        </div>
        <span className="rounded-full border border-[color:var(--dojo-border-strong)] px-2 py-1 text-xs uppercase tracking-wide">read-only</span>
      </div>
      <pre className="min-h-96 max-h-96 overflow-auto px-4 py-5 text-xs leading-6 text-[var(--dojo-ink-soft)] sm:px-6">
        <code>
          {code.split("\n").map((line, index) => (
            <span key={`${index}-${line}`} className="grid grid-cols-[2rem_minmax(0,1fr)]">
              <span className="select-none pr-3 text-right text-[var(--dojo-muted)]">{index + 1}</span>
              <span className={getCodeLineClassName(line)}>{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--dojo-border)] px-4 py-3 text-xs text-[var(--dojo-muted)]">
        <span>Linguagem <strong className="ml-1 text-[var(--dojo-accent)]">React</strong></span>
        <span>Complexidade <strong className="ml-1 text-[var(--dojo-ink)]">O(n)</strong></span>
      </div>
    </div>
  );
}
