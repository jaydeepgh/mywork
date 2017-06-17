import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import apidata from './reducer_apicall';

const rootReducer = combineReducers({
  weather : WeatherReducer,
  apidata : apidata    
});

export default rootReducer;
