import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import AssemblyLineChart from './assembly_chart_db';
import SearchPane from './search';
import AssemblyLineListDB from './assemblylist_db';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';



class AssemblyLineDB extends Component
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
                    {(this.props.userstate.role === 'Quality') ? '' :<h1 className="ModuleCaption">Track and Trace - Assembly Line</h1>}                    
                    <Panel>
                    <div>
                        <AssemblyLineChart />
                        <SearchPane module="Assembly" />
                    </div>
                    </Panel>
                    <AssemblyLineListDB />
                </div>     
             </MuiThemeProvider>
        );


    }

}

export default connect(state => ({
          userstate : state.userstate
}))(AssemblyLineDB);