var calculateKpiExpert_Abasto={};
calculateKpiExpert_Abasto.maxReal=0;
calculateKpiExpert_Abasto.rutas={};
calculateKpiExpert_Abasto.maxPorRuta=0;
calculateKpiExpert_Abasto.rawData;

calculateKpiExpert_Abasto.calculateKPI=function(){  
  
    var serviceName;
        var apiURL;
    
        $("#cargando").css("visibility","visible");

    return new Promise((resolve, reject) => { 

        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="abasto"){
               
                serviceName=store.apiDataSources[i].serviceName;
                apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(serviceName && apiURL){

            var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
            var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();            

            //**** */

            var params="";

            if(filtroProducto!="" && filtroProducto!=undefined){
                params+="&AgrupProducto="+filtroProducto;
            }
            if(filtroRegionDestino!="" && filtroRegionDestino!=undefined){
                params+="&RegionZTDem="+filtroRegionDestino;
            }
            if(filtroRegionOrigen!="" && filtroRegionOrigen!=undefined){
                params+="&vc50_Region_UN="+filtroRegionOrigen;
            }
            if(filtroEstado!="" && filtroEstado!=undefined){
                params+="&EstadoZTDem="+filtroEstado;
            }
            if(filtroGerencia!="" && filtroGerencia!=undefined){
                params+="&GerenciaUN ="+filtroGerencia;
            }
            if(filtroUN!="" && filtroUN!=undefined){
                params+="&vc50_UN_Tact="+filtroUN;
            }

            var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador=UnidadNegocio&masivos=Todos"+params;
            
            console.log(URL);

            if(URL.indexOf("undefined" < 0)){
                d3.json(URL, function (error, data) {

                    $("#cargando").css("visibility","hidden");

                    
                    if(error){
                        alert("Error API Abasto",error);
                        resolve();
                        return;
                    }

                    if(data.error){
                        alert("Error API Abasto",data.error);
                        resolve();
                        return;
                    }                   

                    console.log("abasto",data.recordset);

                    calculateKpiExpert_Abasto.rawData=data;

                    ProcessData(data);               
                    
                    resolve();

                });
            }
        }else{
            alert("Error al encontrar URL API Abasto");
            resolve();
        }  

    });

}

