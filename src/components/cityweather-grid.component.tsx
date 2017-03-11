import * as React from "react";
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { AgGridReact } from 'ag-grid-react';

import { WeatherState } from '../state/weather.state';
import { WeatherForecast } from '../services/weather-forecast.service';

import { HeaderComponent } from './header.component';

interface Props {
    weatherState : WeatherState;
}

@observer 
class CityWeatherGrid extends React.Component<Props, {}> {
    private columnDefs: any[] = [
        {
            headerName: "City", field: "name", enablePivot: true,
                    width: 130, filter: 'text'
        },
        {
            headerName: "Country", field: "country", enablePivot: true,
                    width: 130, filter: 'text'
        },
        {
            headerName: "Population", field: "population", enablePivot: true,
                    width: 130
        },
        {
            headerName: "Longitude", field: "lon", enablePivot: true,
                    width: 130
        },
        {
            headerName: "Latitude", field: "lat", enablePivot: true,
                    width: 130
        }
   ];



    private _icons: any = {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            };

    private _showGrid: boolean;
    private _showToolPanel: boolean;
    private _quickFilterText: string;
    private _gridOptions: any;
    private _api: any;
    private _columnApi: any;

    constructor(props: Props) {
        super(props);
            
        this._quickFilterText = null,
        this._showGrid = true,
        this._showToolPanel = false,

        // the grid options are optional, because you can provide every property
        // to the grid via standard React properties. however, the react interface
        // doesn't block you from using the standard JavaScript interface if you
        // wish. Maybe you have the gridOptions stored as JSON on your server? If
        // you do, the providing the gridOptions as a standalone object is just
        // what you want!
        this._gridOptions = {
            //We register the react date component that ag-grid will use to render
            //dateComponentFramework:MyReactDateComponent,
            // dateComponentFramework:MyReactDateComponent,
            // this is how you listen for events using gridOptions
            onModelUpdated: function () {
                console.log('event onModelUpdated received');
            },
            defaultColDef : {
                headerComponentFramework : HeaderComponent,
                headerComponentParams : {
                    menuIcon: 'fa-bars'
                }
            },
            // this is a simple property
            rowBuffer: 10 // no need to set this, the default is fine for almost all scenarios
        };
    }

    @computed get cityList() {
        const cities: any[] = this.props.weatherState.cityList.map((name) => {
                            const weatherData: WeatherForecast = this.props.weatherState.cityWeather.get(name);
                            return {
                                'name': weatherData.city.name, 
                                'country': weatherData.city.country,
                                'lon': weatherData.city.coord.lon,
                                'lat': weatherData.city.coord.lat,
                                'population': weatherData.city.population
                            }
                            });
        console.log(cities);
        return cities;
    }

    onShowGrid(show: any) {
        this._showGrid = show;
    }

    onToggleToolPanel(event: any) {
        this._showToolPanel = event.target.checked;
    }

    onGridReady(params: any) {
        this._api = params.api;
        this._columnApi = params.columnApi;
    }

    selectAll() {
        this._api.selectAll();
    }

    deselectAll() {
        this._api.deselectAll();
    }

    setCountryVisible(visible: any) {
        this._columnApi.setColumnVisible('country', visible);
    }

    onQuickFilterText(event: any) {
        this._quickFilterText = event.target.value;
    }

    onCellClicked(event: any) {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    }

    onRowSelected(event: any) {
        console.log('onRowSelected: ' + event.node.data.name);
        this.props.weatherState.selectedCity = event.node.data.name;
    }

    onRefreshData() {
        console.log(this.cityList);
    }

    render() {
        var gridTemplate: any;

        // showing the bottom header and grid is optional, so we put in a switch
        if (this._showGrid) {
            gridTemplate = (
                <div style={{height: 200}} className="ag-fresh">
                    <AgGridReact
                        // gridOptions is optional - it's possible to provide
                        // all values as React props
                        gridOptions={this._gridOptions}

                        // listening for events
                        onGridReady={this.onGridReady.bind(this)}
                        onRowSelected={this.onRowSelected.bind(this)}
                        onCellClicked={this.onCellClicked.bind(this)}

                        // binding to simple properties
                        showToolPanel={this._showToolPanel}
                        quickFilterText={this._quickFilterText}

                        // binding to an object property
                        icons={this._icons}

                        // binding to array properties
                        columnDefs={this.columnDefs}
                        rowData={this.cityList}

                        // no binding, just providing hard coded strings for the properties
                        suppressRowClickSelection="false"
                        rowSelection="multiple"
                        enableColResize="true"
                        enableSorting="true"
                        enableFilter="true"
                        groupHeaders="false"
                        rowHeight="20"
                        debug="true"
                    />
                </div>
            );
        }

        return (<div style={{width: '650px'}}>
            <div style={{padding: '4px'}}>
                {gridTemplate}
            </div>
        </div>);
    }

}

export { CityWeatherGrid }

                // {topHeaderTemplate}
                // {bottomHeaderTemplate}
