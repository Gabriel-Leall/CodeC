import React, { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Count value:", count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Array de dependências vazio

  return <div>Contagem: {count}</div>;
}
