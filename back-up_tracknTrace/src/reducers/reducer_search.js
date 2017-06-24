
let toDt = new Date();
let fromDt = new Date(toDt.getTime() - (6 * 24 * 60 * 60 * 1000));
const INITIAL_STATE = {SearchFromDate:fromDt, SearchToDate:toDt, SearchCriteria:'', SearchValue:'' };
import {SEARCH_CRITERIA_CHANGE, SEARCH_CRITERIA_RESET} from '../actions/index';

export default function(state=INITIAL_STATE, action)
{ 
    switch(action.type)
    {
        case SEARCH_CRITERIA_CHANGE:
            return Object.assign({},state,{SearchFromDate:action.payload.SearchFromDate
                        , SearchToDate:action.payload.SearchToDate
                        , SearchCriteria:action.payload.SearchCriteria
                        , SearchValue:action.payload.SearchValue});
            break;
        case SEARCH_CRITERIA_RESET:
            return Object.assign({},state,INITIAL_STATE);
            break;        
        default:
            return state;
            break;
    }

}
