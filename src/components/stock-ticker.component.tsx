import * as React from 'react';
import { observer } from 'mobx-react';

import { StockTickerState, Stock } from '../state/stock-ticker.state';

interface Props {
    stocks: StockTickerState;
}

@observer
class StockTicker extends React.Component<Props, {}> {
    private uri: string = "ws://localhost:8025/websockets/stock";

    populateStocks(stocks: string[]) {
        stocks.forEach((stockSymbol) => {
            this.props.stocks.update({
                symbol: stockSymbol,
                description: "",
                value: 0.0,
                lastUpdate: 0
            })
        });
    }

    onSocketEvent(evt: MessageEvent) {
        var received_msg = evt.data;
        var jsonData = JSON.parse(received_msg);
        // console.log("Message received..." + received_msg);
        if (jsonData.hasOwnProperty('stocks')) {
            console.log("Initial population of stocks " + received_msg);
            this.populateStocks(jsonData.stocks);
        }
        else {
            var stock: Stock = jsonData;
            this.props.stocks.update(stock);
        }
    }

    constructor(props: Props) {
        super(props);
        if ("WebSocket" in window)
        {
            console.log("WebSocket is supported by your Browser!");
            
            // Let us open a web socket
            var ws = new WebSocket(this.uri);
            
            ws.onopen = function()
            {
                // Web Socket is connected, send data using send()
                ws.send("open");
                console.log("Message is sent...");
            };
            
            ws.onmessage = this.onSocketEvent.bind(this);
            
            ws.onclose = function()
            { 
                // websocket is closed.
                console.log("Connection is closed..."); 
            };
        }
        
        else
        {
            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }
    }

    handleData(data: string) {
      let result = JSON.parse(data);
      console.log(result);
    }

    render() {
        return (
            <div>
                Stock Ticker
            </div>
        );
    }
}

export { StockTicker }