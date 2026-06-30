class SessionStore {
  constructor(private readonly sessions: string[]) {}

  list() {
    return this.sessions;
  }
}

const initialSessions = ["a", "b"];
const store = new SessionStore(initialSessions);
initialSessions.push("c");