function ProcessData(Data){

    var recordset=[...Data.recordset];

    var tempArr=[];

    if(filtroPresentacion!="" && filtroPresentacion!=undefined){

        for(var j=0;  j < recordset.length; j++){  
            if( recordset[j].Presentacion.toLowerCase() == filtroPresentacion ){
                
                tempArr.push(recordset[j]);
            }
        }
        var de=[];
        recordset = tempArr;

    }  

    calculateKpiExpert_Abasto.rutas={};

    console.log("data.recordset",recordset);


    for(var i=0;  i < store.cat_plantas.length; i++){

        if(entities[ store.cat_plantas[i].ID ]){

            entities[ store.cat_plantas[i].ID ].abasto={ comoOrigen:{totalReal:0,totalPlan:0,records:[],valoresRutas:{},valoresArr:[]},comoDestino:{totalReal:0,totalPlan:0,records:[],valoresRutas:{},valoresArr:[]} };
            store.cat_plantas[i].abasto=entities[ store.cat_plantas[i].ID ].abasto;

        }else{
            console.log("no se creo la U.N. a partr del catalogo: ",store.cat_plantas[i].ID);
        }                        

    }

    for(var i=0;  i < store.cat_cedis.length; i++){

        if(entities[ store.cat_cedis[i].ID ]){

            entities[ store.cat_cedis[i].ID ].abasto={ comoOrigen:{totalReal:0,totalPlan:0,records:[],valoresRutas:{},valoresArr:[]},comoDestino:{totalReal:0,totalPlan:0,records:[],valoresRutas:{},valoresArr:[] } };
            store.cat_cedis[i].abasto=entities[ store.cat_cedis[i].ID ].abasto;
            
        }else{
            console.log("no se creo la U.N. a partr del catalogo: ",store.cat_cedis[i].ID);
        }

    }

    var data={recordset:recordset}
                    
    for(var j=0;  j < data.recordset.length; j++){  

                if( entities[data.recordset[j].Destino ]  && entities[data.recordset[j].Origen ] ){

                    var idDeRuta = data.recordset[j].Destino+"_"+data.recordset[j].Origen+"_"+data.recordset[j].Transporte;

                    if( !calculateKpiExpert_Abasto.rutas[idDeRuta] )
                        calculateKpiExpert_Abasto.rutas[idDeRuta]={total:0,VolumenPlan: 0, VolumenReal:0 , origen:data.recordset[j].Origen , records:[], destino:data.recordset[j].Destino , Lat_Origen:entities[data.recordset[j].Origen ].Lat , Long_Origen:entities[data.recordset[j].Origen ].Long , Lat_Destino:entities[data.recordset[j].Destino ].Lat , Long_Destino:entities[data.recordset[j].Destino ].Long , tipo:data.recordset[j].Transporte , alturaOrigen_Inventario:0,alturaDestino_Inventario:0,alturaOrigen_Abasto:0,alturaDestino_Abasto:0  };

                    calculateKpiExpert_Abasto.rutas[idDeRuta].total+=Number(data.recordset[j].VolumenReal);
                    calculateKpiExpert_Abasto.rutas[idDeRuta].VolumenPlan+=Number(data.recordset[j].VolumenPlan);
                    calculateKpiExpert_Abasto.rutas[idDeRuta].VolumenReal+=Number(data.recordset[j].VolumenReal);

                    if(calculateKpiExpert_Abasto.maxPorRuta<calculateKpiExpert_Abasto.rutas[idDeRuta].total)
                        calculateKpiExpert_Abasto.maxPorRuta = calculateKpiExpert_Abasto.rutas[idDeRuta].total;

                    calculateKpiExpert_Abasto.rutas[idDeRuta].records.push(data.recordset[j]);

                }

                if( entities[data.recordset[j].Destino ] ){

                    entities[data.recordset[j].Destino ].abasto.comoDestino.totalPlan+=Number(data.recordset[j].VolumenPlan);
                    entities[data.recordset[j].Destino ].abasto.comoDestino.totalReal+=Number(data.recordset[j].VolumenReal);
                    entities[data.recordset[j].Destino ].abasto.comoDestino.records.push(data.recordset[j]);

                    if( !entities[data.recordset[j].Destino ].abasto.comoDestino.valoresRutas[idDeRuta] ){
                        entities[data.recordset[j].Destino ].abasto.comoDestino.valoresRutas[idDeRuta]={Origen:data.recordset[j].Origen , Destino:data.recordset[j].Destino , Plan:0,Real:0,Transporte:data.recordset[j].Transporte};
                    }

                    entities[data.recordset[j].Destino ].abasto.comoDestino.valoresRutas[idDeRuta].Plan+=Number(data.recordset[j].VolumenPlan);
                    entities[data.recordset[j].Destino ].abasto.comoDestino.valoresRutas[idDeRuta].Real+=Number(data.recordset[j].VolumenReal);

                }                           

                if( entities[data.recordset[j].Origen ] ){
                    entities[data.recordset[j].Origen ].abasto.comoOrigen.totalPlan+=Number(data.recordset[j].VolumenPlan);
                    entities[data.recordset[j].Origen ].abasto.comoOrigen.totalReal+=Number(data.recordset[j].VolumenReal);
                    entities[data.recordset[j].Origen ].abasto.comoOrigen.records.push(data.recordset[j]);

                    if( !entities[data.recordset[j].Origen ].abasto.comoOrigen.valoresRutas[idDeRuta] ){
                        entities[data.recordset[j].Origen ].abasto.comoOrigen.valoresRutas[idDeRuta]={Origen:data.recordset[j].Origen , Destino:data.recordset[j].Destino , Plan:0,Real:0,Transporte:data.recordset[j].Transporte};
                    }

                    entities[data.recordset[j].Origen ].abasto.comoOrigen.valoresRutas[idDeRuta].Plan+=Number(data.recordset[j].VolumenPlan);
                    entities[data.recordset[j].Origen ].abasto.comoOrigen.valoresRutas[idDeRuta].Real+=Number(data.recordset[j].VolumenReal);

                }
            
                
                if( entities[data.recordset[j].Destino ] ){

                    if(calculateKpiExpert_Abasto.maxReal < entities[data.recordset[j].Destino ].abasto.comoDestino.totalReal )
                        calculateKpiExpert_Abasto.maxReal = entities[data.recordset[j].Destino ].abasto.comoDestino.totalReal;

                }

                if( entities[data.recordset[j].Origen ] ){

                        if(!entities[data.recordset[j].Destino ] && !entities[data.recordset[j].Origen ]){
                            console.log("*** NO encuentra ",data.recordset[j].Destino,data.recordset[j].Origen );
                        }
                }                       

        }  

        for(var e in entities){

                for(var i in entities[e].abasto.comoOrigen.valoresRutas ){

                    var cumplimiento=0;

                    if(entities[e].abasto.comoOrigen.valoresRutas[i].Plan > 0)
                    cumplimiento=(entities[e].abasto.comoOrigen.valoresRutas[i].Real/entities[e].abasto.comoOrigen.valoresRutas[i].Plan)*100;

                    var color="#cccccc";

                    if(cumplimiento==0 && entities[e].abasto.comoOrigen.valoresRutas[i].Plan == 0){

                        color="#F000FF";
                        
                    }else if(cumplimiento==0 && entities[e].abasto.comoOrigen.valoresRutas[i].Plan > 0){

                        color="#FF9600";

                    }else if(cumplimiento <= 85){

                        color="#FF9600";

                    }else if(cumplimiento > 85 && cumplimiento <= 95){

                        color="#EAFF00";

                    }else if(cumplimiento > 95){

                        color="#00FE00";
                        
                    }

                    entities[e].abasto.comoOrigen.valoresRutas[i].cumplimiento=cumplimiento;
                    entities[e].abasto.comoOrigen.valoresRutas[i].color=color;
                    entities[e].abasto.comoOrigen.valoresRutas[i].cumplimiento=cumplimiento;

                    entities[e].abasto.comoOrigen.valoresArr.push(entities[e].abasto.comoOrigen.valoresRutas[i]);
                }


                for(var i in entities[e].abasto.comoDestino.valoresRutas ){

                        var cumplimiento=0;
                        if(entities[e].abasto.comoDestino.valoresRutas[i].Plan > 0)
                            cumplimiento=(entities[e].abasto.comoDestino.valoresRutas[i].Real/entities[e].abasto.comoDestino.valoresRutas[i].Plan)*100;

                        var color="#cccccc";

                        if(cumplimiento==0 && entities[e].abasto.comoDestino.valoresRutas[i].Plan == 0){

                            color="#F000FF";
                            
                        }else if(cumplimiento <= 85){

                            color="#FF9600";

                        }else if(cumplimiento > 85 && cumplimiento <= 95){

                            color="#EAFF00";

                        }else if(cumplimiento > 95){

                            color="#00FE00";
                            
                        }                           

                        entities[e].abasto.comoDestino.valoresRutas[i].cumplimiento=cumplimiento;
                        entities[e].abasto.comoDestino.valoresRutas[i].color=color;

                        entities[e].abasto.comoDestino.valoresArr.push(entities[e].abasto.comoDestino.valoresRutas[i]);
                }

                entities[e].abasto.comoOrigen.valoresArr=entities[e].abasto.comoOrigen.valoresArr.sort((a, b) =>   b.Real - a.Real );
                entities[e].abasto.comoDestino.valoresArr=entities[e].abasto.comoDestino.valoresArr.sort((a, b) =>   b.Real - a.Real );

        }   

        for(var e in calculateKpiExpert_Abasto.rutas){

                calculateKpiExpert_Abasto.rutas[e].color="#000000";                
                
                var cumplimiento= (calculateKpiExpert_Abasto.rutas[e].VolumenReal/calculateKpiExpert_Abasto.rutas[e].VolumenPlan)*100;

                if(calculateKpiExpert_Abasto.rutas[e].VolumenPlan == 0){

                    calculateKpiExpert_Abasto.rutas[e].color="#FF00F6";

                }else if(cumplimiento <= 85){

                    calculateKpiExpert_Abasto.rutas[e].color="#ff0000";

                }else if(cumplimiento > 85 && cumplimiento <= 95){

                    calculateKpiExpert_Abasto.rutas[e].color="#EAFF00";

                }else if(cumplimiento > 95){

                    calculateKpiExpert_Abasto.rutas[e].color="#00FE00";
                    
                }               

                calculateKpiExpert_Abasto.rutas[e].cumplimiento=cumplimiento;

        }   


}

