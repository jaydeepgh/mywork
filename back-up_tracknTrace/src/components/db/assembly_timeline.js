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
import HorizontalTimeline from 'react-timeline-view'




class AssemblyTimeline extends Component{

    constructor(props){
        super(props);
        this.state = {showModal : false, value: 0, previous: 0, data:[]};
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    componentWillMount(){
            //console.log(this.props.assemblyDetails);
            //console.log(this.props.assemblyId);
            let assemblydata = '';
            var dataList = _.sortBy(_.filter(this.props.assemblyDetails, _.matches({'assemblyId' : this.props.assemblyId})), _.property(['assemblyStatus']));

            var type = this.props.type;

            if(dataList.length > 0){
                assemblydata = dataList.map((row) =>{
                    return {date: Date.now(), title: _.filter(AssemblyStatus, _.matches( {'id' : parseInt(row.assemblyStatus)}))[0].value, data:row};
                });

                this.setState( {value: (assemblydata.length-1), previous: (assemblydata.length-2), data:assemblydata});
            }     
            //console.log('componentWillUpdate');
    }

    render(){
    
 
    
                var type = this.props.type;
                console.log(this.state.value);
                
                if(this.state.data.length>0){
                return(
                    <div>
                        <div><span>History : </span> <Link onClick={this.open}><img className="edit_image" src="../../../img/detail.png" /></Link> </div>
                        <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                        <Modal.Header closeButton>
                            <Modal.Title>Assembly Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div>
                                    <HorizontalTimeline id="timeline"
                                    indexClick={(index) => {
                                        this.setState({ value: index, previous: this.state.value });
                                    }}
                                    values={ this.state.data } />
                                    <div className='text-center'>
                                        {(type === 'Holder')?
                                        <div>
                                            <div>Filament Batch : {this.state.data[this.state.value].data.filamentBatchId}</div>
                                            <div>LED Batch : {this.state.data[this.state.value].data.ledBatchId}</div>
                                            <div>Circuit Board Batch : {this.state.data[this.state.value].data.circuitBoardBatchId}</div>
                                            <div>Casing Batch : {this.state.data[this.state.value].data.casingBatchId}</div>
                                            <div>Stick Pod Batch : {this.state.data[this.state.value].data.stickPodBatchId}</div>                              
                                            <div>Status : {_.filter(AssemblyStatus, _.matches( {'id' : parseInt(this.state.data[this.state.value].data.assemblyStatus)}))[0].value}</div>
                                            <div>Date : {formatedDate(this.state.data[this.state.value].data.assemblyCreationDateView)}</div>
                                        </div>:
                                        <div>
                                                <div>Adapter Batch : {this.state.data[this.state.value].data.adaptorBatchId}</div>
                                                <div>Wire Batch : {this.state.data[this.state.value].data.wireBatchId}</div>                                
                                                <div>Status : {_.filter(AssemblyStatus, _.matches( {'id' : parseInt(this.state.data[this.state.value].data.assemblyStatus)}))[0].value}</div>
                                                <div>Date : {formatedDate(this.state.data[this.state.value].data.assemblyCreationDateView)}</div>                                                             
                                        </div>
                                    }
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close}>Close</Button>
                        </Modal.Footer>
                        </Modal>  

                    </div>
                );
                }else{
                    return <div>History Loading....</div>
                }
    }



}


function mapStateToProps(state){
    return {assemblyDetails : state.assembly_db.assemblylistDetails}
}

export default connect(mapStateToProps,null)(AssemblyTimeline);



