import React from 'react';
import MenuItem from 'material-ui/MenuItem';


export const FIELDS_PACKAGING = {
caseId : {
        type : 'input',
        label : 'Case ID',
        populatechild : null,
        disabled : true,
        onChange : null
     }
, holderAssemblyId : {
        type : 'select',
        label : 'Holder Assembly ID',
        populatechild : (collections) =>{
            const items = collections.map((item) =>
                    {
                        //console.log();
                        return(
                            <MenuItem value={item.assemblyId} primaryText={item.deviceSerialNo} />
                        );
                    });
            return items;                    
        },
        disabled:false,
        onChange : null               
    }
, chargerAssemblyId : {
        type : 'select',
        label : 'Charger Assembly ID',
        populatechild : (collections) =>{
            const items = collections.map((item) =>
                    {
                        return(
                            <MenuItem value={item.assemblyId} primaryText={item.deviceSerialNo} />
                        );
                    });
            return items;                    
        },
        disabled:false,
        onChange : null               
    }
, packageStatus : {
        type : 'select',
        label : 'Packaging Status',
        populatechild : (collections) =>{
            const items = collections.map((item) =>
                    {
                        return(
                            <MenuItem value={item.id} primaryText={item.value} />
                        );
                    });
            return items;                    
        },
        disabled:true,
        onChange : null               
    }
, packagingDate :  {
        type : 'date',
        label : 'Packaging Date',
        populatechild : null,
        disabled : false,
        onChange : null
     }
, shippingToAddress : {
        type : 'input',
        label : 'Shipping Address',
        populatechild : null,
        disabled : false,
        onChange : null
     }
}