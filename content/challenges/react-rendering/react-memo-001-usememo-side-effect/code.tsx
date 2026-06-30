import React, { useMemo } from "react";

type Item = { price: number };

export function CartSummary({ items }: { items: Item[] }) {
  const total = useMemo(() => {
    analytics.track("cart-recalculated", { size: items.length });
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <p>Total: {total}</p>;
}
