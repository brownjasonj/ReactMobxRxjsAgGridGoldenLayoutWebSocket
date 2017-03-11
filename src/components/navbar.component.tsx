import * as React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { WeatherState } from '../state/weather.state';

import { SearchBar } from './search-bar.component';
import { NavBarSearchWeather } from './navbar-search-weather.component';

interface Props {
    weatherState: WeatherState
}

class NavBar extends React.Component<Props, any> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Navbar inverse>
                <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Weather</a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav>
                    <NavItem eventKey={1} href="#">Link</NavItem>
                    <NavItem eventKey={2} href="#">Link</NavItem>
                    <NavBarSearchWeather weatherState={this.props.weatherState}/>
                    <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}>Action</MenuItem>
                        <MenuItem eventKey={3.2}>Another action</MenuItem>
                        <MenuItem eventKey={3.3}>Something else here</MenuItem>
                        <MenuItem divider />c
                        <MenuItem eventKey={3.3}>Separated link</MenuItem>
                    </NavDropdown>
                </Nav>
                <Nav pullRight>
                    <NavItem eventKey={1} href="#">Link Right</NavItem>
                    <NavItem eventKey={2} href="#">Link Right</NavItem>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export { NavBar }