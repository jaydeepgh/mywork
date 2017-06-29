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
import {getAssemblyInfo_DB
        , getPackagingInfo_DB
        , getAssembliesHistoryByDate
        , getAssembliesByDate
        , getAssembliesHistoryByBatchNumberAndByDate
        , setSearchCriteria
        , clearSearchCriteria
        , getPackagesByDate
        , getPackageByAssemblyIdAndByDate
        , getPackagesHistoryByDate    
} from '../../actions/index';
import {AssemblySearchFields} from '../../master_data';


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
        //onChangeFunc = (value) =>{console.log(value);}
        
        return renderFormControl(fieldConfig, key, collection, null, onChangeFunc);
    }

    componentDidMount()
    {
        if(this.props.userstate.id === ''){
            this.context.router.push('/');
        }

        let toDt = new Date();
        let fromDt = new Date(toDt.getTime() - (6 * 24 * 60 * 60 * 1000));
        
        if(this.props.module==='Assembly'){
            this.props.getAssembliesHistoryByDate(fromDt, toDt, this.props.userstate)
            .then(()=>{
                this.setState({loaded:true});
                this.props.getAssembliesByDate(fromDt, toDt, this.props.userstate);
            })
            .catch((err)=>
            {
                console.log(err);
            });
        }
        else{
            this.props.getPackagesHistoryByDate(fromDt, toDt, this.props.userstate)
            .then(()=>{
                this.setState({loaded:true});
                this.props.getPackagesByDate(fromDt, toDt, this.props.userstate);
            })
            .catch((err)=>
            {
                console.log(err);
            });           
        }
    }


    onSubmit(values){
        if(this.props.module === 'Assembly'){
            if(values.SearchCriteria != '' && values.SearchValue != ''){

                this.props.getAssembliesHistoryByDate(values.SearchFromDate
                            , values.SearchToDate, this.props.userstate).then(()=>{
                            this.props.getAssembliesHistoryByBatchNumberAndByDate(values.SearchCriteria
                                    , values.SearchValue
                                    , values.SearchFromDate
                                    , values.SearchToDate
                                    , this.props.userstate)
                            });
  
          }else{
                this.props.getAssembliesHistoryByDate(values.SearchFromDate
                , values.SearchToDate
                , this.props.userstate).then(()=>{
                    this.props.getAssembliesByDate(values.SearchFromDate
                    , values.SearchToDate
                    , this.props.userstate)
                }); 
                
            }
        }
        else{
            if(values.SearchCriteria != '' && values.SearchValue != ''){

                this.props.getPackagesHistoryByDate(values.SearchFromDate
                            , values.SearchToDate, this.props.userstate).then(()=>{
                            this.props.getPackageByAssemblyIdAndByDate(values.SearchCriteria
                                    , values.SearchValue
                                    , values.SearchFromDate
                                    , values.SearchToDate
                                    , this.props.userstate)
                            });
  
          }else{
                this.props.getPackagesHistoryByDate(values.SearchFromDate
                , values.SearchToDate
                , this.props.userstate).then(()=>{
                    this.props.getPackagesByDate(values.SearchFromDate
                    , values.SearchToDate
                    , this.props.userstate)
                }); 
                
            }            
        }
        this.props.setSearchCriteria(values);
    }

    clearSearchCriteria(){
        this.props.clearSearchCriteria();
    }
    render(){
        const {handleSubmit, 
            getAssemblyInfo_DB
            , getPackagingInfo_DB
            , getAssembliesHistoryByDate
            , getAssembliesByDate
            , getAssembliesHistoryByBatchNumberAndByDate 
            , setSearchCriteria
            , clearSearchCriteria
            , getPackagesByDate
            , getPackageByAssemblyIdAndByDate
            , getPackagesHistoryByDate            
        } = this.props; 
            return(
                <MuiThemeProvider>
                    <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <div className="searchPan">
                            <h4>{this.props.module} Search Criteria</h4>
                            <div>
                                <GridList cols={2} cellHeight={85}>
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
                                <div className="col-md-12 text-right">
                                    <ButtonToolbar>
                                        <Button type="submit" bsStyle="primary">Search</Button>
                                        <Button type="reset" bsStyle="danger" onClick={this.clearSearchCriteria.bind(this)}>Clear</Button>                                    
                                    </ButtonToolbar>
                                </div>                            
                            </div> 
                        </div>
                    </form>
                </MuiThemeProvider>
            );
    }
}

SearchPane =  reduxForm({
    form:'SearchForm',
    enableReinitialize: true
})(SearchPane)


SearchPane = connect(state => ({
  userstate : state.userstate,
  initialValues : state.search_criteria
})
,{getAssemblyInfo_DB
, getPackagingInfo_DB
, getAssembliesHistoryByDate
, getAssembliesByDate
, getAssembliesHistoryByBatchNumberAndByDate
, setSearchCriteria
, clearSearchCriteria
, getPackagesByDate
, getPackageByAssemblyIdAndByDate
, getPackagesHistoryByDate
}         
)(SearchPane)

export default SearchPane;