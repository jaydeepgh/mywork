import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Modal,Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Field,
    reduxForm, 
    formValueSelector} from 'redux-form';

import {
  TextField
} from 'redux-form-material-ui';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import {UserInfo} from '../master_data';

import {setUserState} from '../actions/index';

const validate = values => {
  const errors = {}
  const requiredFields = [ 'username', 'password' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  return errors
}


class UserLogin extends Component{

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }


    onSubmit(values){
        var validuser = false;
        var role = '';
        var id = '';
        var chainnode = null;
        var secureContext = '';
        _.each(UserInfo,(user)=>{
           if(user.id == values.username && user.passcode == values.password){
               validuser = true;
               role = user.role;
               id = user.id;
               chainnode = user.chainnode;
               secureContext = user.secureContext;
           } 
        })
        if(validuser){
            this.props.setUserState(id,role,chainnode,secureContext);
                this.context.router.push(`/${role}`);
            

        }else{
            alert('Invalid user credentials');
        }
    }

    render(){
        const {handleSubmit} = this.props;   
        return(
            <div className="static-modal">
                <MuiThemeProvider>

                <Modal.Dialog bsSize="small">
                <Modal.Header>
                    <Modal.Title>Track and Trace - Login</Modal.Title>
                </Modal.Header>
                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>

                <Modal.Body>
                    <div>
                            <div>
                          <Field
                            name="username"
                            component={TextField}
                            hintText="User Name"                            
                            floatingLabelText="User Name"
                            disabled={false} 
                            type="text"
                            errorText={this.touched && this.error}
                        /></div>
                        <div>
                         <Field
                            name="password"
                            component={TextField}
                            hintText="Password"                            
                            floatingLabelText="Password"
                            disabled={false} 
                            type="password"
                            errorText={this.touched && this.error}                            
                        />

                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="primary" type="submit">Login</Button>
                </Modal.Footer>
                        </form>

                </Modal.Dialog>
                </MuiThemeProvider>
            </div>
        );


    }




}

UserLogin =  reduxForm({
    form:'UserLoginForm',
    validate
})(UserLogin)

UserLogin = connect(null,
  {setUserState}               
)(UserLogin)

export default UserLogin;