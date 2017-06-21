import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import {selectDeviceType} from './actions/index';


export const FIELDS_ASSEMBLY = {
    assemblyId : {
        type : 'input',
        label : 'Assembly ID',
        populatechild : null,
        disabled : true,
        onChange : null
     },
         manufacturingPlant : {
        type : 'input',
        label : 'Manufacturing Plant',
        populatechild : null,
        disabled : false,
        onChange : null
     },
         assemblyStatus : {
        type : 'select',
        label : 'Assembly Status',
        populatechild : (statuses) =>{
            const items = statuses.map((status) =>
                    {
                        return(
                            <MenuItem value={status.id} primaryText={status.value} />
                        );
                    });
            return items;                    
        },
        disabled : false,
        onChange : null
     },
    assemblyDate : {
        type : 'date',
        label : 'Creation Date',
        populatechild : null,
        disabled : false,
        onChange : null
     },          
    assemblyLastUpdateOn:{
        type : 'date',
        label : 'Last Update Date',
        populatechild : null,
        disabled : true,
        onChange : null
     },
     deviceType:{
        type : 'select',
        label : 'Device Type',
        populatechild : (deviceTypes) =>{
            const items = deviceTypes.map((type) =>
                    {
                        return(
                            <MenuItem value={type.value} primaryText={type.value} />
                        );
                    });
            return items;                    
        },
        disabled:false,
        onChange : null               
    },
         deviceSerialNo : {
        type : 'input',
        label : 'Device Serial ID',
        populatechild : null,
        disabled : false,
        onChange : null
     }
}    

export const FIELDS_HOLDER = {

         filamentBatchId : {
        type : 'input',
        label : 'Filament Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     },
         ledBatchId : {
        type : 'input',
        label : 'LED Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     },
         circuitBoardBatchId : {
        type : 'input',
        label : 'Circuit-board Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     },
         casingBatchId : {
        type : 'input',
        label : 'Casing Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     },
         stickPodBatchId : {
        type : 'input',
        label : 'Stick-Pod Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     }     
}

export const FIELDS_CHARGER= {
         wireBatchId : {
        type : 'input',
        label : 'Wire Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     },
         adaptorBatchId : {
        type : 'input',
        label : 'Adaptor Batch Id',
        populatechild : null,
        disabled : false,
        onChange : null
     }
}

