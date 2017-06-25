const blockchain_util = require('./blockchain_util');
const Client = require('node-rest-client').Client;
const _ = require('lodash');
 // direct way 
const client = new Client();


//Constants
const CHAIN_CODE_ID = '3f2edbdebae67f34e73409f8c53e46d990b390e6926ddfdc9e548039fa9c68510bd5a79988a3ba1141db2962306ae0c9dd2a0016544ce12a2a898474de073dc8';
const asm_cols = blockchain_util.AssemblyCols;
const pkg_cols = blockchain_util.PackageCols;

//Variable 
let blockchain_data = {
        jsonrpc: "2.0",
        method: '',
        params: {
            type: 1,
            chaincodeID: {
            name: CHAIN_CODE_ID
            },
            ctorMsg: {
            function: '',
            args: []
            },
            secureContext: "user_type1_0"
        },
        id: 0
    }


exports.AssemblyLineInvoke = (row, uid, peer, secureContext, callback) =>{

    let status = _.filter(blockchain_util.AssemblyStatus,_.matches({"value" : row[asm_cols.STATUS]})); 
    let obj = null;
    blockchain_data.params.secureContext = secureContext;
    //console.log(blockchain_data.params.secureContext);
    obj = {error_code : -1, 
        assembly_code : row[asm_cols.ASSEMBLY_ID],
        assembly_status : row[asm_cols.STATUS],
        message : `Assembly status ${row[asm_cols.STATUS]} does not exists.`};
    //console.log(row);
    if(status.length>0){

        blockchain_data.params.ctorMsg.args = [
        row[asm_cols.ASSEMBLY_ID]
        , row[asm_cols.DEVICE_SERIAL_NO] // formValues.deviceSerialNo
        , row[asm_cols.DEVICE_TYPE] // formValues.deviceType
        , row[asm_cols.FILAMENT_BATCH] // formValues.filamentBatchId
        , row[asm_cols.LED_BATCH] // formValues.ledBatchId
        , row[asm_cols.CIRCUIT_BOARD_BATCH] // formValues.circuitBoardBatchId
        , row[asm_cols.WIRE_BATCH] // formValues.wireBatchId
        , row[asm_cols.CASING_BATCH] // formValues.casingBatchId
        , row[asm_cols.ADAPTOR_BATCH] // formValues.adaptorBatchId
        , row[asm_cols.STICK_POD_BATCH] // formValues.stickPodBatchId
        , row[asm_cols.MANUFACTURING_PLANT] // formValues.manufacturingPlant 
        , status[0].id.toString()
        , row[asm_cols.DATE] // dateToStr(formValues.assemblyDate)
        , row[asm_cols.PACKAGE_CASE]
        , row[asm_cols.COMMENT1]
        , row[asm_cols.COMMENT2]
        , uid
        ];

        var args = {
        headers: { "test-header": "client-api" },
        data: ''
        };

        switch(status[0].id){

            case 1: //created
                blockchain_data.method = 'query';
                blockchain_data.params.ctorMsg.function = 'validateCreateAssembly';
                blockchain_data.id = 0;
                args.data = JSON.stringify(blockchain_data);
     
                client.post(peer, args, function (data, response) {
                    //console.log(blockchain_data);
                    if(typeof data.error === 'undefined')//i.e success
                    {
                        blockchain_data.method = 'invoke';
                        blockchain_data.params.ctorMsg.function = 'createAssembly';
                        blockchain_data.id = 1;                        
                        args.data = JSON.stringify(blockchain_data);
                        console.log(blockchain_data);
                        client.post(peer, args, function (data, response) {
                            //console.log('within create');
                            //console.log(data);
                            if(typeof data.error === 'undefined')
                            {

                                obj = {error_code : 0, 
                                    assembly_code : row[asm_cols.ASSEMBLY_ID],
                                    assembly_status : row[asm_cols.STATUS],
                                    message : 'Assembly item created'};
                                callback(obj);
                            }
                            else{
                                //console.log(data);
                                obj = {error_code : data.error.code, 
                                    assembly_code : row[asm_cols.ASSEMBLY_ID],
                                    assembly_status : row[asm_cols.STATUS],                                    
                                    message : blockchain_util.GetActualError(data.error.data)};
                                callback(obj);                                
                            }
                        })
                    }
                    else
                    {
                        
                        obj = {error_code : data.error.code, 
                            assembly_code : row[asm_cols.ASSEMBLY_ID],
                            assembly_status : row[asm_cols.STATUS],                            
                            message : blockchain_util.GetActualError(data.error.data)};
                        callback(obj);// obj;                    
                    }
                });
                break;
                
            default : //remaining status i.e. update assembly
                blockchain_data.method = 'query';
                blockchain_data.params.ctorMsg.function = 'validateUpdateAssembly';
                blockchain_data.id = 0;                
                args.data = JSON.stringify(blockchain_data);
                //console.log(args.data);
                client.post(peer, args, function (data, response) {
                      //      console.log(data);
                    if(typeof data.error === 'undefined')//i.e success
                    {
                        blockchain_data.method = 'invoke';
                        blockchain_data.params.ctorMsg.function = 'updateAssemblyByID';
                        blockchain_data.id = 1;                        
                        args.data = JSON.stringify(blockchain_data);
                        console.log(blockchain_data);                        
                        client.post(peer, args, function (data, response) {
                        //    console.log(data);
                            if(typeof data.error === 'undefined')
                            {
                                obj = {error_code : 0, 
                                    assembly_code : row[asm_cols.ASSEMBLY_ID],
                                    assembly_status : row[asm_cols.STATUS],                                    
                                    message : 'Assembly Updated'};
                                callback(obj);
                            }
                            else{
                                obj = {error_code : data.error.code, 
                                    assembly_code : row[asm_cols.ASSEMBLY_ID],
                                    assembly_status : row[asm_cols.STATUS],                                    
                                    message : blockchain_util.GetActualError(data.error.data)};
                                callback(obj);                                
                            }
                        })
                    }
                    else
                    {
                        obj = {error_code : data.error.code, 
                            assembly_code : row[asm_cols.ASSEMBLY_ID],
                            assembly_status : row[asm_cols.STATUS],                            
                            message : blockchain_util.GetActualError(data.error.data)};
                        callback(obj);// obj;                    
                    }
                });
                break;
        }
    }
    else
    {
        callback(obj);
    }
}