calculateKpiExpert_Abasto.FiltraPresentacionAbasto=function(){

    ProcessData(calculateKpiExpert_Abasto.rawData);

}


calculateKpiExpert_Abasto.DrawObjects=function(){

    var alturas = d3.scale.linear()
						.domain([1,calculateKpiExpert_Abasto.maxReal])
						.range([1, 100000 ]);

                        for(var i in entities){

                            if(entities[i].tipo!="planta")
                                continue;

                            var radio=8000;		
                
                            if(entities[i].Lat){
                
                                //COMO ORIGEN +***********
                                var altura0=alturas( entities[i].abasto.comoDestino.totalPlan );
                
                                var geometry1= viewer.entities.add({
                                    name : '',
                                    position: Cesium.Cartesian3.fromDegrees( entities[i].Long ,entities[i].Lat , (altura0/2)  ),
                                    cylinder : {
                                        length : altura0,
                                        topRadius : radio,
                                        bottomRadius : radio,
                                        material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.3)              
                                        
                                    }

                                });
                
                                mapElements[geometry1.id]=entities[i];
                               

                                mapElementsArr.push(geometry1);
                                
                                var altura1=alturas( entities[i].abasto.comoDestino.totalReal );
                
                                var geometry2= viewer.entities.add({
                                    name : '',
                                    position: Cesium.Cartesian3.fromDegrees( entities[i].Long ,entities[i].Lat , (altura1/2)  ),
                                    cylinder : {
                                        length : altura1,
                                        topRadius : radio*.8,
                                        bottomRadius : radio*.8,
                                        material : Cesium.Color.fromCssColorString("#FFF21F").withAlpha(1)              
                                        
                                    }

                                });

                               
                
                                var alturaRef=altura0;

                                if(altura0<altura1)
                                    alturaRef=altura1;

                                mapElementsArr.push(geometry2);                                
                
                                //COMO DESTINO +***********
                                var altura2=alturas( entities[i].abasto.comoOrigen.totalPlan );
                
                                var geometry3= viewer.entities.add({
                                    name : '',
                                    position: Cesium.Cartesian3.fromDegrees( entities[i].Long ,entities[i].Lat, (altura2/2)+alturaRef  ),
                                    cylinder : {
                                        length : altura2,
                                        topRadius : radio,
                                        bottomRadius : radio,
                                        material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.3)              
                                        
                                    }
                                });
                
                                mapElements[geometry3.id]=entities[i];
                              

                                mapElementsArr.push(geometry3);
                
                                var altura3=alturas( entities[i].abasto.comoOrigen.totalReal );
                
                                var geometry4= viewer.entities.add({
                                    name : '',
                                    position: Cesium.Cartesian3.fromDegrees( entities[i].Long ,entities[i].Lat , (altura3/2)+alturaRef  ),
                                    cylinder : {
                                        length : altura3,
                                        topRadius : radio*.8,
                                        bottomRadius : radio*.8,
                                        material : Cesium.Color.fromCssColorString("#4989FF").withAlpha(1)              
                                        
                                    }
                                });

                                mapElementsArr.push(geometry4);

                                var alturaRef2=altura2;

                                if(altura2<altura3)
                                    alturaRef2=altura3;

                           

                                var alturaParaLinea=alturaRef2+alturaRef;
        
                                for (var  e in calculateKpiExpert_Abasto.rutas){
        
                                    if( calculateKpiExpert_Abasto.rutas[e].origen==i){
        
                                        calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Abasto =alturaParaLinea;
                                    }
                                    if( calculateKpiExpert_Abasto.rutas[e].destino==i){
        
                                        calculateKpiExpert_Abasto.rutas[e].alturaDestino_Abasto=alturaParaLinea;
                                    }
        
                                }


                            }
                    }
                
                    for(var i in entities){

                        if(entities[i].tipo!="cedis")
                            continue;
                
                        var radio=4000;		
                    
                        if(entities[i].Lat){
                
                            //COMO ORIGEN +***********
                            var altura0=alturas( entities[i].abasto.comoDestino.totalPlan );
                
                            var geometry1= viewer.entities.add({
                                name : '',
                                position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura0/2)  ),
                                cylinder : {
                                    length : altura0,
                                    topRadius : radio,
                                    bottomRadius : radio,
                                    material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.3)              
                                    
                                }
                            });			
                
                            mapElements[geometry1.id]=entities[i];
                
                            mapElements[geometry1.id].alturaGeom=altura0;
                            mapElements[geometry1.id].alturaGeom=altura0;

                            mapElementsArr.push(geometry1);
                            
                            var altura1=alturas( entities[i].abasto.comoDestino.totalReal );
                
                            var geometry2= viewer.entities.add({
                                name : '',
                                position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura1/2)  ),
                                cylinder : {
                                    length : altura1,
                                    topRadius : radio*.7,
                                    bottomRadius : radio*.7,
                                    material : Cesium.Color.fromCssColorString("#FFF21F").withAlpha(1)              
                                    
                                }
                            });
                
                            var alturaRef=altura0;
                            if(altura0<altura1)
                                alturaRef=altura1;

                            mapElementsArr.push(geometry2);
                            
                
                            //COMO DESTINO +***********
                            var altura2=alturas( entities[i].abasto.comoOrigen.totalPlan );
                
                            var geometry3= viewer.entities.add({
                                name : '',
                                position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura2/2)+alturaRef  ),
                                cylinder : {
                                    length : altura2,
                                    topRadius : radio,
                                    bottomRadius : radio,
                                    material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.3)              
                                    
                                }
                            });
                
                            mapElements[geometry3.id]=entities[i];
                            mapElements[geometry3.id].alturaGeom=(altura2/2)+alturaRef;

                            mapElementsArr.push(geometry3);
                
                            var altura3=alturas( entities[i].abasto.comoOrigen.totalReal );
                
                            var geometry4= viewer.entities.add({
                                name : '',
                                position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura3/2)+alturaRef  ),
                                cylinder : {
                                    length : altura3,
                                    topRadius : radio*.7,
                                    bottomRadius : radio*.7,
                                    material : Cesium.Color.fromCssColorString("#4989FF").withAlpha(1)              
                                    
                                }
                            });

                            mapElementsArr.push(geometry4);

                            var alturaRef2=altura2;

                            if(altura2<altura3)
                                alturaRef2=altura3;                       
                                
                                var alturaParaLinea=alturaRef2+alturaRef;
        
                                for (var  e in calculateKpiExpert_Abasto.rutas){
        
                                    if( calculateKpiExpert_Abasto.rutas[e].origen==i){
        
                                        calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Abasto =alturaParaLinea;
                                    }
                                    if( calculateKpiExpert_Abasto.rutas[e].destino==i){
        
                                        calculateKpiExpert_Abasto.rutas[e].alturaDestino_Abasto=alturaParaLinea;
                                    }
        
                                }
                        }
                    }
                

}

