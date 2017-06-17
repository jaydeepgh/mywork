import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import PackagingChart from './packaging_chart_db';
import SearchPane from './search';
import PackagingListDB from './packagelist_db';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';



class PackagingDB extends Component
{

    constructor(props){
        super(props);
        this.state = {loaded:false};

    }

    render(){
        //console.log(Date.now());
        return(
             <MuiThemeProvider>
                <div>
                    <h1>Packaging Line</h1>
                    <Panel>
                    <div>
                        <PackagingChart />
                        <SearchPane module="Packaging" />
                    </div>
                    </Panel>
                    <PackagingListDB />
                </div>     
             </MuiThemeProvider>
        );


    }

}

export default PackagingDB;