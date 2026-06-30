type Action<T> = { type: string; payload: T };

type State = {
  items: string[];
  selectedId: string | null;
};

function reducer<T>(state: T, action: Action<T>) {
  if (action.type === "reset") return action.payload;
  return state;
}

const initialState: State = { items: [], selectedId: null };
reducer(initialState, { type: "select", payload: { items: ["a"], selectedId: "a" } });
