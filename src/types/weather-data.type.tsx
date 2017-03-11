interface WeatherData {
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    }
};

export { WeatherData }