import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {FIELDS_SEARCH} from '../../common_fields'
import {Panel, 
    PanelGroup,
      Tabs,
    Tab,
    Button,
ButtonToolbar} from 'react-bootstrap';    
import {Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';

import {renderFormControl} from '../formcontrols';
import {Field,
    reduxForm, 
    formValueSelector, initialize} from 'redux-form';
import {connect} from 'react-redux';
import {getAssemblyInfo_DB, getPackagingInfo_DB, getAssembliesHistoryByDate} from '../../actions/index';


class SearchPane extends Component{

    constructor(props){
        super(props);        
    }
    static get contextTypes() {
        return {
        router: React.PropTypes.object.isRequired,
        };
    }    

    getControls(fieldConfig, key)
    {
        let collection = null;
        let onChangeFunc = null;
        let val = null;

        onChangeFunc = (value) =>{console.log(value);}
        
        return renderFormControl(fieldConfig, key, null, null, onChangeFunc);
    }

    componentDidMount()
    {
        //console.log(this.props.userstate);
        if(this.props.userstate.id === ''){
            this.context.router.push('/');
        }

        let toDt = new Date();
        let fromDt = new Date(toDt.getTime() - (7 * 24 * 60 * 60 * 1000));
        
        if(this.props.module==='Assembly'){
            //this.props.getAssemblyInfo_DB(fromDt,toDt)
            this.props.getAssembliesHistoryByDate(fromDt, toDt, this.props.userstate)
            .then(()=>{
                this.setState({loaded:true});
            })
            .catch((err)=>
            {
                console.log(err);
            });
        }
        else{
            this.props.getPackagingInfo_DB(fromDt,toDt)
            .then(()=>{
                this.setState({loaded:true});
            })
            .catch((err)=>
            {
                console.log(err);
            });            
        }
        
    }


    onSubmit(values){

        if(this.props.module === 'Assembly'){
            //this.props.getAssemblyInfo_DB(values.SearchFromDate, values.SearchToDate)
            this.props.getAssembliesHistoryByDate(values.SearchFromDate, values.SearchToDate, this.props.userstate)
        }
        else{
            this.props.getPackagingInfo_DB(values.SearchFromDate, values.SearchToDate)            
        }
    }


    render(){
        const {handleSubmit, 
            searchDateChange, getAssembliesHistoryByDate 
        } = this.props; 
            return(
                <MuiThemeProvider>
                    <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <div className="searchPan">
                            <h4>Production Date Range</h4>
                            <div>
                                <GridList cols={1} cellHeight={65}>
                                {_.keys(FIELDS_SEARCH).map((key)=>{
                                    let field = _.at(FIELDS_SEARCH,key)[0];
                                        return <GridTile key={key}>
                                            <div>                                            
                                                {this.getControls(field,key)}
                                            </div> 
                                        </GridTile>                       
                                })}
                                </GridList>
                            </div>
                            <div id="top-button-panel" className="row">
                                <div className="col-md-11 text-right"><Button type="submit" bsStyle="primary">Search</Button></div>
                            </div> 
                        </div>
                    </form>
                </MuiThemeProvider>
            );


    }



}

SearchPane =  reduxForm({
    form:'SearchForm',
    initialValues:{SearchFromDate:new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), SearchToDate:new Date()}
})(SearchPane)


SearchPane = connect(state => ({
  userstate : state.userstate
})
,{getAssemblyInfo_DB, getPackagingInfo_DB, getAssembliesHistoryByDate}         
)(SearchPane)

export default SearchPane;