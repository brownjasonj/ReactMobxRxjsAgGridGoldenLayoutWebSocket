import { observable, computed} from 'mobx';

import {  WeatherForecast } from '../services/weather-forecast.service';

import { City } from '../types/city.type';

class WeatherState {
    @observable cityWeather: Map<string, WeatherForecast>;
    @observable cities: string[];
    @observable _selectedCity: City; 

    constructor () {
        this.cityWeather = new Map<string, WeatherForecast>();
        this.cities = [];
        this._selectedCity = null;
    }

    @computed public get cityList() : string[]{
        return this.cities;
    }

    addCityWeather(weather : WeatherForecast) {
        this.cityWeather.set(weather.city.name, weather);
        this.cities.push(weather.city.name);
        console.log(`Add city ${weather.city.name}, ${weather.list}`);
    }

    public set selectedCity(cityName: string) {
        console.log(`Setting selected city to ${cityName}`);
        this._selectedCity = this.cityWeather.get(cityName).city;
    }

    @computed public get selectedCityName() {
        return this._selectedCity.name;
    }

    @computed public get getSelectedCity(): City {
        return this._selectedCity;
    }
}

const weatherState = new WeatherState();

export { weatherState, WeatherState }