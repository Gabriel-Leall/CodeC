import React, { useState } from "react";

export function RefreshPanel() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  async function refresh(sectionId: string) {
    setLoading(true);
    const result = await fetch("/api/sections/" + sectionId).then(response => response.text());
    setLogs(current => [...current, result]);
    setLoading(false);
  }

  return (
    <div>
      <button onClick={() => refresh("a")}>Atualizar A</button>
      <button onClick={() => refresh("b")}>Atualizar B</button>
      {loading ? <p>Carregando...</p> : null}
    </div>
  );
}
