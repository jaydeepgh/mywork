export const DeviceType = [{id:1, value:'Holder'},{id:2, value:'Charger'}];


export const AssemblyStatus = [
    {id:0, value:'New'},    
    {id:1, value:'Assembly - Created'},    
    {id:2, value:'QA Failed'},
    {id:3, value:'Rectified'},
    {id:4, value:'QA Tested'}, 
    {id:5, value:'Codentified'},       
    {id:6, value:'Ready for Packaging'},
    {id:7, value:'Packaged'},
    {id:8, value:'Cancelled'},
    {id:9, value:'InActive'}];

export const AssemblySearchFields = [
    {key:'assemblyId', value:'Assembly ID'},  
    {key:'deviceSerialNo', value:'Serial Number'},    
    {key:'deviceType', value:'Device Type'},    
    {key:'filamentBatchId', value:'Filament Batch'},    
    {key:'ledBatchId', value:'Led Batch'},    
    {key:'circuitBoardBatchId', value:'Circuit Board Batch'},    
    {key:'wireBatchId', value:'Wire Batch'},  
    {key:'casingBatchId', value:'Casing Batch'},    
    {key:'adaptorBatchId', value:'Adoptor Batch'},    
    {key:'stickPodBatchId', value:'Stick Pod Batch'}]    
      







export const PackageStatus = [
        {id:0, value:'New'},
    {id:1, value:'Packaging Complete'},
    {id:2, value:'Shipped'},
    {id:3, value:'Cancelled'}        
    ];





export const UserInfo = [
    {id:'aluser1', passcode:'abcd1234', role:'Assembly', chainnode:0, secureContext : 'user_type1_0'},
    {id:'aluser2', passcode:'abcd1234', role:'Assembly', chainnode:0, secureContext : 'user_type1_0'},    
    {id:'pluser1', passcode:'abcd1234', role:'Packaging', chainnode:1, secureContext : 'user_type1_0'},
    {id:'pluser2', passcode:'abcd1234', role:'Packaging', chainnode:1, secureContext : 'user_type2_1'}
    ]        