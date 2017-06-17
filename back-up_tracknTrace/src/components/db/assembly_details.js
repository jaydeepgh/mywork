import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Modal,Button, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Field,
    reduxForm, 
    formValueSelector} from 'redux-form';
import {Link} from 'react-router';
import {
  TextField
} from 'redux-form-material-ui';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import {AssemblyStatus} from '../../master_data';
import {formatedDate} from '../../dateutil';



class AssemblyDetails extends Component{
    constructor(props){
        super(props);
        this.state = {showModal : false};
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }



    render(){
    
            let assemblydata = '';
            //console.log(this.props.assemblyDetails);
            //console.log(this.props.assemblyId);
            var dataList = _.sortBy(_.filter(this.props.assemblyDetails, _.matches({'assemblyId' : this.props.assemblyId})), _.property(['assemblyStatus'])).reverse();

            var type = this.props.type;

            if(dataList.length > 0){
                assemblydata = dataList.map((row) =>{
                    if(type === 'Holder'){
                         return (
                            <tr>
                                <td>{row.filamentBatchId}</td>
                                <td>{row.ledBatchId}</td>
                                <td>{row.circuitBoardBatchId}</td>
                                <td>{row.casingBatchId}</td>
                                <td>{row.stickPodBatchId}</td>                              
                                <td>{_.filter(AssemblyStatus, _.matches( {'id' : parseInt(row.assemblyStatus)}))[0].value}</td>
                                <td>{formatedDate(row.assemblyCreationDateView)}</td>                                                             
                            </tr>
                        );
                    }else{
                        return (
                            <tr>
                                <td>{row.adaptorBatchId}</td>
                                <td>{row.wireBatchId}</td>                                
                                <td>{_.filter(AssemblyStatus, _.matches( {'id' : parseInt(row.assemblyStatus)}))[0].value}</td>
                                <td>{formatedDate(row.assemblyCreationDateView)}</td>                                                             
                            </tr>
                        );
                    }
                       

                })
            }      
    
    
    
    
                return(
                    <div>
                        <div><span>History : </span> <Link onClick={this.open}><img className="edit_image" src="../../../img/detail.png" /></Link> </div>
                        <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                        <Modal.Header closeButton>
                            <Modal.Title>Assembly Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                    <Table striped bordered condensed hover>
                                        <thead>
                                        <tr>
                                            
                                            {type==='Holder'?<th>Filament Batch</th>:''}
                                            {type==='Holder'?<th>LED Batch</th>:''}
                                            {type==='Holder'?<th>Circuit Board Batch</th>:''}
                                            {type==='Holder'?<th>Casing Batch</th>:''}
                                            {type==='Holder'?<th>Stick Pod Batch</th>:''}
                                            {type==='Holder'?'':<th>Adapter Batch</th>}
                                            {type==='Holder'?'':<th>Wire Batch</th>}
                                            <th>Status</th>     
                                            <th>Date</th>                                                                        
                                        </tr>
                                        </thead>
                                        <tbody>{assemblydata}
                                        </tbody>
                                    </Table>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close}>Close</Button>
                        </Modal.Footer>
                        </Modal>  

                    </div>
                );
    }



}

function mapStateToProps(state){
    return {assemblyDetails : state.assembly_db.assemblylistDetails}
}

export default connect(mapStateToProps,null)(AssemblyDetails);