calculateKpiExpert_Abasto.DrawDayDetail=function(origen,destino,transporte){
    

    console.log("DrawDayDetail",origen, destino, transporte);

    d3.select("#svgTooltip6").selectAll(".abasDetail").data([]).exit().remove();

    $("#toolTip6").css("visibility","hidden");

    $("#cargando").css("visibility","visible");

    var serviceName;
    var apiURL;
    var agrupador="UnidadNegocio"; 
    var nombreCatalogoParaDiccionario;
    var diccionarioNombres=[];


    for(var i=0; i < store.apiDataSources.length; i++){
      
        if(store.apiDataSources[i].varName=="abastoDetalle"){
          
            serviceName=store.apiDataSources[i].serviceName;
            apiURL=store.apiDataSources[i].apiURL;
        }

    }

    if(serviceName && apiURL){

        var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
        var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();

        var params="";

        params+="&destino="+destino;  
              
        params+="&origen="+origen;
             
        params+="&transporte="+transporte;

        var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);

        if(URL.indexOf("undefined" < 0)){

                    dataLoader.AddLoadingTitle("Detalle de abasto");

                    d3.json(URL, function (error, data) {

                        dataLoader.DeleteLoadingTitle("Detalle de abasto"); 

                        dataLoader.HideLoadings();

                        $("#cargando").css("visibility","hidden");

                        if(error){
                          alert("Error API Detalle Abasto",error);
                          resolve();
                          return;
                        }

                        if(data.error){
                            alert("Error API Detalle Abasto",data.error);
                            resolve();
                            return;
                        }

                        console.log("Detalle Abasto",data.recordset); 

                         //FECHAS *******

                         var maxDate=0;

                         for(var j=0;  j < data.recordset.length; j++){

                               if(data.recordset[j].dtFecha!=""){

                                     if( data.recordset[j].dtFecha.indexOf("T") > -1){
                   
                                             var fechaSplit=data.recordset[j].dtFecha.split("T");
                                             
                                             fechaSplit=fechaSplit[0].split("-");                   
                     
                                     }else{
                                             
                                             var fechaSplit=data.recordset[j].dtFecha.split("-");
                       
                                     }  
                                     
                                     data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 

                                     if(maxDate < data.recordset[j].fecha.getTime())
                                          maxDate = data.recordset[j].fecha.getTime();
                               }

                         }

                     // VALIDA DIAS FALTANTES *****

                     var diasDelPeriodo={};
                     var data_=[];

                     for(var i=0; i < data.recordset.length; i++ ){

                           if(data.recordset[i].fecha){
                                 
                                   diasDelPeriodo[ data.recordset[i].fecha.getTime() ]=true;
                                   data_.push(data.recordset[i]);

                           }

                     }

                     var dia=((1000*60)*60)*24;
                     var init=dateInit.getTime();
                     var end=dateEnd.getTime();

                     for(var i=init; i < end+1000; i+=((1000*60)*60)*24 ){

                           if(!diasDelPeriodo[new Date(i).getTime()]){

                             var obj={};

                             obj.AgrupProducto="";
                             obj.DescrProducto="";
                             obj.Destino="";
                             obj.GerenciaDestinoUN="";
                             obj.GerenciaOrigenUN="";
                             obj.Origen="";
                             obj.Presentacion="";
                             obj.RegionDestinoUN="";
                             obj.RegionOrigenUN="";
                             obj.RowAbasto="";
                             obj.Transporte="";
                             obj.VolumenPlan=0;
                             obj.VolumenReal=0;

                             obj.dtFecha=String(new Date(i)),
                             obj.fecha=new Date(i);
                             data_.push(obj);

                           }

                     }

                     data.recordset=data_;

                     var arr=d3.nest()
                         .key(function(d) { 

                                 if(d.fecha){
                                         return d.fecha.getTime(); 
                                 }else{                       
                                         return 0;
                                 }                        
                 
                         })
                         .entries(data.recordset);

                     arr = arr.sort((a, b) => {  

                       return b.key - a.key; 

                     });

                     arr=arr.reverse();

                     console.log(arr);

                     var maximo=0;    
                     var maximoVolumen=0;

                     for(var i=0; i < arr.length; i++ ){

                               arr[i].Dif=0;
                               arr[i].DifPer=0;
       
                               arr[i].VolumenReal=0;
                               arr[i].VolumenPlan=0;                                   

                               for(var j=0; j < arr[i].values.length; j++ ){

                                 arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                                 arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);                                    

                               }

                               if(arr[i].VolumenPlan>0){
                                 arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                                 arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
                             } 

                             if(maximo < arr[i].VolumenReal){
                               maximo=arr[i].VolumenReal;
                             }

                             if(maximoVolumen < arr[i].DifPer*1000){
                               maximoVolumen=arr[i].DifPer*1000;
                             }                          

                     }

                     var ancho=18;

                     var svgTooltipWidth=arr.length*(ancho*1.05) ;

                     if(svgTooltipWidth < 300)
                       svgTooltipWidth=300;

                     var svgTooltipHeight=400;

                     var tamanioFuente=ancho*.8;
                     
                     $("#toolTip6").css("visibility","visible");  
                     $("#toolTip6").css("inset",""); 

                       vix_tt_formatToolTip("#toolTip6","Abasto por Día de Destino "+destino+" origen "+origen+" (TM)",svgTooltipWidth+7,svgTooltipHeight+100);         
                                         
                   
                     var marginBottom=svgTooltipHeight*.02;

                     var svgElement = "<svg id='svgTooltip6' style='pointer-events:none;'></svg>";
                     d3.select("#toolTip6").append("div").html(svgElement);
                 
                     d3.select("#svgTooltip6")                     
                         .style("width", svgTooltipWidth )
                         .style("height", (svgTooltipHeight)+50 )                
                       ;

                     //DIBUJA BARRAS

                     var lastPosY;

                     var caso=0;

                     for(var i=0; i < arr.length; i++ ){ 

                             var altura=(svgTooltipHeight*.4);

                             if(arr[i].VolumenReal==0 && arr[i].VolumenPlan==0){

                                   var altura1=1;
                                   var altura2=1;
                                   
                             }else{
         
                                   var altura1=GetValorRangos( arr[i].VolumenReal,1, maximo ,1,altura);
                                   var altura2=GetValorRangos( arr[i].VolumenPlan,1, maximo ,1,altura);
         
                             }   

                             console.log(arr[i].VolumenReal,arr[i].VolumenPlan);
                             
                             d3.select("#svgTooltip6").append("rect")		    		
                                       .attr("width",function(d){                                      
                                         return ancho*.9;
                                       })
                                       .attr("class","abastoDetail")
                                       .style("pointer-events","auto")
                                       .attr("x",(ancho*caso)  )
                                       .attr("y", ((svgTooltipHeight*.9))-altura1-80  )
                                       .attr("height",1)
                                       .attr("fill","#0068E9")
                                       .transition().delay(0).duration(i*50)
                                       .attr("height",altura1 );

                             if(lastPosY){

                                     d3.select("#svgTooltip6").append("line")       
                                                   .attr("class","ventasDetail")                                
                                                   .attr("x1",lastPosY.x+(ancho/2) )
                                                   .attr("y1", lastPosY.y   )
                                                   .attr("x2",ancho*caso+(ancho/2) )
                                                   .attr("y2", ((svgTooltipHeight*.9))-altura2-80  )
                                                   .style("stroke","#ffffff")
                                                   .style("stroke-width",2)
                                                   .style("stroke-opacity",1);
         
                             }
         
                             lastPosY={x:(ancho*caso) ,y:((svgTooltipHeight*.9))-altura2-80 };


                             d3.select("#svgTooltip6")
                                   .append("text")						
                                   .attr("class","ventasDetail")
                                   .style("fill","#ffffff")		
                                   .style("font-family","Cabin")
                                   .style("font-weight","bold")
                                   .style("font-size",tamanioFuente*.8)						
                                   .style("text-anchor","start")
                                   .style("opacity",0 )
                                   .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+1  )+","+String( ((svgTooltipHeight*.25))-10 )+")  rotate("+(-90)+") ")
                                   .text(function(){
                                     
                                     var porDif="0";

                                     if(arr[i].VolumenPlan>0){

                                       porDif = Math.round((arr[i].VolumenReal/arr[i].VolumenPlan)*100);

                                     }

                                     if(arr[i].VolumenPlan == 0 && arr[i].VolumenReal > 0){
                                       return "R: "+formatNumber(arr[i].VolumenReal)+" TM";
                                     }
                                     if(arr[i].VolumenPlan == 0 && arr[i].VolumenReal == 0){
                                       return " ";
                                     }


                                   return  "R: "+formatNumber(arr[i].VolumenReal)+" -  "+ porDif +"%";

                                   })
                                   .transition().delay(0).duration(i*50)
                                   .style("opacity",1 );

                             d3.select("#svgTooltip6")
                                   .append("text")						
                                   .attr("class","ventasDetail")
                                   .style("fill","#ffffff")		
                                   .style("font-family","Cabin")
                                   .style("font-weight","bold")
                                   .style("font-size",tamanioFuente*.8)	
                                   .style("text-anchor","end")
                                   .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight*.9)-74  )+")  rotate("+(-90)+") ")
                                   .text(function(){

                                     return  arr[i].values[0].fecha.getDate()+" "+getMes(arr[i].values[0].fecha.getMonth());

                                   });


                                   caso++; 

                     }
                       
                     // DISTRIBUYE 

                     if(  $("#nivel_cb").val() < 5){
                       vix_tt_distributeDivs(["#toolTip2","#toolTip3","#toolTip4","#toolTip6"]); 

                     } else if(origen){
                       vix_tt_distributeDivs(["#toolTip5","#toolTip4","#toolTip2","#toolTip6"]); 
                     }else{
                       vix_tt_distributeDivs(["#toolTip3","#toolTip2","#toolTip6"]); 
                     }
                     




                    });

        }
    }

    

}