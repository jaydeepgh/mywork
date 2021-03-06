import _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {AssemblyStatus} from '../master_data'
import {formatedDate, formatedDateTimeFromNum} from '../dateutil';
import {GridList, GridTile} from 'material-ui/GridList';

export default class AssemblyNode extends Component{
    constructor(props){
        super(props);
        this.state = {blocks:null, fnodes:null, tnodes:null, nodedetailstyle:{
            top:'0px'
            , left:'0px'
            , display : 'none'
        }, nodedata : {
            assemblyId : ''
            , deviceSerialNo: ''
            , deviceType: ''
            , filamentBatchId : ''
            , ledBatchId : ''
            , circuitBoardBatchId: ''
            , wireBatchId: ''
            , casingBatchId : ''
            , adaptorBatchId : ''
            , stickPodBatchId : ''
            , manufacturingPlant : '' 
            , assemblyStatus : ''
            , assemblyDate : ''
            , assemblyLastUpdateOn : ''
            , assemblyCreatedBy : '' 
            , assemblyLastUpdatedBy : ''
            ,info1 :''
            , info2 :''
        }};
        
    }

    clickNode(index){
        let curNode = this[0];
        const domNode = ReactDOM.findDOMNode(curNode);
        let clientRect = domNode.getBoundingClientRect();
        let item = this.state.blocks[index];
        let constPix = ((screen.width - 900) / 2);
        //console.log(screen.width);
        this.setState({
            nodedetailstyle : {top : ((clientRect.top + clientRect.height)-(clientRect.top - (clientRect.top - 100))).toString() + 'px'
                            ,left : (((clientRect.left + 45) + ((clientRect.width + 20) * index)) - constPix).toString() + 'px'
                            , display : (this.state.nodedetailstyle.display=='none' || (this.state.nodedata.assemblyStatus != item.assemblyStatus))?'block':'none'
                },
                nodedata : {
                    assemblyId : item.assemblyId
                    , deviceSerialNo: item.deviceSerialNo
                    , deviceType: item.deviceType
                    , filamentBatchId : item.filamentBatchId
                    , ledBatchId : item.ledBatchId
                    , circuitBoardBatchId: item.circuitBoardBatchId
                    , wireBatchId: item.wireBatchId
                    , casingBatchId : item.casingBatchId
                    , adaptorBatchId : item.adaptorBatchId
                    , stickPodBatchId : item.stickPodBatchId
                    , manufacturingPlant : item.manufacturingPlant 
                    , assemblyStatus : item.assemblyStatus
                    , assemblyDate : item.assemblyDate
                    , assemblyLastUpdateOn : item.assemblyLastUpdateOn
                    , assemblyCreatedBy : item.assemblyCreatedBy 
                    , assemblyLastUpdatedBy : item.assemblyLastUpdatedBy
                    ,info1 : item.assemblyInfo1
                    , info2 : item.assemblyInfo2
        }

        });
    }

    componentDidMount(){
        this.setState({blocks:this.props.hist});
        let count = this.props.hist.length;
        let histItem = -1;
        if(count>0){

            let fnodes = this.props.hist.map((item)=>{
                histItem++;
                let stat= _.filter(AssemblyStatus,_.matches({'id' : parseInt(item.assemblyStatus)}))[0].value;
                
                return((histItem==0) ? <div className="sub"
                        ref={(c) => this[0] = c}
                        onClick={this.clickNode.bind(this,histItem)}>{stat}</div>
                        : 
                        <div className="sub"
                        onClick={this.clickNode.bind(this,histItem)}>{stat}</div>                        
                        );

            });
            this.setState({fnodes:fnodes});            

            let tnodes = this.props.hist.map((item)=>{
                count--
                if(count>0){
                    return(
                        <div><div className="link">{(count +1).toString()}</div>
                        <div className="linkList"></div></div>
                    );
                }
                else{
                    return(
                        <div className="link">{(count +1).toString()}</div>                        
                    );
                }
            });
            this.setState({tnodes:tnodes});            
        }
    }

