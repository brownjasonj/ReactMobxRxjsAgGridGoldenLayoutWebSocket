import * as React from 'react';
import { Observable } from 'rxjs';
import { RxHR } from '@akanass/rx-http-request';

import { City } from '../types/city.type';
import { WeatherData } from '../types/weather-data.type';

interface WeatherForecast {
    city : City
    list : WeatherData[];
}

class WeatherForecastService {
    private static API_KEY: string = "b34037c48d2a927f6e3948abd61eba67";
    private static ROOT_URL: string = `http://api.openweathermap.org/data/2.5/forecast?appid=${WeatherForecastService.API_KEY}`;

    constructor() {
    }

    getWeather(city: string, countrycode: string) : any {
        const url = `${WeatherForecastService.ROOT_URL}&q=${city},${countrycode}`;

        console.log("Request: " + url);

        return RxHR.get(`${url}`, {json: true});
    }
}

export { WeatherForecastService, WeatherForecast};