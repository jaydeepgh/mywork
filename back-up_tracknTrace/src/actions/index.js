import axios from 'axios';
import {INITIALIZE} from 'redux-form';
import {strToDate,dateToStr,dateToNum} from '../dateutil';

//BLOCKCHAIN CONSTANTS
const CHAIN_URL = 'https://73efed29720e41d79593d61a837a1f47-vp0.us.blockchain.ibm.com:5004/chaincode';
const CHAIN_CODE_ID = '30771480f653138fab130d5cb1482e652cc2a7e9181a5343a1bf412ba4149f3600a5a056999a95439f14d335a11bd03fab92624989bb01a6195c68d2005f4e1b';


//ACTIONS
export const GET_ALL_ASSEMBLY_ITEMS = 'GET_ALL_ASSEMBLY_ITEMS';
export const CREATE_ASSEMBLY = 'CREATE_ASSEMBLY';
export const UPDATE_ASSEMBLY = 'UPDATE_ASSEMBLY';
export const GET_ASSEMBLY_BY_ID = 'GET_ASSEMBLY_BY_ID';
export const SELECT_DEVICE_TYPE = 'SELECT_DEVICE_TYPE';
export const GET_PACKAGE_BY_ID = 'GET_PACKAGE_BY_ID';
export const CREATE_PACKAGE = 'CREATE_PACKAGE';

export const GET_ASSEMBLY_BY_STATUSID = 'GET_ASSEMBLY_BY_STATUSID';
export const GET_ALL_PACKAGING_ITEMS = 'GET_ALL_PACKAGING_ITEMS';

export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';

export const GET_ASSEMBLY_LINE_HIST_BY_ID = 'GET_ASSEMBLY_LINE_HIST_BY_ID';  
export const GET_ASSEMBLY_CHART = 'GET_ASSEMBLY_CHART';



//DB CONSTANTS (Private)
const CLOUDANT_URL = 'https://tracktracedb-chestnutty-biome.mybluemix.net'; // http://localhost:3000'; //'https://tracktracedb-chestnutty-biome.mybluemix.net';//
const URL_GET_ASSEMBLY = `${CLOUDANT_URL}/api/getassembly`; 
const URL_GET_PACKAGING = `${CLOUDANT_URL}/api/getpackaging`; 

const URL_CREATE_ASSEMBLY = `${CLOUDANT_URL}/api/assembly/save`;
const URL_CREATE_PACKAGE = `${CLOUDANT_URL}/api/packaging/save`;

//?SearchFromDate=2017-5-10&SearchToDate=2017-5-31
//?fromdt=&todt=
//DB CONSTANTS (public)
export const GET_ASSEMBLY_INFO_DETAILS = 'GET_ASSEMBLY_INFO_DETAILS';
export const GET_PACKAGING_INFO_DETAILS = 'GET_PACKAGING_INFO_DETAILS';

export const LOG_ASSEMBLY_ACTION = 'LOG_ASSEMBLY_ACTION';


export const SEARCH_FROM_DATE_CHANGE = 'SEARCH_FROM_DATE_CHANGE';
export const SEARCH_TO_DATE_CHANGE = 'SEARCH_TO_DATE_CHANGE';





//DB ACTION CREATORS
export function getAssemblyInfo_DB(fromDate,toDate){


    let fromDt = `${fromDate.getFullYear()}-${fromDate.getMonth()+1}-${fromDate.getDate()}`;
    let toDt = `${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}`;
    const request = axios.get(`${URL_GET_ASSEMBLY}?fromdt=${fromDt}&todt=${toDt}`);
    //console.log(request);
    return{
        type:GET_ASSEMBLY_INFO_DETAILS,
        payload: request
    }
}


