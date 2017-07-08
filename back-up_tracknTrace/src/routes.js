import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/app';
import AssemblyLineDB from './components/db/assemblyline_db';
import PackagingDB from './components/db/packaging_db';
import Packaging from './components/packaging';
import NewAssembly from './components/assembly_new';
import UserLogin from './components/login';
import NewPackaging from './components/packaging_new';
import Quality from './components/quality';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={UserLogin} />
        <Route path="/Assembly/:id" component={NewAssembly} />
        <Route path="/Assembly" component={AssemblyLineDB} />
        <Route path="/Packaging" component={PackagingDB} />
        <Route path="/Packaging/:id" component={NewPackaging} />
        <Route path="/Quality" component={Quality} />
    </Route>
);