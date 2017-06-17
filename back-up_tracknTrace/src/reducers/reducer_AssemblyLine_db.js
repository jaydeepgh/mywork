import {GET_ASSEMBLY_INFO_DETAILS, LOG_ASSEMBLY_ACTION} from '../actions/index';


const INITIAL_STATE = {assemblylist:[], assemblylistDetails:[], assemblyChartData:[]};

export default function(state=INITIAL_STATE, action)
{ 
    //alert('here');
    //console.log(action.type);
    switch(action.type)
    {
        case GET_ASSEMBLY_INFO_DETAILS:
            //console.log(action.payload.data[2]);
            return Object.assign({},state,{ assemblylist:action.payload.data[0]
                                        , assemblylistDetails:action.payload.data[1]
                                    , assemblyChartData : action.payload.data[2]});
                
        break;
        case LOG_ASSEMBLY_ACTION:
            return state;
        break;                
        default:
            return state;
        break;    
    }

}


