//import React from ''

import {FETCT_POSTS} from '../actions/index';
const INITIAL_STATE = {all:[], post:null};


export default function(state=INITIAL_STATE, action)
{
    switch(action.type)
    {
        case FETCT_POSTS:
            return {...state, all:action.payload.data};
            
        default:
            return state;
    }
}