import { Injectable, OnDestroy, Signal, signal } from "@angular/core";
import { Observable, Subscription, of } from "rxjs";
import { skip, take, takeUntil, tap } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { LocationService } from "./location.service";
import { CacheService } from "./cache.service";

@Injectable()
export class WeatherService implements OnDestroy {
  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  static CACHED_CONDITIONS_PREFIX = "current-condition";
  static CACHED_FORECAST_PREFIX = "forecast";
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private addOrRemoveLocations$ = this.locationService
    .getLocations()
    .pipe(skip(1));
  private initialLocations$ = this.locationService
    .getLocations()
    .pipe(takeUntil(this.addOrRemoveLocations$));
  private subs: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    private cacheService: CacheService
  ) {
    const sub1 = this.addOrRemoveLocations$.subscribe((locations) => {
      const currentLocations = this.currentConditions().map(
        (currentCondition) => currentCondition.zip
      );
      const [added] = locations.filter(
        (value) => !currentLocations.includes(value)
      );
      const [removed] = currentLocations.filter(
        (value) => !locations.includes(value)
      );

      if (added) this.addCurrentConditions(added);

      if (removed) this.removeCurrentConditions(removed);
    });

    this.subs.push(sub1);

    const sub2 = this.initialLocations$.subscribe((locations) => {
      locations.forEach((loc) => this.addCurrentConditions(loc));
    });

    this.subs.push(sub2);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  addCurrentConditions(zipcode: string): void {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    const cachedCurrentConditions = this.cacheService.load<ConditionsAndZip>(
      `${WeatherService.CACHED_CONDITIONS_PREFIX}_${zipcode}`
    );

    if (!cachedCurrentConditions) {
      this.http
        .get<CurrentConditions>(
          `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
        )
        .subscribe((data) => {
          const currentCondition = { zip: zipcode, data };
          this.currentConditions.update((conditions) => [
            ...conditions,
            currentCondition,
          ]);
          this.cacheService.save<ConditionsAndZip>(
            `${WeatherService.CACHED_CONDITIONS_PREFIX}_${zipcode}`,
            currentCondition,
            120
          );
        });

      return;
    }

    this.currentConditions.update((conditions) => [
      ...conditions,
      cachedCurrentConditions,
    ]);
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    const cachedForecast = this.cacheService.load<Forecast>(
      `${WeatherService.CACHED_FORECAST_PREFIX}_${zipcode}`
    );

    if (!cachedForecast) {
      return this.http
        .get<Forecast>(
          `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
        )
        .pipe(
          tap((forecast) =>
            this.cacheService.save<Forecast>(
              `${WeatherService.CACHED_FORECAST_PREFIX}_${zipcode}`,
              forecast,
              120
            )
          )
        );
    }

    return of(cachedForecast);
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
