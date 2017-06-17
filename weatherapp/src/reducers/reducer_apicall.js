import {CALL_API} from '../actions/index';

const INITIAL_STATE = {data:''};


export default function(state=INITIAL_STATE, action)
{
    switch(action.type)
    {
        
        case CALL_API:
            //console.log('here ' + action.payload);
            return action.payload.data;
    }

    return state;
}