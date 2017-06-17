import React from 'react';
import {Link} from 'react-router';

const Landing = () =>
<div>
    <div className="input-group">
        <Link to="/weather" className="btn btn-primary">Get Weather information</Link>
        </div>
    <div className="input-group">
        <Link to="/callapi" className="btn btn-primary">Call an API</Link>
    </div>
</div>
export default Landing;