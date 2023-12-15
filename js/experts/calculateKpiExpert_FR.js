var calculateKpiExpert_FR={};
var campoDeVolumenFR="CantEntFinal";
var campoDeATiempo="Estatus_Entrega_Orig_2";
var campoTotalSolicitado="CantSolFinal";

var fillRateEntities=[];

calculateKpiExpert_FR.calculateKPI=function(entities){  
    
    return new Promise((resolve, reject) => {

        var serviceName;
        var apiURL;
        var agrupador="";

        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="fillRate"){                    
                    serviceName=store.apiDataSources[i].serviceName;
                    apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(serviceName && apiURL){

            var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
            var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
           
            var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador=UnidadNegocio&masivos=Todos";
            console.log(URL);

            $("#cargando").css("visibility","visible");


            if(URL.indexOf("undefined" < 0)){

                d3.json(URL, function (error, data) {

                    $("#cargando").css("visibility","hidden");

                    if(error){
                        alert("Error API FR",error);
                        resolve();
                        return;
                    }

                    if(data.error){
                        alert("Error API FR",data.error);
                        resolve();
                        return;
                    }  

                    console.log("FR",data.recordset);


                    calculateKpiExpert_FR.data=data;

                    calculateKpiExpert_FR.ProcessData(data);


                    resolve();
                });

            }
        }


    });
}


calculateKpiExpert_FR.ProcessData=function(data){

    campoDeVolumenFR="CantEntFinal";

    var dataTemp=[];    

    if(filtroPresentacion!="" && filtroPresentacion!=undefined){

            var recordset=[...data.recordset];

            for(var i=0;  i < recordset.length; i++){

                if( recordset[i].Presentacion.toLowerCase() == filtroPresentacion ){
                    dataTemp.push(recordset[i]);
                }

            }
            
            var data={recordset:recordset};

    }

    console.log("FR data ",data.recordset);

    var entities_  = d3.nest()
                .key(function(d) { return  d.Agrupador; })                           
                .entries(data.recordset);


    for(var i=0;  i < entities_.length; i++){ 

        entities_[i].fillRate={};
        entities_[i].fillRate.totalVolumenEntregado=0;
        entities_[i].fillRate.totalSolicitado=0;

        entities_[i].fillRate.vol1=0;
        entities_[i].fillRate.vol2=0;
        entities_[i].fillRate.vol3=0;

        entities_[i].fillRate.por1=0;
        entities_[i].fillRate.por2=0;
        entities_[i].fillRate.por3=0;

        for(var k=0;  k < entities_[i].values.length; k++){

            entities_[i].fillRate.totalSolicitado+=Number(entities_[i].values[k][campoTotalSolicitado]);

            entities_[i].fillRate.totalVolumenEntregado+=Number(entities_[i].values[k][campoDeVolumenFR]);
         
            if(entities_[i].values[k][campoDeATiempo] == "A Tiempo"){
                entities_[i].fillRate.vol1+=Number(entities_[i].values[k][campoDeVolumenFR]);
            }else if(entities_[i].values[k][campoDeATiempo] == "1 a 2 días Tarde"){
                entities_[i].fillRate.vol2+=Number(entities_[i].values[k][campoDeVolumenFR]);
            }else if(entities_[i].values[k][campoDeATiempo] == "3 o más días Tarde"){
                entities_[i].fillRate.vol3+=Number(entities_[i].values[k][campoDeVolumenFR]);
            } 

            //Crea objetos fecha para cada record
            if(entities_[i].values[k].dtOnSiteFinal != ""){

                if(entities_[i].values[k].dtOnSiteFinal.indexOf("T") > -1){

                    var fechaSplit=entities_[i].values[k].dtOnSiteFinal.split("T");
                    
                    fechaSplit=fechaSplit[0].split("-");                   

                }else{
                    var fechaSplit=data[i][def.dateField].split("-");

                }                

                entities_[i].values[k].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2]));                   

            } 

        }

        if(calculateKpiExpert_FR.max < entities_[i].fillRate.totalVolumenEntregado)
        calculateKpiExpert_FR.max=entities_[i].fillRate.totalVolumenEntregado;

        if(calculateKpiExpert_FR.min > entities_[i].fillRate.totalVolumenEntregado)
            calculateKpiExpert_FR.min=entities_[i].fillRate.totalVolumenEntregado;

        entities_[i].fillRate.por1=Math.round((entities_[i].fillRate.vol1/entities_[i].fillRate.totalSolicitado)*100);
        entities_[i].fillRate.por2=Math.round((entities_[i].fillRate.vol2/entities_[i].fillRate.totalSolicitado)*100);
        entities_[i].fillRate.por3=Math.round((entities_[i].fillRate.vol3/entities_[i].fillRate.totalSolicitado)*100);

        entities_[i].fillRate.fillRate=entities_[i].fillRate.por1;

        if(entities[entities_[i].key]){
            entities[entities_[i].key].fillRate=entities_[i].fillRate.fillRate;
        }

    }

    console.log("entities_",entities_);


    DibujaFR();


}

var fr_entities=[];

function DibujaFR(){

        for(var i=0;i < fr_entities.length;i++){

            viewer.entities.remove(fr_entities[i]);
        
        }

        fr_entities=[];

        for(var e in entities){

                if(filtroInventario!="" && filtroInventario!=undefined){
                    if(filtroInventario != entities[e].inventario.tipo ){              

                        continue;           
                        
                    }
                }

                var validoFillrate=true;

                if(filtroFR!="" && filtroFR!=undefined){

                    validoFillrate=false;
                    if( filtroFR =="40" && entities[e].fillRate <= 40 ){             
                        validoFillrate=true;                        
                    }else if( filtroFR =="80" && entities[e].fillRate <= 80 ){
                        validoFillrate=true;
                    }else if( filtroFR =="90" && entities[e].fillRate <= 90 ){
                        validoFillrate=true;
                    }

                }
                if(!validoFillrate){
                    continue;
                }

                var color="#4C4C4C";

                if(entities[e].fillRate >= 91){
                    color="#42BB00";
                }else if(entities[e].fillRate <= 75 && entities[e].fillRate > 40){
                    color="#FF0000";
                }else if(entities[e].fillRate <= 40){
                    color="#EE00F1";
                }else{
                    console.log("U.N. no encontrada en FR: ",entities[e].ID);
                }

                var radio = 15000;                         

                var geometry1= viewer.entities.add({

                                name : '',
                                position: Cesium.Cartesian3.fromDegrees( entities[e].Long , entities[e].Lat , -3000  ),
                                cylinder : {
                                    length : 10,
                                    topRadius : radio,
                                    bottomRadius : radio,
                                    material : Cesium.Color.fromCssColorString(color).withAlpha(.2)              
                                    
                                }
                            });

                fr_entities.push(geometry1);

        }

}
