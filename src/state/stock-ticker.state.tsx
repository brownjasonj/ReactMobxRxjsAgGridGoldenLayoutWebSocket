import { observable, ObservableMap, IMapChangeUpdate, IMapChangeAdd,  IMapChangeDelete} from 'mobx';

class StockDetails {
    symbol: string;
    description: string;

    constructor(symbol: string, description: string) {
        this.symbol = symbol;
        this.description = description;
    }
}

class StockValue {
    value: number;
    lastUpdate: number;

    constructor(value: number, lastUpdate: number) {
        this.value = value;
        this.lastUpdate = lastUpdate;
    }
}

interface Stock {
    symbol: string;
    description: string;
    value: number;
    lastUpdate: number;
}


class StockTickerState {
    private stockDetails: ObservableMap<StockDetails>;
    private stockValues: ObservableMap<StockValue>;

    constructor() {
        this.stockDetails = new ObservableMap<StockDetails>();
        this.stockValues = new ObservableMap<StockValue>();
    }

    getStockDetails() {
        return this.stockDetails;
    }

    getStockValues() {
        return this.stockValues;
    }

    update(stock: Stock) {
        console.log("Updating :" + stock);

        console.log("Stock symbol = " + stock.symbol);

        if (this.stockDetails.has(stock.symbol)) {
            console.log("Updating value");
            this.stockValues.set(stock.symbol, new StockValue(stock.value, stock.lastUpdate));
        }
        else {
            console.log("New Symbol");
            this.stockDetails.set(stock.symbol, new StockDetails(stock.symbol, stock.description));
            this.stockValues.set(stock.symbol, new StockValue(stock.value, stock.lastUpdate));
        }
    }

    addDetailsObserver(observer: (changes: IMapChangeUpdate<StockDetails> | IMapChangeAdd<StockDetails> | IMapChangeDelete<StockDetails>) => void) {
        this.stockDetails.observe(observer);
    };
    
    addValueChangeObserver(observer: (changes: IMapChangeUpdate<StockValue> | IMapChangeAdd<StockValue> | IMapChangeDelete<StockValue>) => void) {
        this.stockValues.observe(observer);
    }
}

const stockTickerState = new StockTickerState();

export { StockTickerState, StockValue, StockDetails, Stock, stockTickerState}