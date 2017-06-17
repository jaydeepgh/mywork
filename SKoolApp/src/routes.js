import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/app';
import EmployeeDetails from './components/employee_details';
import Landing from './components/landing';


export default(
    <Route path="/" component={App}>
        <IndexRoute component={Landing} />
        <Route path="/teams/:teamid/employees/:employeeid" component={EmployeeDetails} />
    </Route>
);
