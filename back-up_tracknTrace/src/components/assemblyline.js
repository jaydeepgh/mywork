import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Panel, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {getAllAssemblyLines} from '../actions/index';
import {Link} from 'react-router';
import SimpleBarChart from './assembly_chart';

class AssemblyLineList extends Component
{
    
    constructor(props){
        super(props);
        this.state = {loaded:false};

    }

    componentWillMount()
    {
        this.props.getAllAssemblyLines()
        .then(()=>{
            this.setState({loaded:true});
        })
        .catch((err)=>
        {
            console.log(err);
        });
        
    }


    render(){


        if(typeof this.state.loaded != undefined && this.state.loaded == true){
            let assemblydata = '';
            if(this.props.assemblylist.length > 0){
                assemblydata = this.props.assemblylist.map((row) =>{
                        return (
                            <tr>
                                <td><Link to={`/Assembly/${row.assemblyId}`}>{row.assemblyId}</Link></td>
                                <td>{row.deviceSerialNo}</td>
                                <td>{row.deviceType}</td>
                                <td>{row.manufacturingPlant}</td>
                                <td>{row.assemblyLastUpdateOn}</td>
                                <td>{row.assemblyStatus}</td>
                            </tr>
                        );

                })
            }    


        return(

            <div>
                <h1>Assembly Line</h1>
                <Panel>
                    <div id="top-button-panel" className="row">
                        <div className="col-md-12 text-right"><Link to="/Assembly/0" className="btn btn-primary">Create New Item</Link></div>
                    </div>                
                    <Panel header="Existing Assembly Items">
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

            </div>

        );



    }else{
        return <div></div>
    }

}

}

function mapStateToProps(state){
    return {assemblylist : state.assembly.assemblylist};
}




export default connect(mapStateToProps, {getAllAssemblyLines})(AssemblyLineList);