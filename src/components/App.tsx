import * as React from 'react'
import { observer, inject } from 'mobx-react';
import * as GoldenLayout from 'golden-layout';

import { WeatherForecastService, WeatherForecast } from '../services/weather-forecast.service';

import { WeatherState } from '../state/weather.state';

import { SearchBar } from './search-bar.component';
import { CityList } from './city-list.component';
import { CityWeatherGrid } from './cityweather-grid.component';
import { NavBar } from './navbar.component';
import { GoogleMap } from './google-map.component';

interface Props {
    store : WeatherState ;
};

@inject("store")
class App extends React.Component<any, {}> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = () => {
        const TestComponent = React.createClass({
            render: function() {
                return (<h1>test component 2</h1>)
            }
        })
        const layoutConfig = {
        content: [
            {
                type: 'row',
                content: [           
                    {
                        type: 'column',
                        content:[
                            {
                                type:'react-component',
                                component: 'weathergrid',
                                props: {weatherState: this.props.store}
                            },
                            {
                                type:'react-component',
                                component: 'navbar',
                                props: {weatherState: this.props.store}
                            },
                            {
                                type:'react-component',
                                component: 'map',
                                props: {weatherState: this.props.store}
                            }
                        ]
                    },
                    {
                        type: 'column',
                        content:[
                            {
                                type:'react-component',
                                component: 'map',
                                props: {weatherState: this.props.store}
                            }
                        ]
                    }                
        ]
        }]};
        const geschaefteLayout = new GoldenLayout(layoutConfig);
        geschaefteLayout.registerComponent('navbar', NavBar);
        geschaefteLayout.registerComponent('weathergrid', CityWeatherGrid);
        geschaefteLayout.registerComponent('map', GoogleMap); 
    }

    render() {

        return (
            <div>
                <NavBar weatherState = {this.props.store} />
                <CityWeatherGrid weatherState = {this.props.store} />
                <GoogleMap weatherState = {this.props.store} />
            </div>
        );
    }
}

export { App };