import React, {Component} from 'react';
import {connect} from 'react-redux';
import Chart from '../components/chart';
import GoogleMap from '../components/google_map';


class WeatherList extends Component
{

    renderWeather(cityData)
    {
        //console.log(cityData);
        const name = cityData.city.name;
        const temp = _.map(cityData.list.map(weather => weather.main.temp), (temp) => temp - 273.15);
        const pressure = cityData.list.map(weather => weather.main.pressure);
        const humidity = cityData.list.map(weather => weather.main.humidity);
        const {lat, lon} = cityData.city.coord;
        return(
            <tr key={name}>
                <td><GoogleMap lat={lat} lon={lon} /></td>
                <td><Chart data={temp} color="green" unit="C" /></td>
                <td><Chart data={pressure} color="orange" unit="hPa"/></td>
                <td><Chart data={humidity} color="black" unit="%" /></td>
            </tr>
        );
    }
        render()
    {
        return(

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Temperature (C)</th>
                        <th>Pressure (hPa)</th>
                        <th>Humidity (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.weather.map(this.renderWeather)}
                </tbody>
            </table>
        );

    }
}


function mapStateToProps({weather})
{
    return {weather}; //{weather : state.weather};
}

export default connect(mapStateToProps)(WeatherList);