var calculateKpiExpert_OOS={};
var campoDeVolumenFR="CantEntfinal";
var oosEntities=[];
var OOS_values={};
var OOS_UN_values={};

calculateKpiExpert_OOS.calculateKPI=function(entities,cb){  

        OOS_values={};
        OOS_UN_values={};
        
        for(var i=0; i < store.oos.length; i++){

                var id=store.oos[i]["Año"]+"_"+store.oos[i]["Mes"]+"_"+store.oos[i]["DescrProducto"]+"_"+store.oos[i]["Origen"];
                var id_UN=store.oos[i]["Año"]+"_"+store.oos[i]["Mes"]+"_"+store.oos[i]["Origen"];

                if(!OOS_values[id])
                        OOS_values[id]={ Anio:store.oos[i]["Año"],Mes:store.oos[i]["Mes"],DescrProducto:store.oos[i]["DescrProducto"],Origen:store.oos[i]["Origen"],_1:0,_0:0,perOOS:0,values:[]};

                if(!OOS_UN_values[id_UN])
                        OOS_UN_values[id_UN]={ Anio:store.oos[i]["Año"],Mes:store.oos[i]["Mes"],Origen:store.oos[i]["Origen"],_1:0,_0:0,perOOS:0,values:[]};


                OOS_values[id].values.push(store.oos[i]);
                OOS_UN_values[id_UN].values.push(store.oos[i]);


                if( Number(store.oos[i].OOS) == 1 ){
                        OOS_values[id]._1++;
                        OOS_UN_values[id_UN]._1++;
                }else if(Number(store.oos[i].OOS) == 0){
                        OOS_values[id]._0++;
                        OOS_UN_values[id_UN]._0++;
                }

                OOS_values[id].perOOS= OOS_values[id]._1/OOS_values[id].values.length;
                OOS_UN_values[id_UN].perOOS= OOS_UN_values[id_UN]._1/OOS_UN_values[id_UN].values.length;

        }

       
        for(var i=0; i < entities.length; i++){
               
                entities[i].oos={oos:0,grupos:{},cantEntFinal:0,unidades:{}};

                for(var j=0; j < entities[i].values.length; j++){
                        
                        var id=String(entities[i].values[j].fecha.getFullYear())+"_"+String(entities[i].values[j].fecha.getMonth()+1)+"_"+entities[i].values[j].Producto_Tactician+"_"+entities[i].values[j].vc50_UN_Tact;
                        var id_UN=String(entities[i].values[j].fecha.getFullYear())+"_"+String(entities[i].values[j].fecha.getMonth()+1)+"_"+entities[i].values[j].vc50_UN_Tact;

                        if(OOS_values[id]){

                                if(!entities[i].oos.grupos[id]){
                                        entities[i].oos.grupos[id]={oos:OOS_values[id].perOOS , cantEntTotal:0,oosPer:OOS_values[id].perOOS,producto:entities[i].values[j].Producto_Tactician , origen:entities[i].values[j].vc50_UN_Tact , anio:String(entities[i].values[j].fecha.getFullYear()) , mes:String(entities[i].values[j].fecha.getMonth()+1) };
                                }

                                entities[i].oos.cantEntFinal+=Number(entities[i].values[j][campoDeVolumenFR]);
                        
                                entities[i].oos.grupos[id].cantEntTotal+=Number(entities[i].values[j][campoDeVolumenFR]);
                                entities[i].oos.grupos[id].perVsEntregado=entities[i].oos.grupos[id].cantEntTotal/entities[i].oos.cantEntFinal;
                                entities[i].oos.grupos[id].oosVal=OOS_values[id].perOOS*entities[i].oos.grupos[id].perVsEntregado;
                                

                        }
                        
                        if(OOS_UN_values[id_UN]){

                                if(!entities[i].oos.unidades[id_UN]){
                                        entities[i].oos.unidades[id_UN]={cantEntTotal:0,oosPer:OOS_UN_values[id_UN].perOOS,origen:OOS_UN_values[id_UN].Origen};
                                }

                                entities[i].oos.cantEntFinal+=Number(entities[i].values[j][campoDeVolumenFR]);
                        
                                entities[i].oos.unidades[id_UN].cantEntTotal+=Number(entities[i].values[j][campoDeVolumenFR]);
                                entities[i].oos.unidades[id_UN].perVsEntregado=entities[i].oos.unidades[id_UN].cantEntTotal/entities[i].oos.cantEntFinal;
                                entities[i].oos.unidades[id_UN].oosVal=OOS_UN_values[id_UN].perOOS*entities[i].oos.unidades[id_UN].perVsEntregado;                                

                        }


                }
                
                for (var e in entities[i].oos.grupos){                        
                        entities[i].oos.oos+=entities[i].oos.grupos[e].oosVal;
                }
                
                entities[i].oos.oos=Math.round(entities[i].oos.oos*1000)/10;
        }
      
        console.log(entities);

        oosEntities=entities;
        
        loadsCount++;
        cb();

}



calculateKpiExpert_OOS.getTooltipDetail=function(entityId){    

        for(var i=0;  i < oosEntities.length; i++){
           
            if(oosEntities[i].key.toLowerCase()==entityId.toLowerCase()){
    
                
                var text=`<hr class="hr"><span style='color:#ffffff;font-size:15px;'>OOS: </span><br>
                <span style='color:#fff600;font-size:15px;'>Total: <span style='color:#ffffff'>${ Math.round(oosEntities[i].oos.oos*1000)/1000 }% 
            
    
                `
    
                return text;
            }
                
        }
    }



calculateKpiExpert_OOS.downloadCSV=function(entityId){ 

        for(var i=0;  i < oosEntities.length; i++){

                if(oosEntities[i].key == entityId){

                        var csv = 'Año,Mes,Origen,Producto,          Volumen Entregado,Porcentaje OOS,Volumen OOS,% Volumen vs Total Entregado\n'; 

                        var LLaves=["anio","mes","origen","producto","cantEntTotal",  "oosPer",       "oosVal","perVsEntregado"];

                        //merge the data with CSV  
                        for(var e in oosEntities[i].oos.grupos){

                                for(var j=0;  j < LLaves.length; j++){
                                        csv +=oosEntities[i].oos.grupos[e][LLaves[j]]+',';
                                }
                
                                csv += "\n";  
                        };  

                        var hiddenElement = document.createElement('a'); 
                       
                        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
                        hiddenElement.target = '_blank';                       
                       
                        hiddenElement.download = 'OOS nivel_'+$("#nivel_cb").val()+' '+entityId+' '+$('#datepicker').val()+' al '+$('#datepicker2').val()+' .csv';  
                        hiddenElement.click(); 

                }
        
        }

}  