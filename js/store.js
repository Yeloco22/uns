const _bkserver = "https://uscldv3dwad01-preprod.azurewebsites.net/api";

var store={
   dataToDraw:[],
   mainDataset:"fillRate",
   dataSources:[

    ],
    apiDataSources:[
        {apiURL:_bkserver,serviceName:"getSP/Cadena/Generico?spname=Vis_Cat_GetPlantas",storeProc:"Vis_Cat_GetPlantas" ,varName:"cat_plantas",onInitLoad:true,useDateFilters:true},
        {apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatRegion" ,varName:"cat_region",onInitLoad:true,useDateFilters:false},
        {apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatEstado" ,varName:"cat_estado",onInitLoad:true,useDateFilters:false},
        {apiURL:_bkserver,serviceName:"getSP/Cadena/Generico?spname=Vis_Cat_GetCedis",storeProc:"Vis_Cat_GetCedis" ,varName:"cat_cedis",onInitLoad:true,useDateFilters:true} , 
        {apiURL:_bkserver,serviceName:"getSP/Cadena/Generico?spname=Vis_Cat_GetCedis",storeProc:"Vis_Cat_GetCedis" ,varName:"cat_cedis",onInitLoad:true,useDateFilters:true} ,   
        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_KPI_Abasto_FillRate",varName:"abasto",onInitLoad:false,useDateFilters:true},
        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_FillRate_conParams",tableName:"d",varName:"fillRate",dateField:"dtOnSiteFinal",onInitLoad:false,useDateFilters:true,useGroup:true},
        {apiURL:_bkserver ,serviceName:"getSP/VIS_Inventarios",tableName:"d",varName:"inventario",dateField:"dtOnSiteFinal",onInitLoad:false,useDateFilters:true,useGroup:true},
        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_KPI_Abasto_Detalle",varName:"abastoDetalle",onInitLoad:false,useDateFilters:false},
        {apiURL:_bkserver ,serviceName:"getSP/JDA_DesgloseProduccion",varName:"produccion",onInitLoad:false,useDateFilters:true}
        
    ],

    catlogsForFilters:[
        
            {data:"cat_region",placeholder:"Region",id:"cat_region",type:"autoComplete",nameOnFR:"RegionZT"},
            {data:"cat_estado",placeholder:"Estado",id:"cat_estado",type:"autoComplete",nameOnFR:"EstadoZT"},
            {data:"cat_un",placeholder:"Unidad Negocio",id:"cat_un",type:"autoComplete",nameOnFR:"Unidad_de_Negocio"},
            {data:"cat_zt",placeholder:"Zona Transporte",id:"cat_zt",type:"autoComplete",nameOnFR:"ZonaTransporte"},
            {data:"cat_cliente",placeholder:"Cliente",id:"cat_cliente",type:"autoComplete",nameOnFR:"Cliente"}
            
        ],
    
    niveles:[
        {id:0,label:"Región",field:"RegionZT",coordinatesSource:"cat_region",storeProcedureField:"Region"},
        {id:1,label:"Estado",field:"EstadoZTDem",coordinatesSource:"cat_estado",storeProcedureField:"Estado"},
        {id:2,label:"Unidad de Negocio",field:"Unidad_de_Negocio",coordinatesSource:"cat_un",storeProcedureField:"UnidadNegocio"},
        {id:3,label:"Zona de transporte",field:"ZonaTransporte",coordinatesSource:"cat_zt",storeProcedureField:"ZT"},       
        {id:5,label:"Frente",field:"Frente",coordinatesSource:"cat_frente",storeProcedureField:"Frente"}
    ]

};