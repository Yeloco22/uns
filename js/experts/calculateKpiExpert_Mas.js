var calculateKpiExpert_Mas={};
var MasivosEntities=[];


calculateKpiExpert_Mas.calculateKPI=function(entities,cb){  

    for(var i=0; i < store.niveles.length; i++){    
        if( store.niveles[i].id == $("#nivel_cb").val() )
             agrupador=store.niveles[i].field;
            
     }

    for(var i=0;  i < entities.length; i++){ 

        entities[i].masivos={masivos:0,cantidad:0  };

        for(var j=0;  j < entities[i].values.length; j++){ 

                if( entities[i].values[j].TipoPedido == "Masivo" ){

                    entities[i].masivos.cantidad++;

                }

        }

        entities[i].masivos.masivos=Math.round((entities[i].masivos.cantidad/entities[i].values.length)*100);


    }

    MasivosEntities=entities;

    loadsCount++;
    cb();

}



calculateKpiExpert_Mas.getTooltipDetail=function(entityId){    

    for(var i=0;  i < MasivosEntities.length; i++){
       
        if(MasivosEntities[i].key.toLowerCase()==entityId.toLowerCase()){
            
            var text=`<br><hr class="hr"><span style='color:#ffffff;font-size:15px;'>MASIVOS: </span><br>
            <span style='color:#fff600;font-size:15px;'>Volumen Entregado: <span style='color:#ffffff'>${MasivosEntities[i].masivos.masivos}% <span style='color:#ffffff;font-size:10px;'>(${formatNumber(MasivosEntities[i].masivos.cantidad)})<br>
            `

            return text;
        }
            
    }
}