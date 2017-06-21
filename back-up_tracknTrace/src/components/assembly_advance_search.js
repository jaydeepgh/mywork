import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Field,
    reduxForm, 
    formValueSelector, initialize} from 'redux-form';

import {Panel, 
    Button,
    ButtonToolbar} from 'react-bootstrap';    
import {Link} from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';

import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';
import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem';

import {FIELDS_ADV_SEARCH} from '../common_fields';
//import {createAssemblyLines, getAllAssemblyLines, selectDeviceType,getAssemblyLinesById, updateAssemblyLines} from '../actions/index'

import {renderFormControl} from './formcontrols';
import {AssemblySearchFields} from '../master_data';

class AssemblyAdvanceSearch extends Component{

    constructor(props){
        super(props);
        //this.state = {loaded:false, buttondisabled:true};

    }



    getControls(fieldConfig, key)
    {
        let collection = null;
        let onChangeFunc = null;
        switch(key){
            case 'SearchCriteria':
                collection = AssemblySearchFields;
                onChangeFunc = (value) =>{return;}
                break;   
                                                                             
            default:
                collection = [];
                onChangeFunc = (value) =>{return;}
                break;
        }
        return renderFormControl(fieldConfig, key, collection, null, onChangeFunc);
    }

    onSubmit(values){
        return;
    }

    render(){

        const {handleSubmit 
        } = this.props; 


        return(
            <Panel>
                <Panel header="Advance Search">
                    <div>
                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                            <GridList cols={3} cellHeight={65}>
                            {_.keys(FIELDS_ADV_SEARCH).map((key)=>{
                                let field = _.at(FIELDS_ADV_SEARCH,key)[0];
                                    return <GridTile key={key}>
                                        <div>                                            
                                            {this.getControls(field,key)}
                                        </div> 
                                    </GridTile>                       
                            })}
                            <GridTile><Button type="submit" bsStyle="primary">Search</Button></GridTile>
                            </GridList>
                        </form>
                    </div>
                </Panel>
            </Panel>
        );
    }



}

AssemblyAdvanceSearch =  reduxForm({
    form:'AssemblyAdvanceSearchForm',
    enableReinitialize: true
})(AssemblyAdvanceSearch)

/*
AssemblyAdvanceSearch = connect(   state => ({
    initialValues : state.assembly.currentAssembly,
    deviceType: state.assembly.devicetype,
      userstate : state.userstate
  })
,
  {createAssemblyLines, getAllAssemblyLines, selectDeviceType, getAssemblyLinesById, updateAssemblyLines}               
)(NewAssembly)
*/


export default AssemblyAdvanceSearch;

