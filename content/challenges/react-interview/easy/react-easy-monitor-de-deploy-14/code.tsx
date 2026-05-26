import React, { useEffect, useMemo, useState } from "react";

type Row = { id: string; name: string; score: number };

export function EasyCase14() {
  const [rows, setRows] = useState<Row[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/deploys")
      .then(r => r.json())
      .then(data => setRows(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return rows.filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [rows]);

  const addOne = () => {
    if (rows.length === 0) return;
    rows[0].score = rows[0].score + 1;
    setRows(rows);
  };

  if (loading) return <p>Carregando...</p>;
  return (
    <div>
      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <button onClick={addOne}>+1 primeiro</button>
      <ul>{filtered.map(row => <li key={row.id}>{row.name} - {row.score}</li>)}</ul>
    </div>
  );
}
