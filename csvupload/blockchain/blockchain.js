const blockchain_util = require('./blockchain_util');
const Client = require('node-rest-client').Client;
const _ = require('lodash');
 // direct way 
const client = new Client();


//Constants
const CHAIN_CODE_ID = '30771480f653138fab130d5cb1482e652cc2a7e9181a5343a1bf412ba4149f3600a5a056999a95439f14d335a11bd03fab92624989bb01a6195c68d2005f4e1b';
const asm_cols = blockchain_util.AssemblyCols;

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


exports.AssemblyLineInvoke = (row, uid, peer, callback) =>{

    let status = _.filter(blockchain_util.AssemblyStatus,_.matches({"value" : row[asm_cols.STATUS]})); 
    let obj = null;
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
                    //console.log(data);
                    if(typeof data.error === 'undefined')//i.e success
                    {
                        blockchain_data.method = 'invoke';
                        blockchain_data.params.ctorMsg.function = 'createAssembly';
                        blockchain_data.id = 1;                        
                        args.data = JSON.stringify(blockchain_data);
                        //console.log(args.data);
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
                console.log(args.data);
                client.post(peer, args, function (data, response) {
                      //      console.log(data);
                    if(typeof data.error === 'undefined')//i.e success
                    {
                        blockchain_data.method = 'invoke';
                        blockchain_data.params.ctorMsg.function = 'updateAssemblyByID';
                        blockchain_data.id = 1;                        
                        args.data = JSON.stringify(blockchain_data);
                        console.log(args.data);                        
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

exports.getAllAssemblies = (uid, peer, callback) =>{
    blockchain_data.method = 'query';
    blockchain_data.params.ctorMsg.function = 'getAllAssemblies';
    blockchain_data.params.ctorMsg.args = [uid];
    blockchain_data.id = 0;                
    args.data = JSON.stringify(blockchain_data);    
    client.post(peer, args, function (data, response) {
        if(typeof data.error === 'undefined')//i.e success
        {
            callback(null, JSON.parse(data.result.message));
        }
        else
        {
            callback(blockchain_util.GetActualError(data.error.data), null);
        }
    });
}

