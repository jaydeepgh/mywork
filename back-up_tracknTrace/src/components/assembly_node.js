import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {AssemblyStatus} from '../master_data'
import {formatedDate, formatedDateTimeFromNum} from '../dateutil';
import {GridList, GridTile} from 'material-ui/GridList';



export default class AssemblyNode extends Component{

    constructor(props){
        super(props);
        this.state = {viewdetail:'hide', viewmore:'hide', info1:'', info2:''};
        
    }
    
    componentDidMount(){
        let item = this.props.assemblynode;
        this.setState({info1:item.assemblyInfo1, info2:item.assemblyInfo2});

    }
    showDetails(){
        this.setState({viewdetail:'show'});
    }

    hideDetails(){
        this.setState({viewdetail:'hide'});
    }


    showMoreDetails(){
        this.setState({viewmore:'show'});
        //alert('here')
    }

    hideMoreDetails(){
        this.setState({viewmore:'hide'});
    }

    render(){

        let item = this.props.assemblynode;
        let stat= _.filter(AssemblyStatus,_.matches({'id' : parseInt(item.assemblyStatus)}))[0].value;
        let type = item.deviceType.toLowerCase();
        //alert(info1);
        return(
            <div className="nodeContainer" onMouseOver={this.showDetails.bind(this)} onMouseOut={this.hideDetails.bind(this)}>
                <GridList cols={3} className="gl">
                    <GridTile>
                        <div className="nodeStatusBlock">
                            <div className="asmNodeStatus">
                                {stat}<br />
                                {formatedDateTimeFromNum(item.assemblyDate)}
                            </div>
                            
                            <div className="arrowImageDiv">
                                {(this.props.arrowrequired==='true')?
                                <img className="arrowImage" src="../../img/Down_Arrow_Icon.png" />
                                :<img className="arrowImage" src="../../img/blank.png" />}
                            </div>
                        </div>
                    </GridTile>
                    <GridTile>
                        <div className={this.state.viewdetail}>
                            <div className="nodeDetail" key={item.assemblyId}>
                                <img src="../../img/user.png" className="userImage" /> [User Id : {item.assemblyLastUpdatedBy}]
                                <hr />
                                {(type.substring(0,4) === 'hold')?
                                <div>
                                    <div>Serial No: {item.deviceSerialNo}</div>                                                          
                                    <div>Filament : {item.filamentBatchId}</div>
                                    <div>LED : {item.ledBatchId}</div>
                                    <div>Circuit Board : {item.circuitBoardBatchId}</div>
                                    <div>Casing : {item.casingBatchId}</div>
                                    <div>Stick Pod : {item.stickPodBatchId}</div>                              
                                        {(this.state.info1.length > 0 || this.state.info2.length >0)?
                                            <a href="#" onMouseOver={this.showMoreDetails.bind(this)} onMouseOut={this.hideMoreDetails.bind(this)}>More Detail...</a> : ''}
                                </div>:
                                <div>
                                        <div>Serial No: {item.deviceSerialNo}</div> 
                                        <div>Adapter : {item.adaptorBatchId}</div>
                                        <div>Wire : {item.wireBatchId}</div>
                                        {(this.state.info1.length > 0 || this.state.info2.length >0)?
                                            <a href="#" onMouseOver={this.showMoreDetails.bind(this)} onMouseOut={this.hideMoreDetails.bind(this)}>More Detail...</a> : ''}                               
                                </div>
                            }                        
                            </div>
                        </div>
                    </GridTile>
                    
                        <GridTile>
                            <div className={this.state.viewmore}>
                                <div className="nodeInfo">{this.state.info1}<br />{this.state.info2}
                                </div>
                            </div>
                        </GridTile>
                </GridList>
            </div>            
        );






/*        
            trStatus = this.props.assemblyHistory.map((item)=>{
                count--;
                let td = null;
                let stat = _.filter(AssemblyStatus,_.matches({'id' : parseInt(item.assemblyStatus)}))[0].value;
                return(<td>
                            <div className="asm_1">
                                {stat}
                            </div>
                            {(count>0)?<div className="arrowdiv"><img src="../../img/right-arrow.png" className="arrow" /></div> : ''}
                    </td>                            
                );
            });

            trDetails = this.props.assemblyHistory.map((item)=>{
                let td = null;
                let stat = _.filter(AssemblyStatus,_.matches({'id' : parseInt(item.assemblyStatus)}))[0].value;
                return(<td>
                            <div className="nodeDetail" key={item.assemblyId}>
                                <img src="../../img/user.png" className="userImage" /> [User Id : {item.assemblyLastUpdatedBy}]
                            </div>
                    </td>                            
                );
            });
*/

    }


}
