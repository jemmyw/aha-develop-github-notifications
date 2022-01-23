export class ObjectCache<T> {
  private cache: { [key: string]: T } = {};
  private cacheTimestamps: { [key: string]: number } = {};

  constructor(private readonly cacheName: string) {
    const data: any = window.localStorage.getItem(this.storageKey);
    if (data) {
      const stored = JSON.parse(data);
      if (stored && stored.cache && stored.cacheTimestamps) {
        this.cache = stored.cache;
        this.cacheTimestamps = stored.cacheTimestamps;
      }
    }
  }

  public keys() {
    return Object.keys(this.cache);
  }

  public values() {
    return Object.values(this.cache);
  }

  public get(key: string): T {
    return this.cache[key];
  }

  public set(key: string, value: T): void {
    this.cacheTimestamps[key] = Date.now();
    this.cache[key] = value;
  }

  public has(key: string): boolean {
    return this.cache[key] !== undefined;
  }

  public remove(key: string): void {
    delete this.cache[key];
    delete this.cacheTimestamps[key];
  }

  public clear(): void {
    this.cache = {};
    this.cacheTimestamps = {};
  }

  public persist(): void {
    window.localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        cache: this.cache,
        cacheTimestamps: this.cacheTimestamps,
      })
    );
  }

  public hasSince(key: string, timestamp: number): boolean {
    return this.cacheTimestamps[key] >= timestamp;
  }

  private get storageKey(): string {
    return [this.cacheName, "cache"].join("_");
  }
}
