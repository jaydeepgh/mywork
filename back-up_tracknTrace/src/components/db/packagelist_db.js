import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table, PanelGroup, Button} from 'react-bootstrap';

import {connect} from 'react-redux';
import {Link} from 'react-router';
import {PackageStatus} from '../../master_data';
import {
    BACKEND_APP_URL
    , getAllAssemblyLines
    , getPackagesByDate
    , getPackageByAssemblyIdAndByDate
    , getPackagesHistoryByDate
    , clearSearchCriteria} from '../../actions/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';

import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import {formatedDate, formatedDateTimeFromNum} from '../../dateutil';
import axios, { post } from 'axios';


const ProgressBar = () => (
  <LinearProgress mode="indeterminate" />
);


class PackagingListDB extends Component
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
            
            let res = response.data; 
            
            setTimeout(()=>{
                this.progressClose();
                this.props.clearSearchCriteria();
                if(this.props.search_criteria.SearchCriteria != '' && this.props.search_criteria.SearchValue != ''){
                    this.props.getPackagesHistoryByDate(this.props.search_criteria.SearchFromDate
                    , this.props.search_criteria.SearchToDate, this.props.userstate); 
                    this.props.getPackageByAssemblyIdAndByDate(this.props.search_criteria.SearchCriteria
                            , this.props.search_criteria.SearchValue
                            , this.props.search_criteria.SearchFromDate
                            , this.props.search_criteria.SearchToDate
                            , this.props.userstate);              
                }else{
                    this.props.getPackagesHistoryByDate(this.props.search_criteria.SearchFromDate
                    , this.props.search_criteria.SearchToDate, this.props.userstate);                                
                    this.props.getPackagesByDate(this.props.search_criteria.SearchFromDate
                            , this.props.search_criteria.SearchToDate
                            , this.props.userstate);
                }          
            } ,(res.noofrecord * 10000))
        })
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
    }

    fileUpload(file){
        console.log('calling backend');
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

        if(this.props.userstate.id === ''){
            this.props.getAllAssemblyLines(this.props.userstate);
        }
    }
*/
    render(){

        const {clearSearchCriteria
        , getPackagesByDate
        , getPackageByAssemblyIdAndByDate
        , getPackagesHistoryByDate
       } = this.props;
            let packagedata = '';

            //console.log(this.props.assemblylist.length);
            
            if(this.props.packaginglist.length > 0){
                packagedata = this.props.packaginglist.map((row) =>{
                        return (
                            
                            <Panel>
                                <GridList cols={3} cellHeight={20}>
                                <GridTile><div><span>Assembly ID : </span> {row.caseId} </div></GridTile>
                                <GridTile><div><span>Last Updated : </span> {formatedDateTimeFromNum(row.packageLastUpdateOn)}</div></GridTile>
                                <GridTile><div><span>Status : </span> {_.filter(PackageStatus, _.matches( {'id' : parseInt(row.packageStatus)}))[0].value}</div></GridTile>
                                {(this.props.userstate.role === 'Quality') ? <GridTile></GridTile> 
                                : <GridTile>Edit : <Link to={`/Packaging/${row.caseId}`}><img className="edit_image" src="../../../img/edit1.png" /></Link></GridTile>}
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
                        <Panel header="Upload Packaging file">
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
                    </Panel>
                    }
                    <Panel>       
                        <Panel header="Existing Packaged Items">
                            {packagedata}
                        </Panel>
                    </Panel>                    
                </div>
            </MuiThemeProvider>
        );


    }

}

function mapStateToProps(state){
    return {packaginglist : state.packaging.packaginglist
            // , assemblylist : state.assembly.assemblylist
            , userstate : state.userstate  
    };
}

export default connect(mapStateToProps, {getAllAssemblyLines
    , getPackagesByDate
    , getPackageByAssemblyIdAndByDate
    , getPackagesHistoryByDate
    , clearSearchCriteria})(PackagingListDB);