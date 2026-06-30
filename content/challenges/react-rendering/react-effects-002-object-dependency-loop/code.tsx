import React, { useEffect, useState } from "react";

type Result = { id: string; label: string };

export function SearchPanel({ query }: { query: string }) {
  const [rows, setRows] = useState<Result[]>([]);
  const filters = { query, limit: 10 };

  useEffect(() => {
    fetch("/api/search", {
      method: "POST",
      body: JSON.stringify(filters),
    })
      .then(response => response.json())
      .then(data => setRows(data.items));
  }, [filters]);

  return <p>Resultados: {rows.length}</p>;
}
