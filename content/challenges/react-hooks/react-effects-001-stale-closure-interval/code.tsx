import React, { useEffect, useState } from "react";

export function IntervalCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>Count: {count}</p>;
}
