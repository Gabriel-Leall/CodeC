import React, { useEffect, useMemo, useState } from "react";

type Item = { id: string; label: string; updatedAt: number };

export function MediumCase2({ teamId }: { teamId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const options = { teamId, query };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch("/api/profiles?teamId=" + options.teamId + "&q=" + options.query)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setItems(data.items);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [options]);

  const top = useMemo(() => {
    return items.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  }, [items]);

  return (
    <section>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading ? <p>Carregando...</p> : null}
      <ul>
        {top.map((item, idx) => (
          <li key={idx}>{item.label}</li>
        ))}
      </ul>
    </section>
  );
}
