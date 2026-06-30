import React, { useEffect } from "react";

export function SaveHotkey({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s" && enabled) {
        event.preventDefault();
        console.log("saving");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
