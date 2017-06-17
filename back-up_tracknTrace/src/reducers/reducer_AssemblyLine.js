import {GET_ALL_ASSEMBLY_ITEMS, SELECT_DEVICE_TYPE
    , GET_ASSEMBLY_BY_ID, GET_ASSEMBLY_LINE_HIST_BY_ID
    ,GET_ASSEMBLY_CHART} from '../actions/index';
import {strToDate} from '../dateutil';

/*
, currentAssembly:{assemblyId : ''
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
}, devicetype:''

* */
const INITIAL_STATE = {assemblylist:[], currentAssemblyHist: [], assemblyChartData :[] };

export default function(state=INITIAL_STATE, action)
{ 
    switch(action.type)
    {
        case GET_ASSEMBLY_LINE_HIST_BY_ID:
            var payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"[]";
            return Object.assign({},state,{ currentAssemblyHist:(payload.length==0)?[]:JSON.parse(payload).assemblyLines});
            break;
        case GET_ALL_ASSEMBLY_ITEMS:
            var payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"[]";
            return Object.assign({},state,{ assemblylist:JSON.parse(payload)});
            break;    
        case GET_ASSEMBLY_CHART:
            //var payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"[]";
            //console.log(action.payload);
            return Object.assign({},state,{ assemblyChartData:action.payload});
            break;               
        /*case SELECT_DEVICE_TYPE:
            return Object.assign({},state,{devicetype:action.payload});
            break;            
        case GET_ASSEMBLY_BY_ID:
            var payload = null;
            if(!action.payload.data.result){
                
                payload = action.payload.data;
                return Object.assign({},state,{currentAssembly:payload,devicetype: payload.deviceType});
            } 
            else{
                payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"{}";
                var result = JSON.parse(payload);
                //var aCreatedDt = result.assemblyCreationDate.split('-');
                //var aUpdDt = result.assemblyLastUpdateOn.split('-');
                result.assemblyDate = strToDate(result.assemblyDate); //new Date(aCreatedDt[0], aCreatedDt[1], aCreatedDt[2]);
                result.assemblyLastUpdateOn = strToDate(result.assemblyLastUpdateOn); //new Date(aUpdDt[0], aUpdDt[1], aUpdDt[2]);
                result.assemblyStatus = parseInt(result.assemblyStatus);
                //console.log(JSON.parse(payload).assemblyCreationDate);                
                //console.log(result);        
                return Object.assign({},state,{currentAssembly:result,devicetype: result.deviceType});        

            }
            break;            
        */    
        default:
            return state;
            break;            
    }

}