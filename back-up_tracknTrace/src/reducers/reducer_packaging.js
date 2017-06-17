import {GET_ALL_PACKAGING_ITEMS, GET_PACKAGE_BY_ID} from '../actions/index';
import {strToDate} from '../dateutil';


const INITIAL_STATE = {packaginglist: [], currentpackaging: {caseId : Date.now().toString()
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
            //console.log(action.payload);
            if(typeof action.payload.data.result === 'undefined'){
                payload = action.payload.data;
                //console.log(payload);
                return Object.assign({},state,{currentpackaging:payload});
            } 
            else{
                payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"{}";
                
                var result = JSON.parse(payload);
                //console.log(result);
                result.packagingDate = strToDate(result.packagingDate); 
                //result.packagingCreationDate = strToDate(result.packagingCreationDate); 
                //result.packageLastUpdateOn = strToDate(result.packageLastUpdateOn);                 
                result.packageStatus = parseInt(result.packageStatus);
                return Object.assign({},state,{currentpackaging:result});
            }
            break;
        case GET_ALL_PACKAGING_ITEMS:
            var payload = (typeof action.payload.data.result!='undefined')?action.payload.data.result.message:"[]";
            return Object.assign({},state,{ packaginglist:JSON.parse(payload)});

            break;
        default:
            return state;
            break;
    }

}