export function getAssembliesHistoryByDate(fromDate,toDate, userstate){
    let fromDt_bc = `${dateToNum(fromDate).toString()}000000`;
    let toDt_bc = `${dateToNum(toDate).toString()}235959`;
    data.method = 'query';
    data.params.ctorMsg.function = 'getAssembliesHistoryByDate';
    data.params.ctorMsg.args = [fromDt_bc, toDt_bc, userstate.id];
    const request = axios.post(userstate.chainnode_url,JSON.stringify(data)).then((res)=>{


        /////////////////////////////////////////////
        //console.log(res);
        var pl = (typeof res.data.result!='undefined')?JSON.parse(res.data.result.message):"[]";
        console.log(pl);
        var assemblyListDetails = pl;
        var fromDt = fromDate;
        var toDt = toDate;
        var diff = new Date(toDt.getTime() - fromDt.getTime());
        var totNoOfDays = (((((diff/1000)/60)/60)/24)+1);
        var chartData = [];

        var dtCounter = fromDt;
        var nDtCounter = 0;
        for(var i=0;i<totNoOfDays;i++){
            nDtCounter = dateToNum(dtCounter); // parseInt(`${dtCounter.getFullYear()}${dtCounter.getMonth()+1}${dtCounter.getDate()}`);
            //console.log(nDtCounter);
            var chartItem = {
                'date' : `${dtCounter.getDate()}`
                , 'Created' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '1' ) return x;
                    }).length
                ,  'QA Failed' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '2' ) return x;
                    }).length
                , 'Rectified' :_.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '3' ) return x;
                    }).length
                , 'QA Tested' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '4' ) return x;
                    }).length
                , 'Codentified' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '5' ) return x;
                    }).length    
                , 'Ready for Packaging' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '6' ) return x;
                    }).length
                , 'Packaged' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '7' ) return x;
                    }).length
                , 'Cancelled' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '8' ) return x;
                    }).length
                , 'InActive' : _.filter(assemblyListDetails, (x) =>{
                        if(x.assemblyDate.toString().substring(0,8) == nDtCounter.toString() && x.assemblyStatus == '9' ) return x;
                    }).length   
            }
            chartData.push(chartItem);
            dtCounter = new Date(dtCounter.getTime() + (1 * 24 * 60 * 60 * 1000));
        }
        return chartData;

        ///////////////////////////////////////////////



    });
    console.log(request);
    return{
        type:GET_ASSEMBLY_CHART,
        payload: request
    }

}



export function getPackagingInfo_DB(fromDate,toDate){


//console.log(fromDate);
    let fromDt = `${fromDate.getFullYear()}-${fromDate.getMonth()+1}-${fromDate.getDate()}`;
    let toDt = `${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}`;
    const request = axios.get(`${URL_GET_PACKAGING}?fromdt=${fromDt}&todt=${toDt}`);
    //console.log(request);
    return{
        type:GET_PACKAGING_INFO_DETAILS,
        payload: request
    }
}


export function setUserState(id, role, chainnode){

    //`https://6de494b1c04d48049b642bba6f9fbdc1-vp${chainnode.toString()}.us.blockchain.ibm.com:5004/chaincode`
    var node_url = `https://6de494b1c04d48049b642bba6f9fbdc1-vp${chainnode.toString()}.us.blockchain.ibm.com:5004/chaincode`;
    //`https://73efed29720e41d79593d61a837a1f47-vp${chainnode.toString()}.us.blockchain.ibm.com:5004/chaincode`;
    var userState = {id:id, role:role, node_url:node_url};
    return{
        type:SET_USER,
        payload: userState
    }
}


export function clearUserState(id, role, chainnode){
    var userState = {id:'', role:'', node_url:null};
    return{
        type:CLEAR_USER,
        payload: userState
    }
}











//ACTION CREATORS
export function getAllPackagingItems() 
{

    data.method = 'query';
    data.params.ctorMsg.function = 'getAllPackages';
    data.params.ctorMsg.args = [];

    const request = axios.post(CHAIN_URL,JSON.stringify(data));
    //console.log(request);

    return{
        type:GET_ALL_PACKAGING_ITEMS,
        payload: request
    }
}

