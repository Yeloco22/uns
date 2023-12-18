var calculateKpiExpert_Produccion={};
calculateKpiExpert_Produccion.max=0;
calculateKpiExpert_Produccion.maxCedis=0;

calculateKpiExpert_Produccion.calculateKPI=function(entities){ 

    return new Promise((resolve, reject) => {


        var serviceName;
        var apiURL;
        var agrupador="";

        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="produccion"){                    
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

                    console.log("Produccion",data.recordset);

                    var rows=data.recordset;

                    var equipos=d3.nest()
                    .key(function(d) { 

                           
                                    return d.Proceso; 
                                                    
            
                    })
                    .entries(rows);

                    console.log("equipos",equipos);

                    for(var i=0;  i < rows.length; i++){

                        if(rows[i].dFechaStd){

                            var fechaSplit1=rows[i].dFechaStd.split("T");
                            var fechaSplit=fechaSplit1[0].split("-");                                   
                            rows[i].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2]));  
                            
                        }

                    }

                    calculateKpiExpert_Produccion.max=0;

                    for(var j=0; j < rows.length; j++ ){

                        rows[j].ordenProceso=0;
                        if( ProcesoOrden[rows[j].Proceso] ){
                            rows[j].ordenProceso=ProcesoOrden[rows[j].Proceso];
                        }
        
                    }
        
                    console.log();
        
                    rows=rows.sort((a, b) =>   b.ordenProceso - a.ordenProceso );
                    rows.reverse();

                    for(var i=0;  i < rows.length; i++){

                        if( entities[rows[i].Facility] ){

                            if(!entities[rows[i].Facility].produccion)
                                entities[rows[i].Facility].produccion={MaxCycles:0,Cycles:0,fechas:{}, equipos:{},grupos:{}, values:[] };

                            if( !entities[rows[i].Facility].produccion.grupos[rows[i].Proceso])
                                entities[rows[i].Facility].produccion.grupos[rows[i].Proceso]={id:rows[i].Proceso,  MaxCycles:0,Cycles:0, orden:ProcesoOrden[rows[i].Proceso] };

                            if( !entities[rows[i].Facility].produccion.equipos[rows[i].Process])
                                entities[rows[i].Facility].produccion.equipos[rows[i].Process]={id:rows[i].Process,numEquipo:rows[i].NumEquipo, grupo:rows[i].Proceso,  MaxCycles:0,Cycles:0};
                            if(rows[i].fecha){
                                if( !entities[rows[i].Facility].produccion.fechas[rows[i].fecha.getTime()])
                                    entities[rows[i].Facility].produccion.fechas[rows[i].fecha.getTime()]={unix:rows[i].fecha.getTime(), fecha:rows[i].dFechaStd , MaxCycles:0, Cycles:0, values:[] };

                            }

                            entities[rows[i].Facility].produccion.MaxCycles+=Number(rows[i].MaxCycles);
                            entities[rows[i].Facility].produccion.Cycles+= Number(rows[i].Cycles);
                            entities[rows[i].Facility].produccion.values.push(rows[i]);

                            if(rows[i].fecha){
                                entities[rows[i].Facility].produccion.fechas[rows[i].fecha.getTime()].MaxCycles+=Number(rows[i].MaxCycles);
                                entities[rows[i].Facility].produccion.fechas[rows[i].fecha.getTime()].Cycles+=Number(rows[i].Cycles);
                                entities[rows[i].Facility].produccion.fechas[rows[i].fecha.getTime()].values.push(rows[i]);
                            }

                            entities[rows[i].Facility].produccion.grupos[rows[i].Proceso].MaxCycles+=Number(rows[i].MaxCycles);
                            entities[rows[i].Facility].produccion.grupos[rows[i].Proceso].Cycles+= Number(rows[i].Cycles);

                            entities[rows[i].Facility].produccion.equipos[rows[i].Process].MaxCycles+=Number(rows[i].MaxCycles);
                            entities[rows[i].Facility].produccion.equipos[rows[i].Process].Cycles+= Number(rows[i].Cycles);

                            if(calculateKpiExpert_Produccion.max <entities[rows[i].Facility].produccion.MaxCycles)
                                calculateKpiExpert_Produccion.max = entities[rows[i].Facility].produccion.MaxCycles;

                            if(calculateKpiExpert_Produccion.max <entities[rows[i].Facility].produccion.Cycles)
                                calculateKpiExpert_Produccion.max = entities[rows[i].Facility].produccion.Cycles;

                        }

                    }

                    

                    calculateKpiExpert_Produccion.data=rows;

                    resolve();


                });

            }
        }


    });

}

