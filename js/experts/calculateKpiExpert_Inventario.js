var calculateKpiExpert_Inventario={};
calculateKpiExpert_Inventario.max=0;
calculateKpiExpert_Inventario.maxCedis=0;
var initDate=1000000000000000000000000000;
var lastDate=0;
var dataInventario;
calculateKpiExpert_Inventario.data;
var fechasDisponiblesArr=[];
var maximoInventarioFisicoPorDia=0;
var fechasDisponibles={};



calculateKpiExpert_Inventario.calculateKPI=function(entities){ 

    return new Promise((resolve, reject) => {

        var serviceName;
        var apiURL;
        var agrupador="";

        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="inventario"){                    
                    serviceName=store.apiDataSources[i].serviceName;
                    apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(serviceName && apiURL){

            var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
            var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
           
            var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador=UnidadNegocio&masivos=Todos";
            console.log(URL);

            if(URL.indexOf("undefined" < 0)){
                
                $("#cargando").css("visibility","visible");


                d3.json(URL, function (error, data) {

                        $("#cargando").css("visibility","hidden");

                        if(error){
                            alert("Error API Inventario",error);
                            resolve();
                            return;
                        }

                        if(data.error){
                            alert("Error API Inventario",data.error);
                            resolve();
                            return;
                        } 

                        console.log("Inventario",data.recordset);

                        var rows=data.recordset;

                        for(var i=0;  i < rows.length; i++){

                                rows[i].Capacidad=Number(rows[i]["Capacidad"]);
                                rows[i].Fisico=Number(rows[i]["Fisico"]);
                                rows[i].Transito=Number(rows[i]["Transito"]);
                                rows[i].Minimo=Number(rows[i]["Minimo"]);
                                rows[i].Optimo=Number(rows[i]["Optimo"]);

                                if(rows[i].dtFecha){

                                    var fechaSplit1=rows[i].dtFecha.split("T");
                                    var fechaSplit=fechaSplit1[0].split("-");                                   
                                    rows[i].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2]));  

                                }

                        }

                        calculateKpiExpert_Inventario.data=rows;

                        calculateKpiExpert_Inventario.ProcessDates(rows);                       
                            
                        calculateKpiExpert_Inventario.ProcessData(rows);                    

                        resolve();

                });

            }

        }

    });

}


calculateKpiExpert_Inventario.ProcessDates=function(rows){   
        
        maximoInventarioFisicoPorDia=0;

        fechasDisponibles={};

        for(var i=0;  i < rows.length; i++){

                var validoUNSelected=true;

                if(filtroUNSeleccionada!="" && filtroUNSeleccionada!=undefined){
                    
                    validoUNSelected=false;
                    if( filtroUNSeleccionada ==  rows[i].Destino ){             
                        validoUNSelected=true;    
                                        
                    }                            

                }

                if(!validoUNSelected){
                    continue;
                }

                var validoPresentacion=true;

                if(filtroPresentacion!="" && filtroPresentacion!=undefined){

                    validoPresentacion=false;

                    if( rows[i].Presentacion.toLowerCase() == filtroPresentacion ){
                        validoPresentacion=true;
                    }

                }

                if( !validoPresentacion ){
                    continue;
                }

                if(rows[i].dtFecha){                

                    if(!fechasDisponibles[rows[i].fecha.getTime()])
                                fechasDisponibles[rows[i].fecha.getTime()]={fecha:rows[i].fecha , unix:rows[i].fecha.getTime(),Fisico:0, Transito:0, values:[] } ;

                    fechasDisponibles[rows[i].fecha.getTime()].Fisico+=Number(rows[i].Fisico);
                    fechasDisponibles[rows[i].fecha.getTime()].Transito+=Number(rows[i].Transito);
                    fechasDisponibles[rows[i].fecha.getTime()].values.push(rows[i]);

                    if(maximoInventarioFisicoPorDia < fechasDisponibles[rows[i].fecha.getTime()].Fisico)
                        maximoInventarioFisicoPorDia = fechasDisponibles[rows[i].fecha.getTime()].Fisico;

                     if(maximoInventarioFisicoPorDia < fechasDisponibles[rows[i].fecha.getTime()].Transito)
                        maximoInventarioFisicoPorDia = fechasDisponibles[rows[i].fecha.getTime()].Transito;


                    if(lastDate < rows[i].fecha.getTime())
                        lastDate = rows[i].fecha.getTime();
                    if(initDate > rows[i].fecha.getTime())
                        initDate = rows[i].fecha.getTime();

                }

        }

        fechasDisponiblesArr=[];
                        
        for(var e in fechasDisponibles){
            fechasDisponiblesArr.push(fechasDisponibles[e]);
        }        

        fechasDisponiblesArr=fechasDisponiblesArr.sort((a, b) =>   b.unix - a.unix );

        Stage.DrawTimeline();
        
}


