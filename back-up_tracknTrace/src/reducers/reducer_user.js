import {SET_USER, CLEAR_USER} from '../actions/index';


const INITIAL_STATE = {id:'', role:'', chainnode_url:null, secureContext:''}

export default function(state=INITIAL_STATE, action)
{         //console.log(action.type, action.payload);

    switch(action.type)
    {

        case SET_USER:
            return Object.assign({},state,{id:action.payload.id, role:action.payload.role, chainnode_url:action.payload.node_url, secureContext: action.payload.secureContext});
            break;
        case CLEAR_USER:
            return Object.assign({},state,{id:action.payload.id, role:action.payload.role, chainnode_url:action.payload.node_ur, secureContext: action.payload.secureContextl});        
            break;
        default:
            return state;
            break;
    }

}