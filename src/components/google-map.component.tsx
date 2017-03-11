import * as React from 'react';
import * as ReactGoogleMaps from 'react-google-maps';
import { observer } from 'mobx-react';

import { City } from '../types/city.type';
import { WeatherState } from '../state/weather.state';

interface Props {
    weatherState: WeatherState
}

@observer
class GoogleMap extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const city: City = this.props.weatherState.getSelectedCity;
        if (!city) 
            return (<div> No Map Available </div>);
        console.log("Change City to " + city.name);
        return (
            <ReactGoogleMaps.GoogleMapLoader
                containerElement={<div style={{height: '200px',width: '250px'}}/>}
                googleMapElement={
                    <ReactGoogleMaps.GoogleMap defaultZoom={12} defaultCenter={{lat: city.coord.lat, lng: city.coord.lon}} />
                }
            />
        );
    }
}

export { GoogleMap }