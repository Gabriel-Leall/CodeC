class SearchClient {
  private controller = new AbortController();

  async search(query: string) {
    const response = await fetch("/api/search?q=" + encodeURIComponent(query), {
      signal: this.controller.signal,
    });

    return response.json();
  }

  cancel() {
    this.controller.abort();
  }
}
