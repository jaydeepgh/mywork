
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {getAssemblyHistoryById} from '../actions/index';
import {Link} from 'react-router';
import {Modal,Button,Table} from 'react-bootstrap';
import AssemblyNode from './assembly_node';



class AssemblyHistory extends Component{

    constructor(props){
        super(props);
        this.state = {showModal : false, nodes : null};
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({showModal: true });
    }


    componentDidMount(){
        
        this.props.getAssemblyHistoryById(this.props.assemblyId,this.props.userstate).then(()=>{            
            this.setState({nodes:<AssemblyNode hist={this.props.assemblyHistory} />});
        });
    }


    render()
    {

                return(
                    <div>
                        <div><span>History : </span> <Link onClick={this.open}><img className="edit_image" src="../../img/detail.png" /></Link> </div>
                        <Modal show={this.state.showModal} onHide={this.close} bsSize="large" className="histModal">
                        <Modal.Header closeButton>
                            <Modal.Title>Assembly Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="asmHist">            
                            <div>
                                {(this.state.nodes!=null)?this.state.nodes:''}
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


export default connect(state => ({   
    userstate : state.userstate,
    assemblyHistory : state.assembly.currentAssemblyHist
    
}),{getAssemblyHistoryById})(AssemblyHistory);