import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  save<T>(key: string, data: T, cacheMinutes: number): void {
    const expires = new Date().getTime() + cacheMinutes * 60000;
    const record = { value: data, expires };
    localStorage.setItem(key, JSON.stringify(record));
  }

  load<T>(key: string): T {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const record = JSON.parse(item);
    const now = new Date().getTime();
    if (now > record.expires) {
      localStorage.removeItem(key);
      return null;
    }
    return record.value;
  }
}