var EquiposColores={
    "Envase":"#FF87E1",
    "Calcinación":"#00B4FF",
    "Molienda":"#00C04D",
    "Reenvase":"#75FF3E",
    "Trasvase":"#FF0AF1",   
    "Otros":"#00E6D3"
 }

 var ProcesoOrden={    
    "Calcinación":0,
    "Molienda":1,
    "Envase":2,
    "Reenvase":3,
    "Trasvase":4,
 }


var EquiposList={
   "Envase":1,
   "Calcinación":2,
   "Molienda":3,
   "Reenvase":4,
   "Trasvase":5,
   
   
   "Otros":6
}

calculateKpiExpert_Produccion.DibujaDetalleTiempo=function(data,titulo){

    console.log("DibujaDetalleTiempo",data);

    ClearToolTips();

    d3.select("#svgTooltip2").selectAll(".detail").data([]).exit().remove();

    if(!data.fechas)
    return;

    var ancho=18;
    var tamanioFuente=ancho*.7; 
            
    var svgTooltipWidth=Object.keys(data.fechas).length*(ancho)+50;

    if(svgTooltipWidth < 180)
    svgTooltipWidth=180;

    var svgTooltipHeight=700;

    $("#toolTip2").css("visibility","visible");  
    $("#toolTip2").css("inset",""); 
    $("#toolTip2").css("top",20+"px");
    $("#toolTip2").css("left","45%");

   
     // Agrega un div con un elemento svg :
        
     var svgElement = "<svg id='svgTooltip2' style='pointer-events:none;'></svg>";

     console.log(svgTooltipWidth,svgTooltipHeight);


    
    vix_tt_formatToolTip("#toolTip2","Utilización de equipo por Día de "+titulo,svgTooltipWidth,svgTooltipHeight);

    d3.select("#toolTip2").append("div").html(svgElement);

    d3.select("#svgTooltip2")                     
    .style("width", svgTooltipWidth )
    .style("height", (svgTooltipHeight)+50 );


    var fechasArr=[];

    for(var e in data.fechas){

        fechasArr.push(data.fechas[e]);

    }

    fechasArr = fechasArr.sort((a, b) => {                
        return b.unix - a.unix;                                  
    });

    fechasArr.reverse();

    var detalleFechas={};

    var listaEquipos={};

    var maxValuePorDia=0;

    var alturaBarras=60;

    var etiquetasDibujadas={};
    var caso_=1;

    var euiposCategoria={};

    for(var i=0; i < fechasArr.length; i++ ){

            detalleFechas[fechasArr[i].unix]={unix:fechasArr[i].unix};
            

            for(var j=0; j < fechasArr[i].values.length; j++ ){

                fechasArr[i].values[j].ordenProceso=0;
                if( ProcesoOrden[fechasArr[i].values[j].Proceso] ){
                    fechasArr[i].values[j].ordenProceso=ProcesoOrden[fechasArr[i].values[j].Proceso];
                }

            }    

            fechasArr[i].values=fechasArr[i].values.sort((a, b) =>   b.ordenProceso - a.ordenProceso );
            fechasArr[i].values.reverse();

            for(var j=0; j < fechasArr[i].values.length; j++ ){

                
                console.log(fechasArr[i].values[j]);
                if(!detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ]){
                  
                    detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ]={equipo:fechasArr[i].values[j].Process,NumEquipo:fechasArr[i].values[j].NumEquipo ,MaxCycles:0,Cycles:0};
                    
                }

                if(!listaEquipos[fechasArr[i].values[j].Process]){
                    listaEquipos[fechasArr[i].values[j].Process] = caso_;
                    caso_++;

                    euiposCategoria[fechasArr[i].values[j].Process]=fechasArr[i].values[j].Proceso;
                }
                   

                detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ].MaxCycles+=fechasArr[i].values[j].MaxCycles;
                detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ].Cycles+=fechasArr[i].values[j].Cycles;

                if(maxValuePorDia < detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ].Cycles)
                    maxValuePorDia=detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ].Cycles;              

                if(maxValuePorDia < detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ].MaxCycles)
                    maxValuePorDia=detalleFechas[fechasArr[i].unix][ fechasArr[i].values[j].Process ].MaxCycles;                

            }        

    }

    svgTooltipHeight=Object.keys(listaEquipos).length*(alturaBarras)+80;


    for(var i=0; i < fechasArr.length; i++ ){      

                              
        for(var e in detalleFechas[fechasArr[i].unix] ){  
            


            if(  listaEquipos[e] ){

                var color="#cccccc";

                if(EquiposColores[ euiposCategoria[e]  ])
                     color=EquiposColores[ euiposCategoria[e]  ] ;

                var altura=GetValorRangos( detalleFechas[fechasArr[i].unix][e].MaxCycles ,1, maxValuePorDia ,1,alturaBarras-10);
                var altura2=GetValorRangos( detalleFechas[fechasArr[i].unix][e].Cycles ,1, maxValuePorDia ,1,alturaBarras-10);
                var posY=(listaEquipos[e]*alturaBarras)+20;

                d3.select("#svgTooltip2").append("rect")		    		
                                       .attr("width",function(d){                                      
                                         return 4;
                                       })
                                       .attr("class","detail")
                                       .attr("x", (ancho*i)+tamanioFuente  )
                                       .attr("y", posY-altura  )
                                       .attr("height",1)
                                       .attr("fill","#FCFF00")                                    
                                       .transition().delay(0).duration(getRandomInt(1,100))
                                       .attr("height",altura );

                var rect= d3.select("#svgTooltip2").append("rect")		    		
                                       .attr("width",function(d){                                      
                                         return ancho-8;
                                       })
                                       .attr("class","detail")
                                       .attr("x", (ancho*i)+tamanioFuente+(ancho*.19)  )
                                       .attr("y", posY-altura2  )
                                       .attr("height",1)
                                       .attr("fill",color);

                rect.transition().delay(0).duration(getRandomInt(1,100))
                                       .attr("height",altura2 )
                                       .attr("pointer-events","auto" );

                rect.append("svg:title").text(function(){

                                            return  "Proceso: "+euiposCategoria[e]+"; Utilización: "+formatNumber(detalleFechas[fechasArr[i].unix][e].Cycles)+", Capacidad: "+formatNumber(detalleFechas[fechasArr[i].unix][e].MaxCycles)	
                                                
                                        });

                                       
                /*
                if((ancho*i)+tamanioFuente > 60){

                    d3.select("#svgTooltip2")
                    .append("text")						
                    .attr("class","detail")
                    .style("fill",color)		
                    .style("font-family","Cabin")
                    .style("font-weight","normal")
                    .style("font-size",tamanioFuente*.8)	
                    .style("text-anchor","start")
                    .attr("transform"," translate("+String( (ancho*i)+tamanioFuente+(ancho*.15)+(tamanioFuente*.8)  )+","+String( (posY-altura2)-5   )+")  rotate("+(-90)+") ")
                    .text(function(){
                    
                        return formatNumber(detalleFechas[fechasArr[i].unix][e].Cycles);
    
                    });
                }
                */    

                if((ancho*i)+tamanioFuente > 60){

                    if(!etiquetasDibujadas[e]){

                        
                        d3.select("#svgTooltip2").append("rect")		    		
                                        .attr("width",100)
                                        .attr("class","detail")
                                        .attr("x", 5  )
                                        .attr("y",  ((listaEquipos[e]-1)*alturaBarras)+tamanioFuente+17  )
                                        .attr("height",tamanioFuente*1.3)
                                        .attr("fill","#000000")                                    
                                        ;

                        etiquetasDibujadas[e]=d3.select("#svgTooltip2")
                                                    .append("text")						
                                                    .attr("class","detail")
                                                    .style("fill","#FFFFFF")		
                                                    .style("font-family","Cabin")
                                                    .style("font-weight","bold")
                                                    .style("font-size",tamanioFuente*.9)	
                                                    .style("text-anchor","start")
                                                    .attr("transform"," translate("+String( 10  )+","+String( ((listaEquipos[e]-1)*alturaBarras)+tamanioFuente+30   )+")  rotate("+(0)+") ")
                                                    .text(e+" "+detalleFechas[fechasArr[i].unix][e].NumEquipo+":"); 
                                                    
                    }

                }               

            }          

        }
        
        d3.select("#svgTooltip2")
        .append("text")						
        .attr("class","detail")
        .style("fill",function(d){
            
            var color ="#FFFFFF";                                    
            return color;
            
        })		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente*.9)	
        .style("text-anchor","start")
        .attr("transform"," translate("+String( (ancho*i)+tamanioFuente+11  )+","+String( (svgTooltipHeight-0)   )+")  rotate("+(-90)+") ")
        .text(function(){
        
            var date=new Date( Number(fechasArr[i].unix) );

            return  date.getDate()+" "+getMes(date.getMonth());

        }); 

    }

    $("#toolTip2")                     
    .css("height", ((svgTooltipHeight)+50)+"px" );

    d3.select("#svgTooltip2")                     
    .style("height", (svgTooltipHeight)+50 );


}