import {GET_PACKAGING_INFO_DETAILS} from '../actions/index';


const INITIAL_STATE = {packaginglist:[], packaginglistDetails:[], packagingChartData:[]};

export default function(state=INITIAL_STATE, action)
{ 
    switch(action.type)
    {
        case GET_PACKAGING_INFO_DETAILS:
        console.log(action.payload);
            return Object.assign({},state,{ packaginglist:action.payload.data[0]
                                        , packaginglistDetails:action.payload.data[1]
                                    , packagingChartData : action.payload.data[2]});
        break;
        default:
            return state;
            break;
    }

}