export function getAllAssemblyLinesByStatus(status)
{
    //console.log(status);
    data.method = 'query';
    data.params.ctorMsg.function = 'getAllAssemblyByStatus';
    data.params.ctorMsg.args = [status];

    const request = axios.post(CHAIN_URL,JSON.stringify(data));
    //console.log(request);

    return{
        type:GET_ASSEMBLY_BY_STATUSID,
        payload: request
    }
}



export function selectDeviceType(value){
    //console.log(value);
    return{
        type : SELECT_DEVICE_TYPE,
        payload : value
    }
}


let data = {
        jsonrpc: "2.0",
        method: '',
        params: {
            type: 1,
            chaincodeID: {
            name: CHAIN_CODE_ID
            },
            ctorMsg: {
            function: '',
            args: []
            },
            secureContext: "user_type1_0"
        },
        id: 0
    }



export function getAllAssemblyLines(userstate)
{
    data.method = 'query';
    data.params.ctorMsg.function = 'getAllAssemblies';
    data.params.ctorMsg.args = [userstate.id];

    const request = axios.post(userstate.chainnode_url,JSON.stringify(data));

    //console.log(request);
    return{
        type:GET_ALL_ASSEMBLY_ITEMS,
        payload: request
    }
}


//export const GET_ASSEMBLY_LINE_HIST_BY_ID = 'GET_ASSEMBLY_LINE_HIST_BY_ID';  

export function getAssemblyHistoryById(assemblyId, userstate)
{
    data.method = 'query';
    data.params.ctorMsg.function = 'getAssemblyLineHistoryByID';
    data.params.ctorMsg.args = [assemblyId, userstate.id];

    const request = axios.post(userstate.chainnode_url,JSON.stringify(data));


    return{
        type:GET_ASSEMBLY_LINE_HIST_BY_ID,
        payload: request
    }
}







export function getAssemblyLinesById(id, userstate)
{
    //console.log(id);
    data.method = 'query';
    data.params.ctorMsg.function = 'getAssemblyByID';
    data.params.ctorMsg.args = [id];
    //console.log(data);

    let request = null;
    
    if(id!='0'){
        //request = axios.post(CHAIN_URL,JSON.stringify(data));        
        request = axios.post(userstate.chainnode_url,JSON.stringify(data));
    }else{
        request = 
        {data: {assemblyId : Date.now().toString()
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
                , assemblyStatus : 0
                , assemblyDate : new Date()
                , assemblyLastUpdateOn : new Date()
                , assemblyCreatedBy : userstate.id 
                , assemblyLastUpdatedBy : userstate.id
                }}
        
        
       
    }
    
    //console.log(request);

    return{
        type:GET_ASSEMBLY_BY_ID,
        payload: request
    }
}

export function createAssemblyLines(formValues, userstate)
{
    //alert('inside action creator'); 
    //console.log(data);

    data.method = 'invoke';
    data.params.ctorMsg.function = 'createAssembly';
    data.params.ctorMsg.args = [
             formValues.assemblyId
            , formValues.deviceSerialNo
            , formValues.deviceType
            , formValues.filamentBatchId
            , formValues.ledBatchId
            , formValues.circuitBoardBatchId
            , formValues.wireBatchId
            , formValues.casingBatchId
            , formValues.adaptorBatchId
            , formValues.stickPodBatchId
            , formValues.manufacturingPlant 
            , '1'
            , dateToStr(formValues.assemblyDate)
            , userstate.id
            ];

    const request = axios.post(userstate.chainnode_url,JSON.stringify(data));

        var elemntAssm = {
        assemblyId : formValues.assemblyId //Date.now().toString() 
        , deviceSerialNo : formValues.deviceSerialNo
        , deviceType : formValues.deviceType
        , filamentBatchId : formValues.filamentBatchId
        , ledBatchId : formValues.ledBatchId
        , circuitBoardBatchId : formValues.circuitBoardBatchId
        , wireBatchId : formValues.wireBatchId
        , casingBatchId : formValues.casingBatchId 
        , adaptorBatchId : formValues.adaptorBatchId
        , stickPodBatchId : formValues.stickPodBatchId
        , manufacturingPlant : formValues.manufacturingPlant 
        , assemblyStatus : '1'
        , assemblyCreationDate : dateToNum(formValues.assemblyDate)// parseInt(`${formValues.assemblyCreationDate.getFullYear()}${formValues.assemblyCreationDate.getMonth()+1}${formValues.assemblyCreationDate.getDate()}`)
        , assemblyCreationDateView : dateToStr(formValues.assemblyDate)// `${formValues.assemblyCreationDate.getFullYear()}-${formValues.assemblyCreationDate.getMonth()+1}-${formValues.assemblyCreationDate.getDate()}`
        , assemblyCreatedBy : userstate.id
        };
        const request1 = axios.post(URL_CREATE_ASSEMBLY,elemntAssm);




    return{
        type:CREATE_ASSEMBLY,
        payload: request
    }
}



