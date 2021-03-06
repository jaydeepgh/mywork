import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table, PanelGroup, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Field,
    reduxForm, 
    formValueSelector, initialize} from 'redux-form';
import {
  TextField
} from 'redux-form-material-ui';
import {Link} from 'react-router';
import {AssemblyStatus} from '../../master_data';
import AssemblyHistory from '../assembly_history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';


import {GridList, GridTile} from 'material-ui/GridList';
import {formatedDate, formatedDateTimeFromNum} from '../../dateutil';
import {getAllAssemblyLines
    , clearSearchCriteria
    , BACKEND_APP_URL
    , getAssembliesHistoryByDate
    , getAssembliesByDate
    , getAssembliesHistoryByBatchNumberAndByDate} from '../../actions/index';

import axios, { post } from 'axios';


const ProgressBar = () => (
  <LinearProgress mode="indeterminate" />
);



class AssemblyLineListDB extends Component
{
    
    constructor(props){
        super(props);
        this.state = {loaded:false, progressopen:false};

        this.state ={
        file:null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        this.progressOpen = this.progressOpen.bind(this);
        this.progressClose = this.progressClose.bind(this);
    }
    
  progressOpen(){
    this.setState({progressopen: true});
  };

  progressClose(){
    this.setState({progressopen: false});
  };


  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.progressOpen();
    this.fileUpload(this.state.file).then((response)=>{
      
      let res = response.data; // JSON.parse(response.data);
      //console.log(res);
      
      setTimeout(()=>{
          this.progressClose();
          //this.setState({file:null});
          //this.props.getAllAssemblyLines(this.props.userstate);
            this.props.clearSearchCriteria();
            if(this.props.search_criteria.SearchCriteria != '' && this.props.search_criteria.SearchValue != ''){
                this.props.getAssembliesHistoryByDate(this.props.search_criteria.SearchFromDate
                , this.props.search_criteria.SearchToDate, this.props.userstate).then(()=>{
                    this.props.getAssembliesHistoryByBatchNumberAndByDate(this.props.search_criteria.SearchCriteria
                            , this.props.search_criteria.SearchValue
                            , this.props.search_criteria.SearchFromDate
                            , this.props.search_criteria.SearchToDate
                            , this.props.userstate);
                }); 
              
            }else{
                this.props.getAssembliesHistoryByDate(this.props.search_criteria.SearchFromDate
                , this.props.search_criteria.SearchToDate, this.props.userstate).then(()=>{
                    this.props.getAssembliesByDate(this.props.search_criteria.SearchFromDate
                            , this.props.search_criteria.SearchToDate
                            , this.props.userstate);
                    })                                

            }          
      } ,(res.noofrecord *10000))
    })
  }
  onChange(e) {
    this.setState({file:e.target.files[0]});

  }
  fileUpload(file){
    const url = `${BACKEND_APP_URL}/api/upload`;
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'uid' : this.props.userstate.id, 
            'role':this.props.userstate.role, 
            'node_url':this.props.userstate.chainnode_url,
            'secureContext' : this.props.userstate.secureContext
        }
    }
    return  post(url,formData,config);
  }

/*    
  componentWillMount(){
    this.props.getAllAssemblyLines(this.props.userstate);
  }
*/
    render(){
        const {getAllAssemblyLines, clearSearchCriteria
        , getAssembliesByDate
        , getAssembliesHistoryByBatchNumberAndByDate
        , getAssembliesHistoryByDate
       } = this.props;
            let assemblydata = '';

            //console.log(this.props.assemblylist.length);
            
            if(this.props.assemblylist.length > 0){
                assemblydata = this.props.assemblylist.map((row) =>{
                        return (
                            
                            <Panel>
                                <GridList cols={3} cellHeight={20}>
                                <GridTile><div><span>Assembly ID : </span> {row.assemblyId} </div></GridTile>
                                <GridTile><div><span>Device Serial No : </span> {row.deviceSerialNo}</div></GridTile>
                                <GridTile><div><span>Device Type : </span> {row.deviceType}</div></GridTile>
                                <GridTile><div><span>Manufacturing Plant : </span> {row.manufacturingPlant}</div></GridTile>
                                <GridTile><div><span>Last Updated : </span> {formatedDateTimeFromNum(row.assemblyDate)}</div></GridTile>
                                <GridTile><div><span>Status : </span> {_.filter(AssemblyStatus, _.matches( {'id' : parseInt(row.assemblyStatus)}))[0].value}</div></GridTile>
                                <GridTile><AssemblyHistory assemblyId={row.assemblyId} type={row.deviceType} /></GridTile>                                                                
                                {(this.props.userstate.role === 'Quality') ? <GridTile></GridTile> 
                                : <GridTile>Edit : <Link to={`/Assembly/${row.assemblyId}`}><img className="edit_image" src="../../../img/edit1.png" /></Link></GridTile>}
                                </GridList>
                            </Panel>
                        );

                })
            }    


        return(
            

        <MuiThemeProvider>
            <div>  
                {(this.props.userstate.role === 'Quality') ? '' :              
                <Panel>
                    <Panel header="Upload Assembly file">
                        <div id="upload-panel">
                        <form onSubmit={this.onFormSubmit}>
                            <GridList cols={2} cellHeight={40}>
                                <GridTile>
                                    <div className="input-group">
                                        <label className="input-group-btn">
                                            <span className="btn btn-primary">
                                                Browse&hellip; <input type="file" className="hide" onChange={this.onChange} / >
                                            </span>
                                        </label>
                                        <input type="text" className="form-control" readonly value={(this.state.file==null)?'':this.state.file.name} />
                                    </div>
                                </GridTile>
                                <GridTile>
                                    <div>
                                        <Button type="submit" bsStyle="primary">Upload File</Button>                                        
                                    </div>                                    
                                </GridTile>                                    
                            </GridList>
                                <div>
                                    <Dialog
                                    title="Please wait..."
                                    modal={false}
                                    open={this.state.progressopen}
                                    >
                                        <ProgressBar />
                                    </Dialog>
                                </div>
                            </form>
                            </div>
                        </Panel>
                </Panel>}
                <Panel>       
                    <Panel header="Existing Assembly Items">
                        {assemblydata}
                    </Panel>
                </Panel>
            </div>
        </MuiThemeProvider>
        );

    }

}





AssemblyLineListDB =  reduxForm({
    form:'UploadAssemblyForm',
    enableReinitialize: true
})(AssemblyLineListDB)

AssemblyLineListDB = connect(   state => (
    {//assemblylist : state.assembly_db.assemblylist,
    assemblylist : state.assembly.assemblylist,
    search_criteria : state.search_criteria,
        userstate : state.userstate
  })
,
  {getAllAssemblyLines, clearSearchCriteria
        , getAssembliesByDate
        , getAssembliesHistoryByBatchNumberAndByDate 
        , getAssembliesHistoryByDate 
  }               
)(AssemblyLineListDB);

export default AssemblyLineListDB;


