import {GET_ALL_ASSEMBLY_ITEMS, SELECT_DEVICE_TYPE, GET_ASSEMBLY_BY_ID} from '../actions/index';


import { combineReducers } from 'redux';
import assembly from './reducer_AssemblyLine';
import assembly_db from './reducer_AssemblyLine_db';

import {reducer as formReducer} from 'redux-form';
import packaging from './reducer_packaging';
//import searchdt from './reducer_search';
import packaging_db from './reducer_packaging_db';
import userstate from './reducer_user';




const CURRENT_ASSEMBLY_INITIAL_STATE = {currentAssembly:{assemblyId : ''
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
, assemblyStatus : ''
, assemblyCreationDate : ''
, assemblyLastUpdateOn : ''
, assemblyCreatedBy : '' 
, assemblyLastUpdatedBy : ''
}, devicetype:'' };



const rootReducer = combineReducers({
  userstate:userstate,
  assembly: assembly,
  //assembly_db: assembly_db,    
  packaging: packaging,
  packaging_db: packaging_db,  
  form:formReducer
});

export default rootReducer;
