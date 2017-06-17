
let toDt = new Date();
let fromDt = new Date(toDt.getTime() - (7 * 24 * 60 * 60 * 1000));
const INITIAL_STATE = {SearchFromDate:fromDt, SearchToDate:toDt};
import {SEARCH_FROM_DATE_CHANGE, SEARCH_TO_DATE_CHANGE} from '../actions/index';

export default function(state=INITIAL_STATE, action)
{ 
    switch(action.type)
    {
        case SEARCH_FROM_DATE_CHANGE:
            return Object.assign({},state,{SearchFromDate:action.payload});
            break;
        case SEARCH_TO_DATE_CHANGE:
            return Object.assign({},state,{SearchToDate:action.payload});                                        
            break;
        default:
            return state;
            break;
    }

}
