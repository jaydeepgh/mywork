import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Field,
    reduxForm, 
    formValueSelector, initialize} from 'redux-form';

import {Panel, 
    PanelGroup,
      Tabs,
    Tab,
    Button,
ButtonToolbar} from 'react-bootstrap';    
import {Link} from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';

import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem';
import {FIELDS_ASSEMBLY,FIELDS_HOLDER,FIELDS_CHARGER} from '../assembly_fields';
import {createAssemblyLines, getAllAssemblyLines, selectDeviceType,getAssemblyLinesById, updateAssemblyLines} from '../actions/index'

import {renderFormControl} from './formcontrols';
import {DeviceType, AssemblyStatus} from '../master_data';



class NewAssembly extends Component
{

    constructor(props){
        super(props);
        this.state = {loaded:false, buttondisabled:true};

    }
    static get contextTypes() {
        return {
        router: React.PropTypes.object.isRequired,
        };
    }

    componentDidMount(){
        if(this.props.userstate.id === ''){
            this.context.router.push('/');
        }
        if(this.props.params.id!='0'){
            this.props.getAssemblyLinesById(this.props.params.id, this.props.userstate)
            .then(()=>{
                this.setState({loaded:true});
            });
        }
        else{
            this.props.getAssemblyLinesById(this.props.params.id, this.props.userstate);
            this.setState({loaded:true});
        }
    }



    onSubmit(values){

        if(this.props.params.id ==='0'){
            this.props.createAssemblyLines(values, this.props.userstate)
            .then((res)=>{
                    this.context.router.push('/Assembly');
            })
            .catch((err)=>{console.log(err);});
        }else{
            this.props.updateAssemblyLines(values, this.props.userstate)
            .then((res)=>{
                    this.context.router.push('/Assembly');
            })
            .catch((err)=>{console.log(err);});
        }


    }

    getControls(fieldConfig, key)
    {
        let collection = null;
        let onChangeFunc = null;
        switch(fieldConfig.label){
            case 'Device Type':
                collection = DeviceType;
                onChangeFunc = (value) =>{this.props.selectDeviceType(value); this.setState({buttondisabled:false});}
                break;   
            case 'Assembly Status':
                collection = AssemblyStatus;
                onChangeFunc = (value) =>{this.setState({buttondisabled:false});}
                break;                                                                               
            default:
                collection = [];
                onChangeFunc = (value) =>{this.setState({buttondisabled:false});}
                break;
        }
        return renderFormControl(fieldConfig, key, collection, null, onChangeFunc);
    }




    render()
    {

        const {handleSubmit, 
            createAssemblyLines, 
            getAllAssemblyLines, 
            selectDeviceType, 
            getAssemblyLinesById 
            , updateAssemblyLines
        } = this.props; 
        
        const id = this.props.params.id;
         //console.log('id : ' + id);
        return(
            <MuiThemeProvider>
                <div>
                    <Link to="/Assembly">Back to Assembly List</Link>
                    <Panel>
                    <h1>{id==='0'? 'Create': 'Update'} Assembly Item</h1>
                    <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <Panel>
                            <div>
                                <GridList cols={3} cellHeight={65}>
                                {_.keys(FIELDS_ASSEMBLY).map((key)=>{
                                    let field = _.at(FIELDS_ASSEMBLY,key)[0];
                                    //alert(this.props.initialValues.assemblyStatus); 
                                    //console.log(this.props.initialValues.assemblyStatus);
                                    if(this.props.initialValues.assemblyStatus != '' && parseInt(this.props.initialValues.assemblyStatus) >= 6){field.disabled = true;}else{
                                            if(key!='assemblyId' && key!= 'assemblyLastUpdateOn' )
                                            field.disabled = false;
                                            }                                  
                                    if(id==='0'){
                                        switch(key){
                                            case 'assemblyStatus':
                                                field.disabled = true;
                                                break;
                                        }
                                    }
                                        return <GridTile key={key}>
                                            <div>                                            
                                                {this.getControls(field,key)}
                                            </div> 
                                        </GridTile>                       
                                })}
                                </GridList>
                            </div>

                        </Panel>
                        {this.props.deviceType=='Holder'?                        
                        <Panel>
                            <div>
                                <GridList cols={3} cellHeight={65}>
                                {_.keys(FIELDS_HOLDER).map((key)=>{
                                    let field = _.at(FIELDS_HOLDER,key)[0];
                                        if(this.props.initialValues.assemblyStatus != '' && parseInt(this.props.initialValues.assemblyStatus) >= 6){field.disabled = true;}else{                                            
                                            field.disabled = false;
                                            } 
                                        return <GridTile key={key}>
                                            <div>                                            
                                                {this.getControls(field,key)}
                                            </div> 
                                        </GridTile>                       
                                })}
                                </GridList>
                            </div>

                        </Panel>:''}
                        {this.props.deviceType=='Charger'?                        
                        <Panel>
                            <div>
                                <GridList cols={3} cellHeight={65}>
                                {_.keys(FIELDS_CHARGER).map((key)=>{
                                    let field = _.at(FIELDS_CHARGER,key)[0];
                                        if(this.props.initialValues.assemblyStatus != '' && parseInt(this.props.initialValues.assemblyStatus) >= 6){field.disabled = true;}else{                                            
                                            field.disabled = false;
                                            } 
                                        return <GridTile key={key}>
                                            <div>                                            
                                                {this.getControls(field,key)}
                                            </div> 
                                        </GridTile>                       
                                })}
                                </GridList>
                            </div>

                        </Panel>:''}                        
                                <div id="top-button-panel" className="row">
                                    <div className="col-md-12 text-right"><Button type="submit" bsStyle="primary" disabled = {this.state.buttondisabled}>{id ==='0'?'Create' : 'Update'}</Button></div>
                                </div>  
                    </form>
                    </Panel>
                </div>
            </MuiThemeProvider>
        );
    }
}

NewAssembly =  reduxForm({
    form:'NewAssemblyForm',
    enableReinitialize: true
})(NewAssembly)

NewAssembly = connect(   state => ({
    initialValues : state.assembly.currentAssembly,
    deviceType: state.assembly.devicetype,
      userstate : state.userstate
  })
,
  {createAssemblyLines, getAllAssemblyLines, selectDeviceType, getAssemblyLinesById, updateAssemblyLines}               
)(NewAssembly)



export default NewAssembly;