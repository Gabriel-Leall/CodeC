type Counters = Partial<Record<"success" | "error", number>>;

function readSuccess(counters: Counters) {
  if ("success" in counters) {
    return counters.success.toFixed(0);
  }

  return "0";
}