export function updateAssemblyLines(formValues, userstate)
{

    data.method = 'invoke';
    data.params.ctorMsg.function = 'updateAssemblyByID';
    data.params.ctorMsg.args = [
             formValues.assemblyId
            , formValues.deviceSerialNo
            , formValues.deviceType
            , formValues.filamentBatchId
            , formValues.ledBatchId
            , formValues.circuitBoardBatchId
            , formValues.wireBatchId
            , formValues.casingBatchId
            , formValues.adaptorBatchId
            , formValues.stickPodBatchId
            , formValues.manufacturingPlant 
            , formValues.assemblyStatus.toString()
            , dateToStr(formValues.assemblyDate)
            , userstate.id
            ];

            //console.log(JSON.stringify(data));

    const request = axios.post(userstate.chainnode_url,JSON.stringify(data));
 
        var elemntAssm = {
        assemblyId : formValues.assemblyId //Date.now().toString() 
        , deviceSerialNo : formValues.deviceSerialNo
        , deviceType : formValues.deviceType
        , filamentBatchId : formValues.filamentBatchId
        , ledBatchId : formValues.ledBatchId
        , circuitBoardBatchId : formValues.circuitBoardBatchId
        , wireBatchId : formValues.wireBatchId
        , casingBatchId : formValues.casingBatchId 
        , adaptorBatchId : formValues.adaptorBatchId
        , stickPodBatchId : formValues.stickPodBatchId
        , manufacturingPlant : formValues.manufacturingPlant 
        , assemblyStatus : formValues.assemblyStatus.toString()
        , assemblyCreationDate : dateToNum(new Date())
        , assemblyCreationDateView : dateToStr(new Date())
        , assemblyCreatedBy : userstate.id
        };
        const request1 = axios.post(URL_CREATE_ASSEMBLY,elemntAssm);

    return{
        type:UPDATE_ASSEMBLY,
        payload: request
    }
}




export function getPackageById(id, userstate)
{
    //console.log(id);
    data.method = 'query';
    data.params.ctorMsg.function = 'getPackageByID';
    data.params.ctorMsg.args = [id, userstate.id];
    //console.log(data);

    let request = null;
    
    if(id!='0'){
        request = axios.post(userstate.chainnode_url,JSON.stringify(data));        
    }else{
        request = 
        {data:   {caseId : Date.now().toString()
                    , holderAssemblyId : ''
                    , chargerAssemblyId : ''
                    , packageStatus : 0
                    , packagingDate : new Date()
                    , packagingCreationDate : new Date()
                    , packageLastUpdateOn : new Date()
                    , shippingToAddress : ''
                    , packageCreatedBy : userstate.id
                    , packageLastUpdatedBy : userstate.id} }       
    }
    
    //console.log(request);

    return{
        type:GET_PACKAGE_BY_ID,
        payload: request
    }
}


