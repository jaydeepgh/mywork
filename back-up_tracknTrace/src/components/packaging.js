import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {getAllPackagingItems, getAllAssemblyLinesByStatus} from '../actions/index';
import {Link} from 'react-router';


class Packaging extends Component
{
    
    componentWillMount()
    {
        this.props.getAllAssemblyLinesByStatus('Ready for Packaging')
        .then(()=>{
            console.log(this.props.assemblylist);
        })
        .catch((err)=>
        {
            console.log(err);
        });
        
    }


    render(){

    let assemblydata = '';
    let packagingdata = '';
    if(this.props.assemblylist.length > 0){
        assemblydata = this.props.assemblylist.map((row) =>{
                return (
                    <tr>
                        <td>{row.assemblyId}</td>
                        <td>{row.deviceSerialNo}</td>
                        <td>{row.deviceType}</td>
                        <td>{row.manufacturingPlant}</td>
                        <td>{row.assemblyLastUpdateOn}</td>
                        <td>{row.assemblyStatus}</td>
                    </tr>
                );

        })
    }    

    if(this.props.packaginglist.length > 0){
        packagingdata = this.props.packaginglist.map((row) =>{
                return (
                    <tr>
                        <td>{row.caseId}</td>
                        <td>{row.holderAssemblyId}</td>
                        <td>{row.chargerAssemblyId}</td>
                        <td>{row.packageStatus}</td>
                        <td>{row.packagingDate}</td>
                    </tr>
                );

        })
    }    


        return(

            <div>
                <h1>Packaging</h1>
                <Panel>
                    <div id="top-button-panel" className="row">
                        <div className="col-md-12 text-right"><Link to="/Packaging/0" className="btn btn-primary">Create New Package</Link></div>
                    </div>                
                    <Panel header="Assembly Items - Ready for packaging">
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Assembly ID</th>
                                <th>Device Serial No</th>
                                <th>Device Type</th>
                                <th>Manufacturing Plant</th>
                                <th>Last Updated</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>{assemblydata}
                            </tbody>
                        </Table>
                    </Panel>
                </Panel>

                <Panel>               
                    <Panel header="Packaged Items">
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Holder ID</th>
                                <th>Charder ID</th>
                                <th>Status</th>
                                <th>Packaging date</th>
                            </tr>
                            </thead>
                            <tbody>{packagingdata}
                            </tbody>
                        </Table>
                    </Panel>
                </Panel>
            </div>

        );

    }

}

function mapStateToProps(state){
    return {assemblylist : state.packaging.assemblylist,
    packaginglist : state.packaging.packaginglist};
}




export default connect(mapStateToProps, {getAllPackagingItems, getAllAssemblyLinesByStatus})(Packaging);