calculateKpiExpert_Inventario.ProcessData=function(rows,date){        
        
        var dataTemp=[];
        var dateToMatch=date;

        if(!date){
            dateToMatch=lastDate;
        }

        for(var i=0;  i < rows.length; i++){

            if(rows[i].fecha.getTime()==dateToMatch){
                dataTemp.push(rows[i]);
            }

        }

      
        rows=dataTemp;

        dataTemp=[];

        if(filtroPresentacion!="" && filtroPresentacion!=undefined){
    
            for(var j=0;  j < rows.length; j++){  
                if( rows[j].Presentacion.toLowerCase() == filtroPresentacion ){
                    
                    dataTemp.push(rows[j]);
                }
            }
            var de=[];
            rows=dataTemp;
    
        }          


        dataInventario=rows;

        calculateKpiExpert_Inventario.max=0;
        calculateKpiExpert_Inventario.maxCedis=0;

        for(var e in entities ){
            
            entities[e].inventario={Fisico:0,Transito:0,Minimo:0,Optimo:0,Capacidad:0, values:[] };            
            
        }

        for(var i=0;  i < rows.length; i++){

            if(rows[i].dtFecha){                                     

                        if( entities[rows[i].Destino] ){

                            if(!entities[rows[i].Destino].inventario){
                                entities[rows[i].Destino].inventario={Fisico:0,Transito:0,Minimo:0,Optimo:0,Capacidad:0, values:[]};
                            }                           
                        
                            if(rows[i].Fisico && String(rows[i].Fisico)!="NaN")
                                entities[rows[i].Destino].inventario.Fisico+=Number(rows[i].Fisico);

                 
                            if(rows[i].Transito && String(rows[i].Transito)!="NaN"){
                                
                                entities[rows[i].Destino].inventario.Transito+=Number(rows[i].Transito);
                            }     

                            entities[rows[i].Destino].inventario.values.push(rows[i]);                  
                            
                            if(rows[i].Minimo && String(rows[i].Minimo)!="NaN")
                                entities[rows[i].Destino].inventario.Minimo+=Number(rows[i].Minimo);
                            if(rows[i].Optimo && String(rows[i].Optimo)!="NaN")
                                entities[rows[i].Destino].inventario.Optimo+=Number(rows[i].Optimo);
                            if(rows[i].Capacidad && String(rows[i].Capacidad)!="NaN")
                                entities[rows[i].Destino].inventario.Capacidad+=Number(rows[i].Capacidad);

                            if(calculateKpiExpert_Inventario.max < entities[rows[i].Destino].inventario.Capacidad)
                                calculateKpiExpert_Inventario.max = entities[rows[i].Destino].inventario.Capacidad;

                            if(entities[rows[i].Destino].tipo=="cedis"){
                                if(calculateKpiExpert_Inventario.maxCedis < entities[rows[i].Destino].inventario.Capacidad)
                                calculateKpiExpert_Inventario.maxCedis = entities[rows[i].Destino].inventario.Capacidad;
                            }

                            if(entities[rows[i].Destino].inventario.Fisico < entities[rows[i].Destino].inventario.Minimo){
                                
                                entities[rows[i].Destino].inventario.tipo="menor_minimo";
                            }else if(entities[rows[i].Destino].inventario.Fisico > entities[rows[i].Destino].inventario.Minimo && entities[rows[i].Destino].inventario.Fisico < entities[rows[i].Destino].inventario.Optimo){                                                    
                            
                                entities[rows[i].Destino].inventario.tipo="equilibrio";
                            }
                            else if(entities[rows[i].Destino].inventario.Fisico > entities[rows[i].Destino].inventario.Optimo){                                                    
                            
                                entities[rows[i].Destino].inventario.tipo="mayor_optimo";
                            }

                        }else{

                            console.log("no se encontro UN",rows[i].Destino);
                        }

            }

        }

}

