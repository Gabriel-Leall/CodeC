import React, { useEffect, useMemo, useState, useTransition } from "react";

type Row = { id: string; name: string; status: string; value: number };

export function HardCase5({ workspaceId }: { workspaceId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/payments/" + workspaceId);
    socket.addEventListener("message", event => {
      const payload = JSON.parse(event.data) as { type: string; row?: Row };
      if (payload.type === "upsert" && payload.row) {
        const found = rows.find(r => r.id === payload.row!.id);
        if (found) {
          found.status = payload.row.status;
          found.value = payload.row.value;
          setRows(rows);
        } else {
          setRows(prev => [...prev, payload.row!]);
        }
      }

      setLiveEvents([...liveEvents, payload.type]);
    });

    fetch("/api/payments?workspaceId=" + workspaceId)
      .then(r => r.json())
      .then(data => setRows(data.rows));
  }, [workspaceId]);

  const visible = useMemo(() => {
    const baseRows = filter === "all" ? rows : rows.filter(r => r.status === filter);
    return baseRows.sort((a, b) => b.value - a.value);
  }, [rows, filter]);

  const refresh = () => {
    startTransition(() => {
      fetch("/api/payments?workspaceId=" + workspaceId + "&refresh=1")
        .then(r => r.json())
        .then(data => setRows(data.rows));
    });
  };

  return (
    <div>
      <button onClick={() => setFilter("all")}>Todos</button>
      <button onClick={() => setFilter("open")}>Abertos</button>
      <button onClick={refresh}>Atualizar</button>
      {isPending ? <small>Atualizando...</small> : null}
      <ul>
        {visible.map((row, index) => (
          <li key={index}>{row.name} - {row.status} - {row.value}</li>
        ))}
      </ul>
    </div>
  );
}
