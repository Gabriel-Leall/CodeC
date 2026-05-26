import React, { useState, useEffect } from 'react';

export function DataFetcher() {
  const [data, setData] = useState([]);
  const config = { api: "https://api.example.com/items" };

  useEffect(() => {
    fetch(config.api)
      .then(res => res.json())
      .then(data => setData(data));
  }, [config]); // Objeto config como dependência

  return (
    <ul>
      {data.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