var modoAlturaCedis="absoluto";
function CambiaModoAlturaCedis(){

    console.log("CambiaModoAlturaCedis");

    if(modoAlturaCedis=="absoluto"){
        modoAlturaCedis="relativo";
    }else{
        modoAlturaCedis="absoluto"
    }

    calculateKpiExpert_Inventario.DrawObjects();
}

calculateKpiExpert_Inventario.DrawObjects=function(){ 
    
            for(var i=0;i < mapElementsArr.length;i++){

                viewer.entities.remove(mapElementsArr[i]);

            }

            mapElementsArr=[];

            for(var i in entities ){

                var validoFillrate=true;

                if(filtroFR!="" && filtroFR!=undefined){

                    if(entities[i].fillRate){
                        validoFillrate=false;
                        if( filtroFR =="40" && entities[i].fillRate <= 40 ){             
                            validoFillrate=true;                        
                        }else if( filtroFR =="80" && entities[i].fillRate <= 80 ){
                            validoFillrate=true;
                        }else if( filtroFR =="90" && entities[i].fillRate <= 90 ){
                            validoFillrate=true;
                        }
                    }                   

                }

                if(!validoFillrate){
                    continue;
                }              

                if(entities[i].tipo=="cedis"){
                    
                    var radio=7000;

                    if(modoAlturaCedis=="relativo"){

                        var alturas = d3.scale.linear()
                                .domain([1,calculateKpiExpert_Inventario.maxCedis])
                                .range([1, 300000 ]);

                    }if(modoAlturaCedis=="absoluto"){

                        var alturas = d3.scale.linear()
                                .domain([1,calculateKpiExpert_Inventario.max])
                                .range([1, 50000 ]);

                    }

                }else{
                    
                    var radio=13000;
                    var alturas = d3.scale.linear()
                            .domain([1,calculateKpiExpert_Inventario.max])
                            .range([1, 300000 ]);
                    
                }

                if(entities[i].Long && entities[i].Lat && entities[i].inventario ){

                        var tipo;

                        var colorBase="#ffffff";

                        if(entities[i].inventario.Fisico < entities[i].inventario.Minimo){
                            colorBase="#ff0000";
                            tipo="menor_minimo";

                        }else if(entities[i].inventario.Fisico > entities[i].inventario.Minimo && entities[i].inventario.Fisico <  entities[i].inventario.Minimo+((entities[i].inventario.Optimo-entities[i].inventario.Minimo)*.1)  ){
                            
                            colorBase="#FFAE00";
                            tipo="equilibrio";
                        }else if(entities[i].inventario.Fisico > entities[i].inventario.Minimo && entities[i].inventario.Fisico < entities[i].inventario.Optimo){
                            
                            colorBase="#FCFF0F";
                            tipo="equilibrio";
                        }
                        else if(entities[i].inventario.Fisico > entities[i].inventario.Optimo){
                            
                            colorBase="#10E800";
                            tipo="mayor_optimo";
                        }

                        entities[i].inventario.colorBase=colorBase;

                        //VASO TRANSPARENTE DE CAPACIDAD +***********
                        var alturaParaLinea=0;

                        var altura0=alturas( entities[i].inventario.Capacidad );
                        
                        if(entities[i].tipo=="cedis"){

                            var geometry1= viewer.entities.add({
                                name : '',
                                position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura0/2)  ),
                                cylinder : {
                                    length : altura0,
                                    topRadius : 500,
                                    bottomRadius : 500,
                                    material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(1)              
                                    
                                }
                            });

                        }else{

                            var geometry1= viewer.entities.add({
                                name: "",
                                position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat , (altura0/2)  ),
                                box: {
                                  dimensions: new Cesium.Cartesian3(1000, 1000, altura0),
                                  material: Cesium.Color.fromCssColorString("#ffffff").withAlpha(1),
                                },
                            });

                        }     
                        
                        geometry1.tipo=tipo;

                        mapElementsArr.push(geometry1);

                        entities[i].altura1=altura0;

                        mapElements[geometry1.id]=entities[i];                        

                        // FISICO 
                        var altura2=alturas( entities[i].inventario.Fisico);
                        
                        if(entities[i].tipo=="cedis"){

                                var geometry2= viewer.entities.add({
                                    name : '',
                                    position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura2/2)  ),
                                    cylinder : {
                                        length : altura2,
                                        topRadius : radio*.8,
                                        bottomRadius : radio*.8,
                                        material : Cesium.Color.fromCssColorString(colorBase).withAlpha(1)              
                                        
                                    }
                                });

                        }else{

                                var geometry2= viewer.entities.add({
                                    name: "",
                                    position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat , (altura2/2)  ),
                                    box: {
                                    dimensions: new Cesium.Cartesian3(radio*1.3, radio*.9, altura2),
                                    material:Cesium.Color.fromCssColorString(colorBase).withAlpha(1)  ,
                                    },
                                });

                        }                        

                        entities[i].altura2=altura2;

                        mapElementsArr.push(geometry2);

                        geometry2.tipo=tipo;

                        mapElements[geometry2.id]=entities[i];                        

                        if(altura0 > altura2){
                            alturaParaLinea=altura0;
                        }else{
                            alturaParaLinea=altura2;
                        }
                        if(alturaParaLinea < 1000)
                        alturaParaLinea=1000;
                        
                        mapElements[geometry1.id].alturaGeom=alturaParaLinea;
                        mapElements[geometry2.id].alturaGeom=alturaParaLinea;

                        for (var  e in calculateKpiExpert_Abasto.rutas){

                            if( calculateKpiExpert_Abasto.rutas[e].origen==i){

                                calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Inventario=alturaParaLinea;
                            }
                            if( calculateKpiExpert_Abasto.rutas[e].destino==i){

                                calculateKpiExpert_Abasto.rutas[e].alturaDestino_Inventario=alturaParaLinea;
                            }

                        }

                        var radioAros=radio*.6;
                        if(entities[i].tipo=="cedis")
                            radioAros=radio;

                   
                         // OPTIMO 
                         var altura3=alturas( entities[i].inventario.Optimo);
                         
                         if(entities[i].tipo=="cedis"){                

                            var geometry3= viewer.entities.add({
                                name: "",
                                position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat ,altura3  ),
                                box: {
                                dimensions: new Cesium.Cartesian3(radio*2.5, radio*.5, 10),
                                material:Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.8)  ,
                                },
                            });

                            
                        }else{

                            var geometry3= viewer.entities.add({
                                name: "",
                                position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat ,altura3  ),
                                box: {
                                dimensions: new Cesium.Cartesian3(radio*2, radio*.3, 10),
                                material:Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.8)  ,
                                },
                            });

                        }

                        geometry3.tipo=tipo;
 
                        mapElementsArr.push(geometry3);

                         // MÍNIMO 
                        var altura4=alturas( entities[i].inventario.Minimo);
                        
                        if(entities[i].tipo=="cedis"){

                                    var geometry4= viewer.entities.add({
                                            name: "",
                                            position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat ,altura4  ),
                                            box: {
                                            dimensions: new Cesium.Cartesian3(radio*2.5, radio*.5, 10),
                                            material:Cesium.Color.fromCssColorString("#FFBB19").withAlpha(.8)  ,
                                            },
                                        });


                        }else{
                                    var geometry4= viewer.entities.add({
                                        name: "",
                                        position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat ,altura4  ),
                                        box: {
                                        dimensions: new Cesium.Cartesian3(radio*2, radio*.3, 10),
                                        material:Cesium.Color.fromCssColorString("#FFBB19").withAlpha(.8)  ,
                                        },
                                    });
                        }

                        geometry4.tipo=tipo;
  
                        mapElementsArr.push(geometry4);

                }
                
            }

}

function  MuestraOcultaInventario(){

        for(var i=0;i < mapElementsArr.length;i++){

            mapElementsArr[i].show=false;

        }

        for(var i=0; i < mapElementsArr.length; i++){

            if(filtroInventario!="" && filtroInventario!=undefined){
                if(filtroInventario == mapElementsArr[i].tipo){              

                    mapElementsArr[i].show=true;            
                    
                }
            }else{
                for(var i=0;i < mapElementsArr.length;i++){

                    mapElementsArr[i].show=true;  
        
                }
            }
            
        }

}