import React, { Component } from 'react';
import SearchBar from '../containers/search_bar';
import WeatherList from '../containers/weather_list';
import {Link} from 'react-router';

export default class Weather extends Component {
  render() {
    return (
        <div>
            <div className="input-group">
                 <Link to="/">Back to Home</Link>                    
            </div>
            <SearchBar />
            <WeatherList />
        </div>
    );
  }
}
