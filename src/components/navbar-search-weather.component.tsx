import * as React from 'react';
import { Navbar, FormGroup, FormControl, Button, } from 'react-bootstrap';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { WeatherState } from '../state/weather.state';
import { WeatherForecastService } from '../services/weather-forecast.service';

interface Props {
    weatherState: WeatherState
}

@observer
class NavBarSearchWeather extends React.Component<Props, any> {
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
        // pullLeft doesn't seem to be part of type defs?
        return(
            <Navbar.Form pullRight > 
                <form onSubmit={this.onFormSubmit}>
                        <FormGroup controlId="search">
                            <FormControl
                                type="text"
                                placeholder="Search City Weather" 
                                value={this.term}
                                onChange={this.onInputChange}                        
                            />
                        </FormGroup>
                        {' '}
                        <Button type="submit">Submit</Button>
                </form>
            </Navbar.Form>
        );
    }
}

export { NavBarSearchWeather }