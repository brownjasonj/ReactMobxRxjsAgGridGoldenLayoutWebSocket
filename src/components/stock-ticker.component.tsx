import * as React from 'react';
import { observer } from 'mobx-react';

import { StockTickerState, Stock } from '../state/stock-ticker.state';

interface Props {
    stocks: StockTickerState;
}

@observer
class StockTicker extends React.Component<Props, {}> {
    private uri: string = "ws://localhost:9003/staticservices/websocket/stock";
    private initialOpen:boolean;

    populateStocks(stocks: string[]) {
        stocks.forEach((stock) => {
            this.props.stocks.update({
                symbol: stock,
                description: "",
                value: 0.0,
                lastUpdate: 0
            })
        });
    }

    onSocketEvent(evt: MessageEvent) {
        var received_msg = evt.data;
        var jsonData = JSON.parse(received_msg);
        console.log("Message is received..." + received_msg);
        if (this.initialOpen) {
            this.initialOpen = false;
            this.populateStocks(jsonData.stocks);
        }
        else {
            this.props.stocks.update(JSON.parse(received_msg));
        }
    }

    constructor(props: Props) {
        super(props);
        this.initialOpen = true;
        if ("WebSocket" in window)
        {
            console.log("WebSocket is supported by your Browser!");
            
            // Let us open a web socket
            var ws = new WebSocket("ws://localhost:8025/websockets/stock");
            
            ws.onopen = function()
            {
                // Web Socket is connected, send data using send()
                ws.send("open");
                console.log("Message is sent...");
            };
            
            ws.onmessage = (evt) => this.onSocketEvent(evt);
            
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