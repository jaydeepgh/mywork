
import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Field,
    reduxForm, 
    formValueSelector} from 'redux-form';

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
//injectTapEventPlugin();

import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';

import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem';
import {FIELDS_PACKAGING} from '../packaging_fields';
import {getPackageById, getAllAssemblyLines, createPackageingItem, updatePackagingLine} from '../actions/index';

import {renderFormControl} from './formcontrols';
import {PackageStatus} from '../master_data';




class NewPackaging extends Component
{

    constructor(props){
        super(props);
        this.state = {loaded:false};

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
        
        //console.log(this.props.userstate);
        if(this.props.params.id=='0'){
            this.props.getPackageById('0', this.props.userstate);
            this.setState({loaded:true});
        }
        else{
            this.props.getPackageById(this.props.params.id, this.props.userstate);
            this.setState({loaded:true});
        }
    }



    onSubmit(values){
            if(this.props.params.id=='0'){
                this.props.createPackageingItem(values, assemblies, this.props.userstate)
                .then(()=>{
                    this.context.router.push('/Packaging');           
                })
                    .catch((err)=>{console.log(err);});
            }
            else
            {
                this.props.updatePackagingLine(values, assemblies, this.props.userstate)
                .then(()=>{
                    this.context.router.push('/Packaging');           
                })
                    .catch((err)=>{console.log(err);});
            }
        }

    getControls(fieldConfig, key)
    {
        let collection = [];
        let onChangeFunc = null;
        switch(fieldConfig.label){
            case 'Holder Assembly ID':
            //var holder = _.filter(this.props.assemblylist,(item)=>{return item.deviceType == 'Holder'});
                //console.log(holder);
                //collection = _.filter(this.props.assemblylist,(item)=>{return item.deviceType == 'Holder' && item.assemblyStatus == '6'});
                onChangeFunc = (value) =>{console.log('holder function');}
                break;   
            case 'Charger Assembly ID':
                //collection = _.filter(this.props.assemblylist,(item)=>{return item.deviceType == 'Charger' && item.assemblyStatus == '6'});
                onChangeFunc = (value) =>{console.log('charger function');}
                break;   
            case 'Packaging Status' :
                collection = (this.props.params.id==='0')?PackageStatus:_.filter(PackageStatus,(x)=>{return x.id !=0});
                onChangeFunc = (value) =>{console.log('status');}
                break;
            default:
                collection = [];
                onChangeFunc = (value) =>{console.log(value);}
                break;
        }
        return renderFormControl(fieldConfig, key, collection, null, onChangeFunc);
    }




    render()
    {

        const {handleSubmit,getPackageById, getAllAssemblyLines, createPackageingItem, updatePackagingLine} = this.props; 
        
        const id = this.props.params.id;

        return(
            <MuiThemeProvider>
                <div>
                    <Link to="/Packaging">Back to Packaging List</Link>
                    <Panel>
                    <h1>{id=='0'? 'Create': 'Update'} Packaging Item</h1>
                    <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <Panel>
                            <div>
                                <GridList cols={3} cellHeight={65}>
                                {_.keys(FIELDS_PACKAGING).map((key)=>{
                                    let field = _.at(FIELDS_PACKAGING,key)[0];                                       
                                            switch(key){
                                                case 'holderAssemblyId':
                                                case 'chargerAssemblyId':
                                                    field.disabled = true;
                                                    field.type = 'input';
                                                    break;
                                                case 'packageStatus':
                                                    field.disabled = false;
                                                    break;
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
                                <div id="top-button-panel" className="row">
                                    <div className="col-md-12 text-right"><Button type="submit" bsStyle="primary">{(id==='0')?'Create':'Update'}</Button></div>
                                </div>  
                    </form>
                    </Panel>
                </div>
            </MuiThemeProvider>
        );
    }
}

NewPackaging =  reduxForm({
    form:'NewPackagingForm',
    enableReinitialize: true

})(NewPackaging)

NewPackaging = connect(
   state => ({
    //assemblylist : state.assembly.assemblylist,   
    //packaginglist : state.packaging.packaginglist,
    initialValues : state.packaging.currentpackaging,
    userstate : state.userstate
  }),
  {getPackageById, getAllAssemblyLines,createPackageingItem, updatePackagingLine}              
)(NewPackaging)



export default NewPackaging;