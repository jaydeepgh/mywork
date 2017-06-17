import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {clearUserState} from '../actions/index';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';




class App extends Component {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
  }
  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  logout(){
    this.props.clearUserState();
    this.context.router.push('/');
  }

  render() {
    return (
      <div>
        {this.props.userstate.id===''?'':<div className="logout"><i>[user - {this.props.userstate.id}]</i> :<Button bsStyle="link" onClick={this.logout}>Log-Out</Button></div>}
       {this.props.children}
      </div>
    );
  }
}

function mapStateToProps({userstate}){
  return {userstate}
}


export default connect(mapStateToProps,{clearUserState})(App)