    render(){

        return(
            <div>
                <div className="floating" style={this.state.nodedetailstyle}>
                        <img  className="image_arrow" src="../../img/arrow.png" height="auto" width= "auto" />
                        <div className="image_box">
                            <div className="nodeHeader">
                                <div><img src="../../img/user.png" className="userImage" />                                
               <span className="nodeHeader_item">{(this.state.nodedata.assemblyStatus==='1')?'Created':'Updated'} By : &nbsp;
                                    {this.state.nodedata.assemblyLastUpdatedBy}<br />
                                    </span>
                                </div>
                            </div>
                            <div><hr className="hrclass" /></div>
                            {(this.state.nodedata.deviceType.toLowerCase().substring(0,4) === 'hold')?
                            <div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Date : </div>
                                    <div className="nodeItemValue">{(this.state.nodedata.assemblyDate!="")?formatedDateTimeFromNum(this.state.nodedata.assemblyDate):''}</div>
                                </div>
               {(this.state.nodedata.deviceSerialNo.length >0)?
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Serial No: </div>
                                    <div className="nodeItemValue">{this.state.nodedata.deviceSerialNo}</div>
                                </div>
               : ''}
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Filament : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.filamentBatchId}</div>
                                </div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">LED : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.ledBatchId}</div>
                                </div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Circuit Board : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.circuitBoardBatchId}</div>
                                </div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Casing : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.casingBatchId}</div>
                                </div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Stick Pod : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.stickPodBatchId}</div>
                                </div>
                                {(typeof this.state.nodedata.info1 != 'undefined' && (this.state.nodedata.info1.length > 0 || this.state.nodedata.info2.length >0))?
                                    <div><hr className="hrclass" />
                                        <span className="nodeItems">{this.state.nodedata.info1}<br />{this.state.nodedata.info2}</span>                                            
                                    </div>
                                        : ''}                                                                   
                            </div>:
                            <div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Date : </div> 
                                    <div className="nodeItemValue">{(this.state.nodedata.assemblyDate!="")?formatedDateTimeFromNum(this.state.nodedata.assemblyDate):''}</div>
                                </div>                                
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Serial No: </div>
                                    <div className="nodeItemValue">{this.state.nodedata.deviceSerialNo}</div>
                                </div> 
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Adapter : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.adaptorBatchId}</div>
                                </div>
                                <div className="nodeItems">
                                    <div className="nodeItemLabel1">Wire : </div>
                                    <div className="nodeItemValue">{this.state.nodedata.wireBatchId}</div>
                                </div>
                                    {(typeof this.state.nodedata.info1 != 'undefined' && (this.state.nodedata.info1.length > 0 || this.state.nodedata.info2.length >0))?
                                        <div><hr className="hrclass" />
                                            <span className="nodeItems">{this.state.nodedata.info1}<br />{this.state.nodedata.info2}</span>                                            
                                        </div>
                                            : ''}  
                            </div>}
                        </div>
                </div>
                <table className="content" >
                    <tr>
                        <td>
                            {(this.state.fnodes!=null)?this.state.fnodes:''}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="extra"></div>
                            {(this.state.tnodes!=null)?this.state.tnodes:''}                                        
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}


/*
const floating = (props) => {


    return(
                    <div id="floating_div" className="floating" >
                        <img  className="image_arrow" src="../../flow/arrow.png" height="auto" width= "auto" />
                        <div className="image_box"></div>
                    </div>
    )
}

export default class AssemblyNode extends Component{

    constructor(props){
        super(props);
        this.state = {viewdetail:'hide', viewmore:'hide', info1:'', info2:'', setStyle:{display:'none', left : '0px', top : '0px'}};
        
    }
    
    componentDidMount(){
        let item = this.props.assemblynode;
        this.setState({info1:item.assemblyInfo1, info2:item.assemblyInfo2});

    }
    showDetails(){
        //alert(event.clientX);
        //s = document.getElementById('floating_div');
        //alert(floating);
        this.setState({setStyle:{display:'block'
            , left : event.clientX.toString() +'px'
            , top : event.clientY.toString() +'px'
        }});
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
                <div id="floating_div" className="floating" style={this.state.setStyle}>
                        <img  className="image_arrow" src="../../flow/arrow.png" height="auto" width= "auto" />
                        <div className="image_box"></div>
                </div>
            </div>            
        );


    }


}
*/
