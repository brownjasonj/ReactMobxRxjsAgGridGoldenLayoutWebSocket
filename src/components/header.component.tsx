import * as React from 'react';
import { Column } from 'ag-grid';

interface IHeaderCompParams {

    // the column the header is for
    column: Column;

    // the name to display for the column. if the column is using a headerValueGetter,
    // the displayName will take this into account.
    displayName: string;

    // whether sorting is enabled for the column. only put sort logic into
    // your header if this is true.
    enableSorting: boolean;

    // whether menu is enabled for the column. only display a menu button
    // in your header if this is true.
    enableMenu: boolean;

    // callback to progress the sort for this column.
    // the grid will decide the next sort direction eg ascending, descending or 'no sort'.
    // pass multiSort=true if you want to do a multi sort (eg user has shift held down when they click)
    progressSort(multiSort: boolean): void;

    // callback to set the sort for this column.
    // pass the sort direction to use ignoring the current sort eg one of 'asc', 'desc' or null (for no sort).
    // pass multiSort=true if you want to do a multi sort (eg user has shift held down when they click)
    setSort(sort: string, multiSort?: boolean): void;

    // callback to request the grid to show the column menu.
    // pass in the html element of the column menu to have the 
    // grid position the menu over the button.
    showColumnMenu(menuButton: HTMLElement): void;

    menuIcon: string;
}


class HeaderComponent extends React.Component<IHeaderCompParams, {}> {
    sorted: string;
    menuButton: any;

    constructor(props: IHeaderCompParams) {
        super(props);

        this.props.column.addEventListener('sortChanged', this.onSortChanged.bind(this));

        //The state of this component contains the current sort state of this column
        //The possible values are: 'asc', 'desc' and ''
        this.sorted = '';
    }

    onSortRequested(order: string, event: any) {
        this.props.setSort(order, event.shiftKey);
    };

    onSortChanged (){
        if (this.props.column.isSortAscending()){
            this.sorted = 'asc';
        } else if (this.props.column.isSortDescending()){
            this.sorted = 'desc';
        } else {
            this.sorted = '';
        }
    };

    onMenuClick (){
        this.props.showColumnMenu(this.menuButton);
    };

    render() {
        let sortElements = [];
        if (this.props.enableSorting){
            let downArrowClass = "customSortDownLabel " + (this.sorted === 'desc' ? " active" : "");
            let upArrowClass = "customSortUpLabel " + (this.sorted === 'asc' ? " active" : "");
            let removeArrowClass = "customSortRemoveLabel " + (this.sorted === '' ? " active" : "");

            sortElements.push(<div className={downArrowClass} onClick={this.onSortRequested.bind(this, 'desc')} key='0'><i className="fa fa-long-arrow-down"/></div>)
            sortElements.push(<div className={upArrowClass} onClick={this.onSortRequested.bind(this, 'asc')} key='1'><i className="fa fa-long-arrow-up"/></div>)
            sortElements.push(<div className={removeArrowClass} onClick={this.onSortRequested.bind(this, '')} key='2'><i className="fa fa-times"/></div>)
        }


        if (this.props.enableMenu){
            this.menuButton = <div ref="menuButton" className="customHeaderMenuButton" onClick={this.onMenuClick.bind(this)}><i className={"fa " + this.props.menuIcon}/></div>
        }

        return (<div>
            {this.menuButton}
            <div className="customHeaderLabel">{this.props.displayName}</div>
            {sortElements}
        </div>);
    };

}

export { HeaderComponent }