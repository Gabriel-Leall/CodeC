import React, { useEffect, useState } from "react";

export function NameField() {
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/profile")
      .then(response => response.json())
      .then(data => setValue(data.name));
  }, []);

  return <input value={value} onChange={event => setValue(event.target.value)} />;
}
