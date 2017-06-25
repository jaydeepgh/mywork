exports.AssemblyStatus = [
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


exports.PackageStatus = [
    {id:0, value:'New'},
    {id:1, value:'Packaging Complete'},
    {id:2, value:'Shipped'},
    {id:3, value:'Cancelled'}        
    ];

exports.GetActualError = (err) =>{
    let startIndex = (err.lastIndexOf(":") + 1);
    return err.substring(startIndex);
}

exports.AssemblyCols = {
    ASSEMBLY_ID : 0,
    DEVICE_SERIAL_NO : 1,
    DEVICE_TYPE : 2,
    FILAMENT_BATCH : 3,
    LED_BATCH : 4,
    CIRCUIT_BOARD_BATCH : 5,
    WIRE_BATCH : 6,
    CASING_BATCH : 7,
    ADAPTOR_BATCH : 8,
    STICK_POD_BATCH : 9,
    MANUFACTURING_PLANT : 10,
    STATUS : 11,
    DATE : 12,
    PACKAGE_CASE : 13,
    COMMENT1 : 14,
    COMMENT2 : 15 
}

exports.PackageCols = {
    CASE_ID : 0,
    HOLDER_ASSEMBLY_ID : 1,
    CHARGER_ASSEMBLY_ID : 2,
    PACKAGE_STATUS : 3,
    PACKAGING_DATE : 4,
    SHIPPING_TO_ADDRESS : 5
//    PACKAGE_CREATED_BY 
}



