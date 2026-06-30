import React, { useState } from "react";

export function RetryPanel() {
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function retry() {
    if (submitting) return;

    setSubmitting(true);
    setAttempts(current => current + 1);
    await submitRetry();
    setSubmitting(false);
  }

  return (
    <div>
      <button onClick={retry}>Tentar novamente</button>
      <p>Tentativas: {attempts}</p>
    </div>
  );
}
