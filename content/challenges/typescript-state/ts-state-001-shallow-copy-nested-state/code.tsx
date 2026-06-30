type Preferences = {
  theme: {
    contrast: "low" | "high";
  };
};

function enableHighContrast(state: Preferences) {
  const next = { ...state };
  next.theme.contrast = "high";
  return next;
}
