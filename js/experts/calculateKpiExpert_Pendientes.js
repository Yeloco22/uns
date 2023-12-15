var pendientesEntities=[];
var campoToneladas="TN";
var campoFecha="FechaActual";

var calculateKpiExpert_Pendientes={};

calculateKpiExpert_Pendientes.calculateKPI=function(entities,cb){  

    var nivelesTarde=[
        {id:0,label:"Region",field:"Region",coordinatesSource:"cat_region"},
        {id:1,label:"Estado",field:"Estado",coordinatesSource:"cat_estado"},
        {id:2,label:"Unidad",field:"Unidad",coordinatesSource:"cat_un"},
        {id:3,label:"Zona de transporte",field:"ZonaTransporte",coordinatesSource:"cat_zt"},
        {id:4,label:"Cliente",field:"Cliente",coordinatesSource:"cat_cliente"},
        {id:5,label:"Frente",field:"Frente",coordinatesSource:"cat_frente"}
    ];
    var agrupador="";
    for(var i=0; i < nivelesTarde.length; i++){    
        if( nivelesTarde[i].id == $("#nivel_cb").val() )
             agrupador=nivelesTarde[i].field;
            
    }

    var pendientesdataSet=store.pendientes;

    if(store.pendientes_filtered)
        pendientesdataSet=store.pendientes_filtered;

    var ultimaFecha=0;
    for(var j=0; j < pendientesdataSet.length; j++){

        var date=pendientesdataSet[j][campoFecha].split("/");
        pendientesdataSet[j].fecha=new Date(date[2],Number(date[1])-1,date[0]);
        if(ultimaFecha < pendientesdataSet[j].fecha.getTime())
            ultimaFecha=pendientesdataSet[j].fecha.getTime();

    }

    console.log("ultimaFecha",new Date(ultimaFecha));

    for(var i=0;  i < entities.length; i++){  

        entities[i].pendientes={pendientes:0,values:[]};

        for(var j=0; j < pendientesdataSet.length; j++){            

            if(pendientesdataSet[j][agrupador] == entities[i].key && pendientesdataSet[j].fecha.getTime() == ultimaFecha ){

                if(pendientesdataSet[j].Compromiso_Vencido=="Compromiso vencido"){
                    entities[i].pendientes.pendientes+=Math.round(Number(pendientesdataSet[j][campoToneladas]));
                }

            }

       }

    }

    pendientesEntities=entities;

    loadsCount++;
    cb();

}



calculateKpiExpert_Pendientes.getTooltipDetail=function(entityId){    

    for(var i=0;  i < pendientesEntities.length; i++){
       
        if(pendientesEntities[i].key.toLowerCase()==entityId.toLowerCase()){
            
            var text=`<hr class="hr"><span style='color:#ffffff;font-size:15px;'>PENDIENTES: </span><br>
            <span style='color:#fff600;font-size:15px;'>Con Compromiso Vencido: <span style='color:#ffffff'>${ formatNumber(pendientesEntities[i].pendientes.pendientes) }
        

            `

            return text;
        }
            
    }
}
