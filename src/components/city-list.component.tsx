import * as React from 'react';
import { observer } from 'mobx-react';

import { WeatherState } from '../state/weather.state';

import { CityItem } from './city-item.component';

interface Props {
    weatherState : WeatherState
}

@observer
class CityList extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {

        const posts =  this.props.weatherState.cityList.map((name) => {
            return (
                <CityItem name={name} />
            )
        });

        return (
            <ul className="col-md-4 list-group">
            {posts}
            </ul>
        );
    }
}

export { CityList };