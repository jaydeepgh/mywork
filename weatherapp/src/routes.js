import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/app';
import Landing from './components/landing';
import Weather from './components/weather';
import CallAPI from './components/node_call';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={Landing} />
        <Route path="/weather" component={Weather} />
        <Route path="/callapi" component={CallAPI} />
    </Route>
);
