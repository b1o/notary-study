/**
 * Shares one request per key: every caller of the same key gets the same promise.
 * A failed request is forgotten, so the next call tries again.
 */
export class PromiseCache<T> {
  private readonly entries = new Map<string, Promise<T>>();

  get(key: string, load: () => Promise<T>): Promise<T> {
    let promise = this.entries.get(key);
    if (!promise) {
      promise = load();
      this.entries.set(key, promise);
      promise.catch(() => this.entries.delete(key));
    }
    return promise;
  }
}
