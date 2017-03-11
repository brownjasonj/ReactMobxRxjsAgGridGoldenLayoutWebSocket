import * as React from 'react';
import { observable } from 'mobx';

import { WeatherForecastService } from '../services/weather-forecast.service';

import { WeatherState } from '../state/weather.state';

interface Props {
    weatherState: WeatherState
}

class SearchBar extends React.Component<Props, {}> {
    @observable term: string;

    private weatherService : WeatherForecastService;

    constructor(props: Props) {
        super(props);
        
        this.weatherService = new WeatherForecastService();

        // What on earth?  A completely silly hack for some problem.....
        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onInputChange(event: any): void {
        this.term = event.target.value;
    }

    onFormSubmit(event: any): void {
        event.preventDefault();

        this.weatherService.getWeather(this.term, "uk").subscribe(
            (data : any) => {
                if (data.response.statusCode === 200) {
                    // We need to go and get weather data
                    this.props.weatherState.addCityWeather(data.body);

                    //data.body.map((post : Post) => this.props.postsState.addPost(post));

                }
            },
            (err : string) => console.error(err) // Show error in console 
            );

        this.term = "";
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit} className="input-group">
                <input
                    placeholder="City"
                    className="form-control"
                    value={this.term}
                    onChange={this.onInputChange}
                />
                <span className="input-group-btn">
                    <button type="submit" className="btn btn-secondary">Search</button>
                </span>
            </form>  
        );
    }
}

export { SearchBar };