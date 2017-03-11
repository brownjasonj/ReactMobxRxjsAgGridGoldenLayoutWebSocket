import * as React from 'react';
import { observer } from 'mobx-react';

import { WeatherState } from '../state/weather.state';

interface Props {
    name : string
}

@observer
class CityItem extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <li>
                Title : { this.props.name }
            </li>
        );
    }
}

export { CityItem }