exports.PackagingLineInvoke = (row, uid, peer, secureContext, callback) =>{
    let status = _.filter(blockchain_util.PackageStatus,_.matches({"value" : row[pkg_cols.PACKAGE_STATUS]})); 
    let obj = null;
    blockchain_data.params.secureContext = secureContext;
    obj = {error_code : -1, 
        packaging_code : row[pkg_cols.CASE_ID],
        packaging_status : row[pkg_cols.PACKAGE_STATUS],
        message : `Packaging status ${row[pkg_cols.PACKAGE_STATUS]} does not exists.`};
    if(status.length>0){

        blockchain_data.params.ctorMsg.args = [
        row[pkg_cols.CASE_ID]
        , row[pkg_cols.HOLDER_ASSEMBLY_ID] 
        , row[pkg_cols.CHARGER_ASSEMBLY_ID]
        , status[0].id.toString()
        , row[pkg_cols.PACKAGING_DATE] 
        , row[pkg_cols.SHIPPING_TO_ADDRESS]
        , (status[0].id==3)?'8':'7'
        , uid
        ];

        var args = {
        headers: { "test-header": "client-api" },
        data: ''
        };

        switch(status[0].id){

            case 1: //created
                blockchain_data.method = 'query';
                blockchain_data.params.ctorMsg.function = 'validateCreatePackage';
                blockchain_data.id = 0;
                args.data = JSON.stringify(blockchain_data);
     
                client.post(peer, args, function (data, response) {
                    //console.log(blockchain_data);
                    if(typeof data.error === 'undefined')//i.e success
                    {
                        blockchain_data.method = 'invoke';
                        blockchain_data.params.ctorMsg.function = 'createPackage';
                        blockchain_data.id = 1;                        
                        args.data = JSON.stringify(blockchain_data);
                        console.log(blockchain_data);
                        client.post(peer, args, function (data, response) {
                            if(typeof data.error === 'undefined')
                            {
                                obj = {error_code : -1, 
                                packaging_code : row[pkg_cols.CASE_ID],
                                packaging_status : row[pkg_cols.PACKAGE_STATUS],
                                message : `Packaging item created`};

                                callback(obj);
                            }
                            else{
                                obj = {error_code : -1, 
                                packaging_code : row[pkg_cols.CASE_ID],
                                packaging_status : row[pkg_cols.PACKAGE_STATUS],
                                message : blockchain_util.GetActualError(data.error.data)};                                
                                callback(obj);                                
                            }
                        })
                    }
                    else
                    {
                            obj = {error_code : -1, 
                            packaging_code : row[pkg_cols.CASE_ID],
                            packaging_status : row[pkg_cols.PACKAGE_STATUS],
                            message : blockchain_util.GetActualError(data.error.data)};                                
                            callback(obj);                               
                    }
                });
                break;
                
            default : //remaining status i.e. update assembly
                blockchain_data.method = 'query';
                blockchain_data.params.ctorMsg.function = 'validateUpdatePackage';
                blockchain_data.id = 0;                
                args.data = JSON.stringify(blockchain_data);
                //console.log(args.data);
                client.post(peer, args, function (data, response) {
                      //      console.log(data);
                    if(typeof data.error === 'undefined')//i.e success
                    {
                        blockchain_data.method = 'invoke';
                        blockchain_data.params.ctorMsg.function = 'updatePackage';
                        blockchain_data.id = 1;                        
                        args.data = JSON.stringify(blockchain_data);
                        //console.log(blockchain_data);                        
                        client.post(peer, args, function (data, response) {
                        //    console.log(data);
                            if(typeof data.error === 'undefined')
                            {
                                obj = {error_code : -1, 
                                packaging_code : row[pkg_cols.CASE_ID],
                                packaging_status : row[pkg_cols.PACKAGE_STATUS],
                                message : 'Package Updated'};                                
                                callback(obj);                                                               
                            }
                            else{
                                obj = {error_code : -1, 
                                packaging_code : row[pkg_cols.CASE_ID],
                                packaging_status : row[pkg_cols.PACKAGE_STATUS],
                                message : blockchain_util.GetActualError(data.error.data)};                                
                                callback(obj);                                    
                            }
                        })
                    }
                    else
                    {
                        obj = {error_code : -1, 
                        packaging_code : row[pkg_cols.CASE_ID],
                        packaging_status : row[pkg_cols.PACKAGE_STATUS],
                        message : blockchain_util.GetActualError(data.error.data)};                                
                        callback(obj);                               
                    }
                });
                break;
        }
    }
    else
    {
        callback(obj);
    }    
}