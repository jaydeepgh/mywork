import React from 'react';
import MenuItem from 'material-ui/MenuItem';

export const FIELDS_SEARCH = {    
    SearchFromDate : {
        type : 'date',
        label : 'From',
        populatechild : null,
        disabled : false,
        onChange : null
     },          
    SearchToDate:{
        type : 'date',
        label : 'To',
        populatechild : null,
        disabled : false,
        onChange : null
     },
        SearchCriteria : {
        type : 'select',
        label : 'Select Criteria',
        populatechild : (collection) =>{
            const items = collection.map((criteria) =>
                    {
                        return(
                            <MenuItem value={criteria.key} primaryText={criteria.value} />
                        );
                    });
            return items;                    
        }
    },
        SearchValue : {
        type : 'input',
        label : 'Enter Value',
        populatechild : null,
        disabled : false,
        onChange : null
    }     
}


export const FIELDS_ADV_SEARCH = {

        SearchCriteria : {
        type : 'select',
        label : 'Select Criteria',
        populatechild : (collection) =>{
            const items = collection.map((criteria) =>
                    {
                        return(
                            <MenuItem value={criteria.key} primaryText={criteria.value} />
                        );
                    });
            return items;                    
        }
    },
        SearchValue : {
        type : 'input',
        label : 'Enter Value',
        populatechild : null,
        disabled : false,
        onChange : null
    }
}