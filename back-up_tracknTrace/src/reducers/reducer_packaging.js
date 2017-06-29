import {GET_ALL_PACKAGING_ITEMS
    , GET_PACKAGE_BY_ID
    , GET_PACKAGES_BY_DATE
    , GET_PACKAGE_BY_ASSEMBLY_ID_AND_BY_DATE
    , GET_PACKAGES_HISTORY_BY_DATE
    , GET_PACKAGE_LINE_HISTORY_BY_ID
} from '../actions/index';
import {strToDate, numToDate} from '../dateutil';


const INITIAL_STATE = {packaginglist: []
                    , currentPackageHist: []
                    , packagingChartData :[]
                    , currentpackaging: {caseId : Date.now().toString()
                    , holderAssemblyId : ''
                    , chargerAssemblyId : ''
                    , packageStatus : 0
                    , packagingDate : new Date()
                    , packagingCreationDate : new Date()
                    , packageLastUpdateOn : new Date()
                    , shippingToAddress : ''
                    , packageCreatedBy : 'jaydghos'
                    , packageLastUpdatedBy : 'jaydghos'}};


export default function(state=INITIAL_STATE, action)
{ 

    switch(action.type)
    {
        case GET_PACKAGE_BY_ID :
            var payload = null;
            if(typeof action.payload.data.result === 'undefined'){
                payload = action.payload.data;
                return Object.assign({},state,{currentpackaging:payload});
            } 
            else{
                payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"{}";
                var result = JSON.parse(payload);
                result.packagingDate = numToDate(parseInt(result.packagingDate)); 
                result.packageStatus = parseInt(result.packageStatus);
                console.log(result);
                return Object.assign({},state,{currentpackaging:result});
            }
            break;
        case GET_ALL_PACKAGING_ITEMS:
        case GET_PACKAGES_BY_DATE:
        case GET_PACKAGE_BY_ASSEMBLY_ID_AND_BY_DATE:
            var payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"[]";
            return Object.assign({},state,{ packaginglist:JSON.parse(payload)});
            break;
        case GET_PACKAGES_HISTORY_BY_DATE:
            return Object.assign({},state,{packaginglist:[], packagingChartData:action.payload});
            break;  
        case GET_PACKAGE_LINE_HISTORY_BY_ID:
            var payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"[]";
            return Object.assign({},state,{currentPackageHist:JSON.parse(payload)});
            break;                                     
        default:
            return state;
            break;
    }

}
