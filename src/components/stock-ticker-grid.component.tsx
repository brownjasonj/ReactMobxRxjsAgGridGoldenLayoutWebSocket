import * as React from "react";
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { AgGridReact } from 'ag-grid-react';

import { HeaderComponent } from './header.component';

import { StockTickerState, Stock, StockValue, StockDetails } from '../state/stock-ticker.state';

interface Props {
    stocks: StockTickerState;
}

class StockTickerGrid extends React.Component<Props, {}> {
    private columnDefs: any[] = [
        {
            headerName: "Symbol", field: "synbol", enablePivot: true,
                    width: 130, filter: 'text'
        },
        {
            headerName: "Description", field: "description", enablePivot: true,
                    width: 130, filter: 'text'
        },
        {
            headerName: "Value", field: "value", enablePivot: true,
                    width: 130
        },
        {
            headerName: "Last Upated", field: "lastUdpate", enablePivot: true,
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

    onStockDetailChange(change: any) {
        var symbol:string = change.name;
        var stockDetail:StockDetails = change.newValue;
        console.log("Grid onStockDetailChange " + JSON.stringify(stockDetail));

        // at the end of the update below, this array will
        // have all of the items that we updated
        var updatedNodes:any[] = [];
        // look for all the 'Jillian' nodes
        this._gridOptions.api.forEachNode((node:any) => {
            var data = node.data;
            if (data.symbol == stockDetail.symbol) {
                console.log("Symbol change: " + stockDetail.symbol);
                data.symbol = stockDetail.symbol
                data.description = stockDetail.description;
                updatedNodes.push(node);
            }
        });
        // now tell the grid it needs refresh all these rows
        //this._gridOptions.api.refreshCells(updatedNodes, ['value']);
        console.log("Nodes being updated " + updatedNodes);

        if (updatedNodes.length == 0) {
            // length 0 means the symbol is not in the grid, so it needs to be added
            var stockDetail:StockDetails = this.props.stocks.getStockDetails().get(symbol);
            var stock:Stock = {symbol: symbol, description: stockDetail.description, value: 0.0, lastUpdate: 0};
            console.log("Added new row to grid " + JSON.stringify(stock));
            this._gridOptions.api.addItems([stock]);
            this._gridOptions.api.refreshRows([stock]);
        }
        else {
            this._gridOptions.api.refreshCells(updatedNodes, ['symbol', 'description']);
        }
    }

    onStockValueChange(change: any) {
        var symbol: string = change.name;
        var stockValue:StockValue = change.newValue;

        console.log("Grid onStockValueChange symbol " + symbol + " value " + JSON.stringify(stockValue))

        // at the end of the update below, this array will
        // have all of the items that we updated
        var updatedNodes:any[] = [];
        // look for all the 'Jillian' nodes
        this._gridOptions.api.forEachNode((node:any) => {
            var data = node.data;
            if (data.symbol == symbol) {
                data.value = stockValue.value;
                data.lastUpdate = stockValue.lastUpdate;
                updatedNodes.push(node);
            }
        });

        if (updatedNodes.length == 0) {
            // length 0 means the symbol is not in the grid, so it needs to be added
            var stockDetail:StockDetails = this.props.stocks.getStockDetails().get(symbol);
            var stock:Stock = {symbol: symbol, description: stockDetail.description, value: stockValue.value, lastUpdate: stockValue.lastUpdate};
            console.log("Added new row to grid " + JSON.stringify(stock));
            this._gridOptions.api.addItems([stock]);
            this._gridOptions.api.refreshRows([stock]);
        }
        else {
            // now tell the grid it needs refresh all these rows
            this._gridOptions.api.refreshCells(updatedNodes, ['value', 'lastUpdate']);
        }
    }

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

        this.props.stocks.addDetailsObserver(this.onStockDetailChange.bind(this));
        this.props.stocks.addValueChangeObserver(this.onStockValueChange.bind(this));

    }

    @computed get stockList() {
        const stockDetails = this.props.stocks.getStockDetails();
        const stockValues = this.props.stocks.getStockValues();      
        
        const stockList: Stock[] = [];
        
        stockValues.forEach((value, key, object) => {
            console.log("StockList value " + value);
            console.log("StockList key " + key);
            console.log("StockList object " + object);
            console.log("StockList symbols " + stockDetails.keys());
            var stockValue:StockValue = stockValues.get(key);
            console.log("StockList StockValue " + stockValue);
            
            stockList.concat({
                'symbol': stockDetails.get(key).symbol,
                'description': stockDetails.get(key).description,
                'value': value.value,
                'lastUpdate': value.lastUpdate
            });
        });

        console.log(stockList);
        return stockList;
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
    }

    onRefreshData() {
        console.log(this.stockList);
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
                        rowData={this.stockList}

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

export { StockTickerGrid }

                // {topHeaderTemplate}
                // {bottomHeaderTemplate}
