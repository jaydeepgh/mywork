import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AssemblyLineDB from './db/assemblyline_db'
import PackagingDB from './db/packaging_db'


import SwipeableViews from 'react-swipeable-views';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 0
  }
  , tabcontainer: {
      height : 'auto'
  }
};

export default class Quality extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange(value){
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
        <MuiThemeProvider>
      <div id="q1">
            <h1 className="ModuleCaption">Track and Trace - Quality Assurance</h1>
          
        <Tabs id="q2"
          onChange={this.handleChange.bind(this)}
          value={this.state.slideIndex}
        >
          <Tab label="Assembly Line" value={0} />
          <Tab label="Package Line" value={1} />
        </Tabs>
        <SwipeableViews id="qa3" style={styles.tabcontainer}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
            <AssemblyLineDB />
          </div>
          <div style={styles.slide}>
            <PackagingDB />
          </div>
        </SwipeableViews>
      </div>
      </MuiThemeProvider>
    );
  }
}