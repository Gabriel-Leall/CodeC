type Draft = {
  status: "open" | "closed";
  title: string;
  lines: string[];
};

async function persistDraft(draft?: Draft) {
  if (!draft || draft.status === "closed") return;

  await saveAuditEntry(draft.title);

  return draft.lines[0].toUpperCase();
}
