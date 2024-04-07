import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private locations$ = new BehaviorSubject<string[]>([]);

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations$.next(JSON.parse(locString));
  }

  getLocations() {
    return this.locations$.asObservable();
  }

  addLocation(zipcode: string) {
    const currentLocations = this.locations$.getValue();
    const updatedLocations = [...currentLocations, zipcode];
    localStorage.setItem(LOCATIONS, JSON.stringify(updatedLocations));
    this.locations$.next(updatedLocations);
  }

  removeLocation(zipcode: string) {
    const currentLocations = this.locations$.getValue();
    const updatedLocations = currentLocations.filter((loc) => loc !== zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(updatedLocations));
    this.locations$.next(updatedLocations);
  }
}
