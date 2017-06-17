import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {PackageStatus} from '../../master_data';
import {getAllAssemblyLines} from '../../actions/index';

class PackagingListDB extends Component
{
    
    constructor(props){
        super(props);
        this.state = {loaded:false};

    }

    componentWillMount(){

        if(this.props.userstate.id === ''){
            this.props.getAllAssemblyLines(this.props.userstate);
        }
    }

    render(){
        //console.log('Packaging List');

        //if(typeof this.state.loaded != undefined && this.state.loaded == true){
            let packagingdata = '';
  //console.log(PackagingStatus);

            if(this.props.packaginglist.length > 0 && this.props.assemblylist.length > 0){
  
                packagingdata = this.props.packaginglist.map((row) =>{
  //{_.filter(PackageStatus, _.matches( {'id' : parseInt(row.packageStatus)}))[0].value}
  //console.log(row.packageStatus);
                        return (
                            <tr>
                                <td>{row.caseId}</td>
                                <td>{_.filter(this.props.assemblylist,_.matches({'assemblyId' :row.holderAssemblyId}))[0].deviceSerialNo}</td>
                                <td>{_.filter(this.props.assemblylist,_.matches({'assemblyId' :row.chargerAssemblyId}))[0].deviceSerialNo}</td>
                                <td>{_.filter(PackageStatus, _.matches( {'id' : parseInt(row.packageStatus)}))[0].value}</td>
                                <td>{row.packageCreationDateView}</td>
                                <td><Link to={`/Packaging/${row.caseId}`}><img className="edit_image" src="../../../img/edit1.png" /></Link></td>
                            </tr>
                        );

                })
            } 

            return(

                <div>
                    
                    <Panel>
                        <div id="top-button-panel" className="row">
                            <div className="col-md-12 text-right"><Link to="/Packaging/0" className="btn btn-primary">Create New Item</Link></div>
                        </div>                
                        <Panel header="Existing Packaging Items">
                            <Table striped bordered condensed hover>
                                <thead>
                                <tr>
                                    <th>Case ID</th>
                                    <th>Holder ID</th>
                                    <th>Charder ID</th>
                                    <th>Status</th>
                                    <th>Packaging date</th>
                                    <th>Edit</th>
                                </tr>
                                </thead>
                                <tbody>{packagingdata}
                                </tbody>
                            </Table>
                        </Panel>
                    </Panel>

                </div>

            );



        //}else{
        //    return <div></div>
        //}

    }

}

function mapStateToProps(state){
    return {packaginglist : state.packaging_db.packaginglist,
            assemblylist : state.assembly.assemblylist,
            userstate : state.userstate  
    };
}

export default connect(mapStateToProps, {getAllAssemblyLines})(PackagingListDB);