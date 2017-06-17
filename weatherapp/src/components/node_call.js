import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {callApi} from '../actions/index'


class CallAPI extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {term:''};
        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }


    onInputChange(event)
    {
        this.setState({term:event.target.value});
    }

    onFormSubmit(event)
    {
        event.preventDefault();
        this.props.callApi({'name' : this.state.term});
        this.setState({term:''});
    }




    render()
    {
        //console.log(this.props.apidata.data);
//typeof elem != 'undefined'
        if(this.props.apidata.data == ''){
            return(
                <div>
                    <div className="input-group">
                        <Link to="/">Back to Home</Link>                    
                    </div>
                    <h2>Call an API via another Node.js App</h2>
                    <form onSubmit={this.onFormSubmit} className="input-group">
                        <div className="input-group">
                        <input 
                            placeholder="Enter your name"
                            className="form-control"
                            value={this.state.term}
                            onChange={this.onInputChange}
                            />
                           </div>

                        <div className="input-group">
                            <button type="submit" className="btn btn-primary">Go</button>
                        </div>
                    </form>
                </div>
            );
        }else{
            return(
                <div>
                    <div className="input-group">
                        <Link to="/">Back to Home</Link>                    
                    </div>
                    <h2>Call an API via another Node.js App</h2>
                    <div>{this.props.apidata}</div>

            </div>);   

        }
    }
}

function mapStateToProp({apidata})
{
    //console.log(apidata.data);
    	return {apidata};
}
export default connect(mapStateToProp,{callApi})(CallAPI);