export function createPackageingItem(formValues, assemblies, userstate)
{


    data.method = 'invoke';
    data.params.ctorMsg.function = 'createPackage';
    data.params.ctorMsg.args = [
                    formValues.caseId
                    , formValues.holderAssemblyId
                    , formValues.chargerAssemblyId
                    , '1'
                    , dateToStr(formValues.packagingDate)
                    , formValues.shippingToAddress
                    , '7'
                    , userstate.id
            ];

    //const request = '';
    const request = axios.post(userstate.chainnode_url,JSON.stringify(data));

    var updateAssemblies = assemblies.map((x) =>{
        return {assemblyId : x.assemblyId 
        , deviceSerialNo : x.deviceSerialNo
        , deviceType : x.deviceType
        , filamentBatchId : x.filamentBatchId
        , ledBatchId : x.ledBatchId
        , circuitBoardBatchId : x.circuitBoardBatchId
        , wireBatchId : x.wireBatchId
        , casingBatchId : x.casingBatchId 
        , adaptorBatchId : x.adaptorBatchId
        , stickPodBatchId : x.stickPodBatchId
        , manufacturingPlant : x.manufacturingPlant 
        , assemblyStatus : '7'
        , assemblyCreationDate : dateToNum(new Date())
        , assemblyCreationDateView : dateToStr(new Date())
        , assemblyCreatedBy : userstate.id}

    });

        var elemntPackaging = {caseId : formValues.caseId
                    , holderAssemblyId : formValues.holderAssemblyId
                    , chargerAssemblyId : formValues.chargerAssemblyId
                    , packageStatus : '1'
                    , packagingDate : dateToNum(formValues.packagingDate) 
                    , packageCreationDateView : dateToStr(formValues.packagingDate)
                    , shippingToAddress : formValues.shippingToAddress
                    , packageCreatedBy : userstate.id
                    , updateAssemblies : updateAssemblies};
        const request1 = axios.post(URL_CREATE_PACKAGE,elemntPackaging);
        
        console.log(elemntPackaging);


    return{
        type:CREATE_PACKAGE,
        payload: request
    }
}



export function updatePackagingLine(formValues, assemblies, userstate)
{


    data.method = 'invoke';
    data.params.ctorMsg.function = 'updatePackage';
    data.params.ctorMsg.args = [
                    formValues.caseId
                    , formValues.holderAssemblyId
                    , formValues.chargerAssemblyId
                    , formValues.packageStatus.toString()
                    , dateToStr(formValues.packagingDate)
                    , formValues.shippingToAddress
                    , (formValues.packageStatus==2)?'7':'8'
                    , userstate.id
            ];

           // console.log(formValues.packageStatus.toString());

    const request = axios.post(userstate.chainnode_url,JSON.stringify(data));
 
            //if(formValues.packageStatus==3){
                    var updateAssemblies = assemblies.map((x) =>{
                    return {assemblyId : x.assemblyId 
                    , deviceSerialNo : x.deviceSerialNo
                    , deviceType : x.deviceType
                    , filamentBatchId : x.filamentBatchId
                    , ledBatchId : x.ledBatchId
                    , circuitBoardBatchId : x.circuitBoardBatchId
                    , wireBatchId : x.wireBatchId
                    , casingBatchId : x.casingBatchId 
                    , adaptorBatchId : x.adaptorBatchId
                    , stickPodBatchId : x.stickPodBatchId
                    , manufacturingPlant : x.manufacturingPlant 
                    , assemblyStatus : '8'
                    , assemblyCreationDate : dateToNum(new Date())
                    , assemblyCreationDateView : dateToStr(new Date())
                    , assemblyCreatedBy : userstate.id}

                });

                    var elemntPackaging = {caseId : formValues.caseId
                                , holderAssemblyId : formValues.holderAssemblyId
                                , chargerAssemblyId : formValues.chargerAssemblyId
                                , packageStatus : formValues.packageStatus.toString()
                                , packagingDate : dateToNum(formValues.packagingDate) 
                                , packageCreationDateView : dateToStr(formValues.packagingDate)
                                , shippingToAddress : formValues.shippingToAddress
                                , packageCreatedBy : userstate.id
                                , updateAssemblies : updateAssemblies};
                               // console.log(elemntPackaging);
                    const request1 = axios.post(URL_CREATE_PACKAGE,elemntPackaging);
            //}

    return{
        type:UPDATE_ASSEMBLY,
        payload: request
    }
}




























