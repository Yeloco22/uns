
Cesium.BingMapsApi.defaultKey="Ao97p5MHevB_IeYJJ0hqvH0-N4KBgeFWHrGaJ9Y_eHDI8Z1OhYLKbmitA0rH1LsK";

var extent = Cesium.Rectangle.fromDegrees(-128,44,-67,15);

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;

Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

var svgLines;

var Stage={};

Stage.initStage=function(resolve, reject){

		viewer = new Cesium.Viewer('cesiumContainer', {
			imageryProvider : new Cesium.UrlTemplateImageryProvider({
				url : 'https://api.mapbox.com/styles/v1/dcontreras1979/ciwiilbs100022qnvp3m3vnsh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGNvbnRyZXJhczE5NzkiLCJhIjoiY2l3Z3dpY2gxMDFhbzJvbW40cWRqNmZ0OCJ9.KIrZ8JiXWYgjLBb-nL3kYg',
				credit : '',
				terrainProvider: new Cesium.CesiumTerrainProvider({
					url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=6mKJJJYS8B7DcCpfaQSV`,
					credit: new Cesium.Credit("\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy;MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e", true),
					requestVertexNormals: true
		})
	 
			
		}),
		timeline:false,
		infoBox:false,
		animation : false,
		skyBox:false,

		baseLayerPicker : false
		});

		var terrainProvider = new Cesium.CesiumTerrainProvider({
		url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=6mKJJJYS8B7DcCpfaQSV`,
		});


		viewer.camera.flyTo({
			destination : Cesium.Cartesian3.fromDegrees(-101.777344, 8.121772, 2500000.0),
			orientation : {
				heading : Cesium.Math.toRadians(0),
				pitch : Cesium.Math.toRadians(-58.0),
				roll : 0.0
			}
		});
		

		handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
		handler.setInputAction(function(click) {

		    var pickedObject = viewer.scene.pick(click.position);

			var mousePosition = new Cesium.Cartesian2(click.position.x, click.position.y);

			var ellipsoid = viewer.scene.globe.ellipsoid;

			var cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);

						if (cartesian) {

							var cartographic = ellipsoid.cartesianToCartographic(cartesian);

							var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);

							var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);

							
						} else {

						

						}


		    localizacion=undefined;

		    if (Cesium.defined(pickedObject)) {

		        	$("#tool").css("visibility","visible");

			    	$("#tool").css("top",mouse_y-50);

			        $("#tool").css("left",mouse_x+50);

			        $("#chartContainer").css("visibility","visible");

			        console.log(pickedObject.id._id);

					Stage.RutaSelected=undefined;

					if(mapElements[pickedObject.id._id]){


						var data=mapElements[pickedObject.id._id];	

								Stage.idSelected=data.Nombre;
								Stage.altura=data.alturaGeom;
								Stage.allowedToDraw=true;
								Stage.DrawLines();

					}

		    }else
		    {

		    	$("#tool").css("visibility","hidden");					
				$("#toolTip").css("visibility","hidden");
				$("#toolTip1").css("visibility","hidden");	
				$("#toolTip2").css("visibility","hidden");

		    }	  


		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		handler.setInputAction(function(click) {  

			var pickedObject = viewer.scene.pick(click.endPosition);

		    localizacion=undefined;
			    
		    if (Cesium.defined(pickedObject)) {				

		        if(mapElements[pickedObject.id._id]){					

								var dataCatlog="";
								var data=mapElements[pickedObject.id._id];	
								ClearToolTips();	

								//REDIBUJA LINEA DE TIEMPO DE INVENTARIO
								filtroUNSeleccionada=data.Nombre;
								calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);

								//SEÑALA DE LA LISTA IZQUIERDA
								for(var i in entities ){

									if(i==data.Nombre){
										if(entities[i].LabelList){
											
											d3.select(entities[i].LabelList[0][0]).style('fill', "#ffffff" ).transition().delay(1000).duration(500).style('fill', entities[i].LabelList[0][0].color );
										}
									}							
									
									
								}		
								
								if(entities[data.Nombre].posYScroll){
									
									document.getElementById("barsContainer2").scrollTo({top:entities[data.Nombre].posYScroll-500,behavior: 'smooth'});
								}
								
								// INVENTARIO ************

								$("#toolTip1").css("visibility","visible");
								
								$("#toolTip1").css("left",mouse_x-50);

								var posY=mouse_y+90;
								if( $("#toolTip1").height()+mouse_y > windowHeight ){
									posY=windowHeight-$("#toolTip1").height()-50;
								}
								$("#toolTip1").css("top",posY);

								var text=` <div class="detailContainer" style="background-color: #082e2e;">        
									<div>
										<div class="tooltipHeader" style=" border-color:#082e2e;">
											<span style='color:#FFFFFF;font-size:15px;'></span><span style='color:#00C6FF'>${data.Nombre}</span>
										</div>
									</div>
									<div style="">
									<div class="detail1" style="">										
									`;

								text+=`<div class="tooltipDetailElement"><img id="" src="images/inventory.png" style="width:20px"></img>
									<span style='color:#ffffff;font-size:${15}px;'>Inventario: </span><br>
									<span style='color:#fff600;font-size:${15}px;'></span> <span style='color:#ffffff'> <span style='color:#ffffff;font-size:${12}px;'> </span>
									</div><br>`;

								var colorFisico="";

							
								text+=`<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;color:${data.inventario.colorBase}">Físico: ${formatNumber(data.inventario.Fisico)}</div><br>
									   <div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;color:#ffffff;">Capacidad: ${formatNumber(data.inventario.Capacidad)}</div><br>									   
									   <div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Transito: ${formatNumber(data.inventario.Transito)}</div><br>
									   <div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">TransitoHoy: ${formatNumber(data.inventario.TransitoHoy)}</div><br>
									   <div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Óptimo: ${formatNumber(data.inventario.Optimo)}</div><br>
									   <div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Mínimo: ${formatNumber(data.inventario.Minimo)}</div>
									   `;

								text+=`
										<span style='color:#ffffff;font-size:${11}px;'> </span><br>
										`;

								text+=`</div>`;

								text+="</div></div></div>";

								// FILLRATE ************

								if(entities[data.Nombre]){
													

									text+=`<div class="tooltipDetailElement"><img id="" src="images/mode1_.png" style="width:24px"></img>
										<span style='color:#ffffff;font-size:${15}px;'>FillRate:${ (entities[data.Nombre].fillRate)?entities[data.Nombre].fillRate:"ND"	}% </span><br>
										<span style='color:#fff600;font-size:${15}px;'></span> <span style='color:#ffffff'> <span style='color:#ffffff;font-size:${12}px;'> </span>
										</div>`;								

								}
								
								$("#toolTip1").html(text );
					
								// ORIGEN ************

								$("#toolTip").css("visibility","visible");
								
								$("#toolTip").css("left",230);

								var text=` <div class="detailContainer" style="">        
									<div>
										<div class="tooltipHeader" style="display:flex;">											
										</div>
									</div>
									<div style="display: flex;">
									<div class="detail1" style="">										
									`;

								text+=`<div class="tooltipDetailElement">
									<img id="" src="images/cump_abasto.png" style="width:35px;"></img><span style='color:#ffffff;font-size:${25}px;'>Desde ${data.Nombre} </span><br>
									<span style='color:#fff600;font-size:${13}px;'></span> <span style='color:#ffffff' >Cumplimiento Abasto: ${(data.abasto.comoOrigen.totalPlan==0 && data.abasto.comoOrigen.totalPlan==0)?"0":Math.round( data.abasto.comoOrigen.totalReal/data.abasto.comoOrigen.totalPlan*100 )}% <span style='color:#ffffff;font-size:${12}px;'> (Plan: ${formatNumber(data.abasto.comoOrigen.totalPlan)} TM , Real: ${(dataManager.currentKpi!="plan")?formatNumber(data.abasto.comoOrigen.totalReal):""} TM)</span>
									<br><span style='color:#ffffff;font-size:${15}px;'>Hacia:  </span><br>
									</div>`;

									data.abasto.comoOrigen.records = data.abasto.comoOrigen.records.sort((a, b) => b.VolumenReal - a.VolumenReal);  

								text+=`<div class=""style="line-height:13px;margin:10px;" ><br><table style="width:100%;">`;

								text+=`
									<tr style='color:white;font-size:${12}px;'>
									<th style='text-align: left'><span style="hover:white" > U.N.</th><th style='text-align: left'> Transporte</th><th style='text-align: left'>Plan</th><th style='text-align: left'>Real</th><th style='text-align: left'>Cumplimiento</th></span>
									</tr>`;

								
								for(var j=0;  j < data.abasto.comoOrigen.valoresArr.length; j++){					

									text+=`
									<tr style='color:${data.abasto.comoOrigen.valoresArr[j].color};font-size:${12}px;'>
									<th style='text-align: left'><span style="hover:white" onclick="Stage.FocusMapElement('${data.abasto.comoOrigen.valoresArr[j].Destino}');" onmouseover="filtroUNSeleccionada='${data.abasto.comoOrigen.valoresArr[j].Destino}'; calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);this.style.color='#FFFFFF'" onmouseout="filtroUNSeleccionada=''; calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);this.style.color='${data.abasto.comoOrigen.valoresArr[j].color}'" > ${data.abasto.comoOrigen.valoresArr[j].Destino}</th><th style='text-align: left'> ${data.abasto.comoOrigen.valoresArr[j].Transporte}</th><th style='text-align: left'>${formatNumber(data.abasto.comoOrigen.valoresArr[j].Plan)} TM</th><th style='text-align: left'>${(dataManager.currentKpi!="plan")?formatNumber(data.abasto.comoOrigen.valoresArr[j].Real):""} TM</th><th style='text-align: left'> (${(dataManager.currentKpi!="plan")?formatNumber(data.abasto.comoOrigen.valoresArr[j].cumplimiento):""}%)</th></span>
									</tr>`;

									if(j > 20){
										
										break;
									}

								}
								text+=`</table></div>`;
								if(data.abasto.comoOrigen.valoresArr.length > 20){
									text+="......";
									
								}

								text+="</div></div></div>";
								
								$("#toolTip").html(text );

								var posY=mouse_y-50;
								if( $("#toolTip").height()+mouse_y > windowHeight ){
									posY=windowHeight-$("#toolTip").height()-50;
								}
								$("#toolTip").css("top",posY);							
								
					
								// DESTINO ************								

								var dataCatlog="";
								var data=mapElements[pickedObject.id._id];
							

								var text=` <div class="detailContainer" style="">        
									<div>
										<div class="tooltipHeader" style="display:flex;">											
										</div>
									</div>
									<div style="display: flex;">
									<div class="detail1" style="">										
									`;

								text+=`<div class="tooltipDetailElement">
									<img id="" src="images/order3.png" style="width:35px;"></img><span style='color:#ffffff;font-size:${25}px;'>Hacia ${data.Nombre} </span><br>
									<span style='color:#fff600;font-size:${13}px;'></span> <span style='color:#ffffff'>Cumplimiento Abasto: ${(data.abasto.comoDestino.totalPlan==0 && data.abasto.comoDestino.totalPlan==0)?"0":Math.round( data.abasto.comoDestino.totalReal/data.abasto.comoDestino.totalPlan*100 )}% <span style='color:#ffffff;font-size:${12}px;'> (Plan: ${formatNumber(data.abasto.comoDestino.totalPlan)} TM , Real: ${(dataManager.currentKpi!="plan")?formatNumber(data.abasto.comoDestino.totalReal):""} TM)</span>
									<br><span style='color:#ffffff;font-size:${15}px;'>Desde:  </span><br>
									</div>`;

								data.abasto.comoDestino.records = data.abasto.comoDestino.records.sort((a, b) => b.VolumenReal - a.VolumenReal);  

								text+=`<div class=""style="line-height:13px;margin:10px;" ><br><table style="width:100%;">`;

								text+=`
									<tr style='color:white;font-size:${12}px;'>
									<th style='text-align: left'><span style="hover:white" > U.N.</th><th style='text-align: left'> Transporte</th><th style='text-align: left'>Plan</th><th style='text-align: left'>Real</th><th style='text-align: left'>Cumplimiento</th></span>
									</tr>`;


								for(var j=0;  j < data.abasto.comoDestino.valoresArr.length; j++){

									text+=`
									<tr style='color:${data.abasto.comoDestino.valoresArr[j].color};font-size:${12}px;'>
									<th style='text-align: left'><span onclick="Stage.FocusMapElement('${data.abasto.comoDestino.valoresArr[j].Destino}');" onmouseover="filtroUNSeleccionada='${data.abasto.comoDestino.valoresArr[j].Destino}'; calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);this.style.color='#FFFFFF'" onmouseout="filtroUNSeleccionada=''; calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);this.style.color='${data.abasto.comoDestino.valoresArr[j].color}'" > ${data.abasto.comoDestino.valoresArr[j].Destino}</th><th style='text-align: left'> ${data.abasto.comoDestino.valoresArr[j].Transporte}</th><th style='text-align: left'>  Plan: ${formatNumber(data.abasto.comoDestino.valoresArr[j].Plan)} TM</th><th style='text-align: left'> Real: ${(dataManager.currentKpi!="plan")?formatNumber(data.abasto.comoDestino.valoresArr[j].Real):""} TM</th><th style='text-align: left'> (${(dataManager.currentKpi!="plan")?formatNumber(data.abasto.comoDestino.valoresArr[j].cumplimiento):""}%)</th></span>
									</tr>`;

									if(j > 20){
										
										break;
									}

								}
								text+=`</table></div>`;
								if(data.abasto.comoDestino.valoresArr.length > 20){
									text+="......";
									
								}

								text+="</div></div></div>";


								
								$("#toolTip2").html(text );

								var posY=mouse_y-50;
								if( $("#toolTip2").height()+mouse_y > windowHeight ){
									posY=windowHeight-$("#toolTip2").height()-50;
								}
								$("#toolTip2").css("top",posY);

								$("#toolTip2").css("visibility","visible");
								$("#toolTip2").css("position","fixed");
								$("#toolTip2").css("left",(mouse_x+280)+"px");
								$("#toolTip2").css("width","");						

		    	}
		    	
		    }else
		    {
				/*
		    	$("#toolTip").css("visibility","hidden");
				$("#toolTip1").css("visibility","hidden");	
				$("#toolTip2").css("visibility","hidden");	
				*/

		    }

		 } ,Cesium.ScreenSpaceEventType.MOUSE_MOVE);


		 $("#svgLines")
						.css("width",windowWidth)
						.css("height",windowHeight);


		svgLines = d3.select("#svgLines")						
						.append("svg")
						.attr("id","containerSCG")
						.attr("width", windowWidth )
						.attr("height", windowHeight )
						;


		svgLines = d3.select("#svgLines")						
							.append("svg")								
							.attr("width", windowWidth )
							.attr("height", windowHeight )
							;

							svgLines.append("rect")		    		
							.attr("width","100%" )
							.attr("filter","url(#dropshadowRadar)")
							.attr("x",0  )
							.attr("y", 0  )
							.attr("height",60)
							.attr("fill","#131313")
							;

		$("#barsContainer2").css("width", windowWidth*.2 );

		svgLinesTouch = d3.select("#svgLinesTouchLeft")            
	                          .append("svg")                
	                          .attr("width", windowWidth*.2 )
	                          .style("pointer-events","auto")
	                          .attr("height", 4000 );
		

		resolve();

		setInterval(function () {
			Stage.DrawLines();
		}, 100);
		
};

var svgLinesTouch;

Stage.idSelected;
Stage.altura;
Stage.allowedToDraw=false;

var mapElements={};
var mapElementsArr=[];
var escalado=1;
var currentEntities;

function ClearToolTips(){
	$("#toolTip").html("");
	$("#toolTip1").html("");
	$("#toolTip2").html("");
	
	$("#toolTip").css("visibility","hidden");
	$("#toolTip1").css("visibility","hidden");
	$("#toolTip2").css("visibility","hidden");

	$("#toolTip2").css("height","");
}


Stage.DrawMapObjects=function(entities){

	for(var i=0;i < mapElementsArr.length;i++){

		viewer.entities.remove(mapElementsArr[i]);

	}

	var alturas = d3.scale.linear()
						.domain([1,calculateKpiExpert_Abasto.maxReal])
						.range([1, 100000 ]);
						
	if( dataManager.currentKpi=="abasto"){

		calculateKpiExpert_Abasto.DrawObjects();

	}else if( dataManager.currentKpi=="inventario"){
		
		calculateKpiExpert_Inventario.DrawObjects();

	}else if( dataManager.currentKpi=="plan"){

		calculateKpiExpert_Plan.DrawObjects();
		
	}
	
}

function CambiaModo(){

	ClearToolTips();

	muestraTodasRutas=!muestraTodasRutas;
	console.log("muestraTodasRutas",muestraTodasRutas);
	if(muestraTodasRutas){
		$("#mostrarModo").html("Muestra Solo Selección");
	}else{
		$("#mostrarModo").html("Muestra Todas las Rutas");
	}
}

var espesorGlobal=false;
function CambiaModoEspesor(){
	espesorGlobal=!espesorGlobal;
}

var muestraTodasRutas=false;
Stage.RutaSelected;

Stage.DrawLines=function(  ){	

		svgLines.selectAll(".links_").data([]).exit().remove();	 

		if(!Stage.allowedToDraw)
			return;			

		var id=Stage.idSelected;

		var maximoMuestra=0;

		for (var  e in calculateKpiExpert_Abasto.rutas){	

					//RECALCULA ANCHO, MAXIMO

					var tipo=calculateKpiExpert_Abasto.rutas[e].tipo;

					//APLICA FILTROS
					if(filtroTipo!="" && filtroTipo!=undefined ){
						if(tipo.toLowerCase() != filtroTipo)
							continue;
					}

					var permiteDibujado=false;

					if(filtroNiveles!="" && filtroNiveles!=undefined){

						var cumplimiento=calculateKpiExpert_Abasto.rutas[e].cumplimiento;

						if(calculateKpiExpert_Abasto.rutas[e].VolumenPlan==0 && calculateKpiExpert_Abasto.rutas[e].VolumenReal>0 && filtroNiveles=="noPlaneados"){
							permiteDibujado=true;
						}else if(cumplimiento==0 && filtroNiveles=="Menor85"){
							permiteDibujado=true;
						}else if(cumplimiento <= 85 && filtroNiveles=="Menor85"){
							permiteDibujado=true;
						}else if(cumplimiento > 85 && cumplimiento <= 95 && filtroNiveles=="Mayor85"){
							permiteDibujado=true;
						}else if(cumplimiento > 95 && filtroNiveles=="Mayor95" && calculateKpiExpert_Abasto.rutas[e].VolumenPlan>0){
							permiteDibujado=true;					
						}
						
					}else{
						permiteDibujado=true;	
					}	

					// FILTRO INVENTARIO
					if(filtroInventario!="" && filtroInventario!=undefined){

						if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ]){

							if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ].inventario){

								if(filtroInventario != entities[ calculateKpiExpert_Abasto.rutas[e].destino ].inventario.tipo){              
			
									continue;
									
								}

							}

						}
						
					}
														

					var validoFillrate=true;

					if(filtroFR!="" && filtroFR!=undefined){

						validoFillrate=false;

						if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ]){

							if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate){

								if( filtroFR =="40" && entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate <= 40 ){             
									validoFillrate=true;                        
								}else if( filtroFR =="80" && entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate <= 80 ){
									validoFillrate=true;
								}else if( filtroFR =="90" && entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate <= 90 ){
									validoFillrate=true;
								}

							}

						}

					}

					
					if(!permiteDibujado)
						continue;

					if(!validoFillrate)
						continue;

					if( (calculateKpiExpert_Abasto.rutas[e].origen==id || muestraTodasRutas) &&  calculateKpiExpert_Abasto.rutas[e].Lat_Origen && calculateKpiExpert_Abasto.rutas[e].Long_Origen  &&  calculateKpiExpert_Abasto.rutas[e].Lat_Destino && calculateKpiExpert_Abasto.rutas[e].Long_Destino){

						if(maximoMuestra < calculateKpiExpert_Abasto.rutas[e].total)
							maximoMuestra=calculateKpiExpert_Abasto.rutas[e].total;

					}

					if( (calculateKpiExpert_Abasto.rutas[e].destino==id || muestraTodasRutas) &&  calculateKpiExpert_Abasto.rutas[e].Lat_Origen && calculateKpiExpert_Abasto.rutas[e].Long_Origen  &&  calculateKpiExpert_Abasto.rutas[e].Lat_Destino && calculateKpiExpert_Abasto.rutas[e].Long_Destino){
							
						if(maximoMuestra < calculateKpiExpert_Abasto.rutas[e].total)
							maximoMuestra=calculateKpiExpert_Abasto.rutas[e].total;

					}

		}

		for (var  e in calculateKpiExpert_Abasto.rutas){					

					var tipo=calculateKpiExpert_Abasto.rutas[e].tipo;

					//APLICA FILTROS
					if(filtroTipo!="" && filtroTipo!=undefined ){
						if(tipo.toLowerCase() != filtroTipo)
							continue;
					}

					var permiteDibujado=false;

					if(filtroNiveles!="" && filtroNiveles!=undefined){

						var cumplimiento=calculateKpiExpert_Abasto.rutas[e].cumplimiento;

						if(calculateKpiExpert_Abasto.rutas[e].VolumenPlan==0 && calculateKpiExpert_Abasto.rutas[e].VolumenReal>0 && filtroNiveles=="noPlaneados"){
							permiteDibujado=true;
						}else if(cumplimiento==0 && filtroNiveles=="Menor85"){
							permiteDibujado=true;
						}else if(cumplimiento <= 85 && filtroNiveles=="Menor85"){
							permiteDibujado=true;
						}else if(cumplimiento > 85 && cumplimiento <= 95 && filtroNiveles=="Mayor85"){
							permiteDibujado=true;
						}else if(cumplimiento > 95 && filtroNiveles=="Mayor95" && calculateKpiExpert_Abasto.rutas[e].VolumenPlan>0){
							permiteDibujado=true;					
						}
						
					}else{
						permiteDibujado=true;	
					}	

					// FILTRO INVENTARIO
					if(filtroInventario!="" && filtroInventario!=undefined){

						if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ]){

							if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ].inventario){

								if(filtroInventario != entities[ calculateKpiExpert_Abasto.rutas[e].destino ].inventario.tipo){              
			
									continue;
									
								}

							}

						}
						
					}

					var validoFiltroRutaSeleccionada=true;
			
					if(Stage.RutaSelected!=undefined && Stage.RutaSelected!=null && Stage.RutaSelected!=""){
						
						validoFiltroRutaSeleccionada=false;						
					
						if(Stage.RutaSelected.toLowerCase() == e.toLowerCase()){
							
							validoFiltroRutaSeleccionada=true;
						}

					}

					var validoFillrate=true;

					if(filtroFR!="" && filtroFR!=undefined){

						validoFillrate=false;

						if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ]){

							if(entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate){

								if( filtroFR =="40" && entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate <= 40 ){             
									validoFillrate=true;                        
								}else if( filtroFR =="80" && entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate <= 80 ){
									validoFillrate=true;
								}else if( filtroFR =="90" && entities[ calculateKpiExpert_Abasto.rutas[e].destino ].fillRate <= 90 ){
									validoFillrate=true;
								}

							}

						}

					}

					if(!validoFiltroRutaSeleccionada)
						continue;
					
					if(!permiteDibujado)
						continue;

						if(!validoFillrate)
						continue;


					var refrenciaMaximo=calculateKpiExpert_Abasto.maxPorRuta;

					if(espesorGlobal)
						refrenciaMaximo=maximoMuestra;

					var ancho=GetValorRangos( calculateKpiExpert_Abasto.rutas[e].total , 1, refrenciaMaximo ,1,1000)/100;
					

					//console.log(calculateKpiExpert_Abasto.rutas[e]);
					var alpha=.9;
					if(ancho < 1){
						ancho=1;
						alpha=GetValorRangos( calculateKpiExpert_Abasto.rutas[e].total , 1, 400 ,1,90)/100;
					}
						

					//console.log(calculateKpiExpert_Abasto.rutas[e].total,ancho);

					if(tipo.toLowerCase() == "auto"){
						var tipoLinea=("0, 0");
					}else if(tipo.toLowerCase() == "barco"){
						var tipoLinea=("3,20");
					}else if(tipo.toLowerCase() == "ffcc"){
						var tipoLinea=("3, 3");
					}

					if(calculateKpiExpert_Abasto.rutas[e].VolumenReal<1 && calculateKpiExpert_Abasto.rutas[e].VolumenPlan<1)
						continue;					
						
					if( (calculateKpiExpert_Abasto.rutas[e].origen==id || muestraTodasRutas) &&  calculateKpiExpert_Abasto.rutas[e].Lat_Origen && calculateKpiExpert_Abasto.rutas[e].Long_Origen  &&  calculateKpiExpert_Abasto.rutas[e].Lat_Destino && calculateKpiExpert_Abasto.rutas[e].Long_Destino){

						//console.log(refrenciaMaximo,calculateKpiExpert_Abasto.rutas[e].total,ancho);

							if(dataManager.currentKpi=="abasto"){
								var altura=calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Abasto;
							}else if(dataManager.currentKpi="inventario"){
								var altura=calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Inventario;
							}	
							
						
							var position = Cesium.Cartesian3.fromDegrees( Number(	calculateKpiExpert_Abasto.rutas[e].Long_Origen) ,Number(calculateKpiExpert_Abasto.rutas[e].Lat_Origen), altura );

							var coord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);		
							
							var position2 = Cesium.Cartesian3.fromDegrees( Number(calculateKpiExpert_Abasto.rutas[e].Long_Destino) ,Number(calculateKpiExpert_Abasto.rutas[e].Lat_Destino), 0 );
			
							var coord2_ = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position2); 						

							if(coord2_ && coord ){

								svgLines.append("line")       
								.attr("class","links_")                                
								.attr("x1",coord.x )
								.attr("y1", coord.y   )
								.attr("x2",coord2_.x )
								.attr("y2", coord2_.y   )
								.style("stroke-dasharray",tipoLinea )
								.style("stroke",function(d){

									this.data=calculateKpiExpert_Abasto.rutas[e];
									this.color=calculateKpiExpert_Abasto.rutas[e].color;
									return calculateKpiExpert_Abasto.rutas[e].color;

								})
								.style("stroke-width",ancho)
								.style("stroke-opacity",alpha)
								.style("pointer-events","auto")								
								.on("mouseover",function(d){

									d3.select(this).style('stroke', 'white');

									ClearToolTips();

									$("#toolTip").css("visibility","visible");
									
									$("#toolTip").css("left",mouse_x-500);								

									var text=`  <div class="detailContainer" style="">        
												<div>
													<div class="tooltipHeader" style="display:flex;">											
													</div>
												</div>
												<div style="display: flex;">
												<div class="detail1" style="">											
										`;


										text+=`<div class="tooltipDetailElement">
										<img id="" src="images/cump_abasto.png" style="width:35px;"></img><br><span style='color:#ffffff;font-size:${25}px;'>Desde ${this.data.origen} Hacia ${this.data.destino}</span><br>
										<span style='color:#fff600;font-size:${15}px;'>${this.data.tipo}</span><br><span style='color:#ffffff'>${(this.data.VolumenPlan>0)?Math.round( this.data.VolumenReal/this.data.VolumenPlan*100 ):Math.round(this.data.VolumenReal) }% <span style='color:#ffffff;font-size:${12}px;'> (Plan: ${formatNumber(this.data.VolumenPlan)} TM , Real: ${formatNumber(this.data.VolumenReal)} TM)</span>
										</div>`;

										text+=`<div class=""style="line-height:13px;margin:10px;" ><br><table style="width:100%;">`;
										for(var j=0;  j < this.data.records.length; j++){

											this.data.records[j].cumplimiento=Math.round((this.data.records[j].VolumenReal/this.data.records[j].VolumenPlan)*100);

											this.data.records[j].color="#cccccc";

											if(this.data.records[j].VolumenPlan==0 && this.data.records[j].VolumenReal>0){

												this.data.records[j].color="#FF00F6";

											}else if(this.data.records[j].cumplimiento==0 || this.data.records[j].cumplimiento.toString() == "Infinity" ){

												this.data.records[j].color="#ff0000";
											}else if(this.data.records[j].cumplimiento <= 85){

												this.data.records[j].color="#FF9600";
					
											}else if(this.data.records[j].cumplimiento > 85 && this.data.records[j].cumplimiento <= 95){
					
												this.data.records[j].color="#EAFF00";
					
											}else if(this.data.records[j].cumplimiento > 95){
					
												this.data.records[j].color="#00FE00";
												
											}

											text+=`
											<tr style='color:${this.data.records[j].color};font-size:${12}px;'>
											<th style='text-align: left'> Plan: ${formatNumber(this.data.records[j].VolumenPlan)} TM</th><th style='text-align: left'> Real:${formatNumber(this.data.records[j].VolumenReal)} TM</th><th style='text-align: left'>(${(this.data.records[j].VolumenPlan>0)?Math.round( this.data.records[j].VolumenReal/this.data.records[j].VolumenPlan*100 ):"NA"}%) </th><th style='text-align: left'>  ${this.data.records[j].DescrProducto}</th></span>
											</tr>
											`;											

										}
										text+=`</table></div>`;

										text+=`</div>`;

										text+="</div></div></div>";									

										$("#toolTip").html(text );
										$("#toolTip").css("width","");

									var posY=mouse_y-50;
									if( $("#toolTip").height()+mouse_y > windowHeight ){
										posY=windowHeight-$("#toolTip").height()-50;
									}
									$("#toolTip").css("top",posY);

								})
								.on("mouseout",function(d){

									d3.select(this).style('stroke', this.color );

									$("#toolTip").css("visibility","visible");

								})
								.on("click",function(d){
									
									calculateKpiExpert_Abasto.DrawDayDetail(this.data.origen,this.data.destino,this.data.tipo);

								});
							}
							

					}

					if( (calculateKpiExpert_Abasto.rutas[e].destino==id || muestraTodasRutas) &&  calculateKpiExpert_Abasto.rutas[e].Lat_Origen && calculateKpiExpert_Abasto.rutas[e].Long_Origen  &&  calculateKpiExpert_Abasto.rutas[e].Lat_Destino && calculateKpiExpert_Abasto.rutas[e].Long_Destino){
						
							if(dataManager.currentKpi=="abasto"){
								var altura2=calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Abasto;
							}else if(dataManager.currentKpi="inventario"){
								var altura2=calculateKpiExpert_Abasto.rutas[e].alturaOrigen_Inventario;
							}					

							var position = Cesium.Cartesian3.fromDegrees( Number(	calculateKpiExpert_Abasto.rutas[e].Long_Origen) ,Number(calculateKpiExpert_Abasto.rutas[e].Lat_Origen), altura2 );

							var coord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);		
							
							var position2 = Cesium.Cartesian3.fromDegrees( Number(calculateKpiExpert_Abasto.rutas[e].Long_Destino) ,Number(calculateKpiExpert_Abasto.rutas[e].Lat_Destino), 0 );
			
							var coord2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position2);  
							
							if(coord2 && coord ){

							svgLines.append("line")       
										.attr("class","links_")                                
										.attr("x1",coord.x )
										.attr("y1", coord.y   )
										.attr("x2",coord2.x )
										.attr("y2", coord2.y   )
										.style("pointer-events","auto")
										.style("stroke-dasharray",tipoLinea )
										.style("stroke",function(d){

											this.data=calculateKpiExpert_Abasto.rutas[e];
											this.color=calculateKpiExpert_Abasto.rutas[e].color;
											return calculateKpiExpert_Abasto.rutas[e].color;
			
										})
										.style("stroke-width",ancho)
										.style("stroke-opacity",alpha)
										
										.on("mouseover",function(d){

											ClearToolTips();
											
											d3.select(this).style('stroke', 'white');
										
											$("#toolTip2").css("visibility","visible");
											
											$("#toolTip2").css("left",mouse_x+200);

											if(Number($("#toolTip2").css("left").replaceAll("px",""))+Number($("#toolTip2").css("width").replaceAll("px","")) > windowWidth )
												$("#toolTip2").css("left",windowWidth-Number($("#toolTip2").css("width").replaceAll("px",""))-50+"px");
			
												/*
											var text=` <div class="detailContainer" style="">        
												<div>
													<div class="tooltipHeader" style="display:flex;">
														<span style='color:#00C6FF;font-size:15px;'></span><span style='color:#FFFC00'>${ this.data.destino }</span>
													</div>
												</div>
												<div style="display: flex;">
												<div class="detail1" style="">										
												`;	
												*/	
												
												var text=`  <div class="detailContainer" style="">        
															<div>
																<div class="tooltipHeader" style="display:flex;">											
																</div>
															</div>
															<div style="display: flex;">
															<div class="detail1" style="">											
															`;
			


												text+=`<div class="tooltipDetailElement">
												<img id="" src="images/order3.png" style="width:35px;"></img><br><span style='color:#ffffff;font-size:${25}px;'>Desde ${this.data.origen} Hacia ${this.data.destino}</span><br>
												<span style='color:#fff600;font-size:${15}px;'>${this.data.tipo}<br></span> <span style='color:#ffffff'>${(this.data.VolumenPlan>0)?Math.round( this.data.VolumenReal/this.data.VolumenPlan*100 ):Math.round(this.data.VolumenReal) }% <span style='color:#ffffff;font-size:${12}px;'> (Plan: ${formatNumber(this.data.VolumenPlan)} TM , Real: ${formatNumber(this.data.VolumenReal)} TM)</span>
												</div>`;
			
												text+=`<div class=""style="line-height:13px;margin:10px;" ><br><table style="width:100%;">`;

												for(var j=0;  j < this.data.records.length; j++){
			
													this.data.records[j].cumplimiento=Math.round((this.data.records[j].VolumenReal/this.data.records[j].VolumenPlan)*100);
			
													this.data.records[j].color="#cccccc";

													
			
													if(this.data.records[j].VolumenPlan==0 && this.data.records[j].VolumenReal>0){

														this.data.records[j].color="#FF00F6";
			
													}else if(this.data.records[j].cumplimiento==0  || this.data.records[j].cumplimiento.toString() == "Infinity" ){
			
														this.data.records[j].color="#ff0000";

													}else if(this.data.records[j].cumplimiento <= 85){
			
														this.data.records[j].color="#FF9600";
							
													}else if(this.data.records[j].cumplimiento > 85 && this.data.records[j].cumplimiento <= 95){
							
														this.data.records[j].color="#EAFF00";
							
													}else if(this.data.records[j].cumplimiento > 95){
							
														this.data.records[j].color="#00FE00";
														
													}

													
			
													text+=`
													<tr style='color:${this.data.records[j].color};font-size:${12}px;'>
													<th style='text-align: left'> Plan: ${formatNumber(this.data.records[j].VolumenPlan)} TM</th><th style='text-align: left'> Real:${formatNumber(this.data.records[j].VolumenReal)} TM</th><th style='text-align: left'>(${(this.data.records[j].VolumenPlan>0)?Math.round( this.data.records[j].VolumenReal/this.data.records[j].VolumenPlan*100 ):"NA"}%) </th><th style='text-align: left'>  ${this.data.records[j].DescrProducto}</th></span>
													</tr>`;
			
													
			
												}

												text+=`</table></div>`;

												text+=`</div>`;

												text+="</div></div></div>";	
											
			
												$("#toolTip2").html(text );
			
											var posY=mouse_y-50;
											if( $("#toolTip2").height()+mouse_y > windowHeight ){
												posY=windowHeight-$("#toolTip").height()-50;
											}
											$("#toolTip2").css("top",posY);
											$("#toolTip").css("width","");
			
										})
										.on("mouseout",function(d){
			
											d3.select(this).style('stroke', this.color );

											$("#toolTip2").css("visibility","hidden");
			
										})
										.on("click",function(d){

											calculateKpiExpert_Abasto.DrawDayDetail(this.data.origen,this.data.destino,this.data.tipo);
											

										});

							}

					}

		}

}

Stage.FocusMapElement=function(id){
	
	for(var e in mapElements){

		if(mapElements[e].key==id){
			viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(mapElements[e].lng, mapElements[e].lat+config.offSetCamaraParaEnfocar[$("#nivel_cb").val()], config.alturas[$("#nivel_cb").val()]*2 ),
				orientation : {
					heading : Cesium.Math.toRadians(0),
					pitch : Cesium.Math.toRadians(-58.0),
					roll : 0.0
				}
			});
		}		

	}
}


Stage.DrawTimeline=function(){

	svgLines.selectAll(".timeline").data([]).exit().remove();

	$("#inventarioLabels").css("visibility","visible");
	$("#inventarioLabels").css("left", ((windowWidth*.3)-360)+"px");

	var alturaBarras=110;

	if(filtroUNSeleccionada!="" && filtroUNSeleccionada!=undefined){

		svgLines.append("text")				
				.style("fill","#FFFFFF")				
				.style("opacity",1)			
				.attr("class","timeline")   				
				.style("font-family","Cabin")
				.style("font-weight","bold")
				.style("font-size",17 )							
				.style("text-anchor","end")
				.attr("transform"," translate("+String( (windowWidth*.3)-20 )+","+String( windowHeight-50 )+")  rotate("+(0)+") ")
				.text(function(){

					return "Inventario diario de "+filtroUNSeleccionada;

				});

	}else{

		svgLines.append("text")				
				.style("fill","#FFFFFF")				
				.style("opacity",1)			
				.attr("class","timeline")   				
				.style("font-family","Cabin")
				.style("font-weight","bold")
				.style("font-size",17 )							
				.style("text-anchor","end")
				.attr("transform"," translate("+String( (windowWidth*.3)-20 )+","+String( windowHeight-50 )+")  rotate("+(0)+") ")
				.text(function(){

					return "Inventario diario de Todas las U.N.";

				});

	}


	for(var i=0;  i < fechasDisponiblesArr.length; i++){

			var posX=GetValorRangos(fechasDisponiblesArr[i].unix ,initDate, lastDate, windowWidth*.3 , windowWidth*.7);
			var altura=GetValorRangos(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico ,1, maximoInventarioFisicoPorDia, 1 , alturaBarras);
			var alturaTransito=GetValorRangos(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito ,1, maximoInventarioFisicoPorDia, 1 , alturaBarras);
			var alturaTransitoHoy=GetValorRangos(fechasDisponibles[fechasDisponiblesArr[i].unix].TransitoHoy ,1, maximoInventarioFisicoPorDia, 1 , alturaBarras);
			
			svgLines.append("line")							                       
							.attr("x1",posX )
							.attr("y1", windowHeight-alturaBarras-alturaTransito-30   )
							.attr("x2",posX )
							.attr("y2", windowHeight-20   )							
							.style("stroke",function(d){

								this.data=fechasDisponiblesArr[i];
								return "#ffffff";
							})
							.attr("class","timeline")   
							.style("stroke-width",1)
							
							.style("stroke-opacity",.4)
														;

			var productos=d3.nest()
						.key(function(d) { return d.DescrProducto; })
						.entries(fechasDisponiblesArr[i].values);
			
			for(var j=0;  j < productos.length; j++){

				productos[j].Fisico=0;

				for(var k=0;  k < productos[j].values.length; k++){
					productos[j].Fisico+=Number(productos[j].values[k].Fisico);
				}
					
			}

			productos=productos.sort((a, b) =>   b.Fisico - a.Fisico );
			

			svgLines.append("line")							                       
							.attr("x1",posX )
							.attr("y1", windowHeight-altura-20   )
							.attr("x2",posX )
							.attr("class","timeline")   
							.style("pointer-events","auto")
							.attr("y2", windowHeight-20   )							
							.style("stroke",function(d){

								this.data=fechasDisponiblesArr[i];

								this.productos=productos;

								if(filtroUNSeleccionada!="" && filtroUNSeleccionada!=undefined){

									for (var e  in entities){

											if(e == filtroUNSeleccionada){

												var colorBase="#cccccc";

												if(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico < entities[e].inventario.Minimo){

													colorBase="#ff0000";													

												}else if(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico > entities[e].inventario.Minimo && fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico <  entities[e].inventario.Minimo+((entities[e].inventario.Optimo-entities[e].inventario.Minimo)*.3)  ){
													
													colorBase="#FFAE00";
													
												}else if(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico > entities[e].inventario.Minimo && fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico < entities[e].inventario.Optimo){
													
													colorBase="#FCFF0F";
													
												}
												else if(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico > entities[e].inventario.Optimo){
													
													colorBase="#10E800";
													
												}

												this.colorBase=colorBase;

												return colorBase;

											}
									}

								}


								return "#ffffff";
							})
							.style("stroke-width",13)
							.on("mouseover",function(d){

								d3.select(this).style('stroke', '#EAFF00');
								
								calculateKpiExpert_Inventario.ProcessData(calculateKpiExpert_Inventario.data,this.data.unix );
								Stage.DrawMapObjects(entities);
								ListEntities();

								ClearToolTips();

								$("#toolTip").css("visibility","visible");
								
								$("#toolTip").css("left",mouse_x+50);

								text="<div style='line-height:15px;margin:20px;font-size:11px;font-weight:normal;border-style:solid;border-width:0px;background-color:rgba(0,0,0,.8);padding:0px;pointer-events:auto;border-radius:6px;box-shadow: rgba(0, 0, 0,.6) 5px 10px 19px;'>";
								for(var j=0;  j < this.productos.length; j++){	
									text+=`
									<tr style='color:"#ffffff";font-size:${12}px;margin:30px;'>
									<th style='text-align: left'><span   > ${this.productos[j].key}</th><th style='text-align: left'> ${formatNumber(this.productos[j].Fisico)}</span  ></th>
									</tr><br>
									`;
								}
								text+="</div>";

								$("#toolTip").html(text );

								var posY=mouse_y-50;
								if( $("#toolTip").height()+mouse_y > windowHeight ){
									posY=windowHeight-$("#toolTip").height()-50;
								}
								$("#toolTip").css("top",posY);

							})
							.on("mouseout",function(d){

								if(this.colorBase){
									d3.select(this).style('stroke', this.colorBase );
								}else{
									d3.select(this).style('stroke', '#ffffff');

								}					

								
							})
							.append("svg:title").text(function(){

								if(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito > 0){
									return "Físico: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  En Tránsito: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito)+" TM ";
								}else{
									return "Físico: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  ";
								}					
										
							});;		

			// BARRA DE TRANSITO
			svgLines.append("line")							                       
							.attr("x1",posX )
							.attr("y1",  windowHeight-altura-20   )
							.attr("y2",  windowHeight-altura-20-alturaTransito  )
							.attr("x2",posX )
							.attr("class","timeline")   
							.style("pointer-events","auto")
														
							.style("stroke",function(d){
								this.productos=productos;
								this.data=fechasDisponiblesArr[i];
								return "#0090FF";
							})
							.style("stroke-width",13)
							.on("mouseover",function(d){

								d3.select(this).style('stroke', '#EAFF00');
								
								calculateKpiExpert_Inventario.ProcessData(calculateKpiExpert_Inventario.data,this.data.unix );
								Stage.DrawMapObjects(entities);
								ListEntities();

								$("#toolTip").css("visibility","visible");
								
								$("#toolTip").css("left",mouse_x+50);

								text="";
								for(var j=0;  j < this.productos.length; j++){	
									text+=`
									<tr style='color:"#ffffff";font-size:${12}px;margin:30px;'>
									<th style='text-align: left'><span   > ${this.productos[j].key}</th><th style='text-align: left'> ${formatNumber(this.productos[j].Fisico)}</span  ></th>
									</tr>;
									`;
								}

								$("#toolTip").html(text );

								var posY=mouse_y-50;
								if( $("#toolTip").height()+mouse_y > windowHeight ){
									posY=windowHeight-$("#toolTip").height()-50;
								}
								$("#toolTip").css("top",posY);

							})
							.on("mouseout",function(d){

								d3.select(this).style('stroke', '#0090FF');

							})
							.append("svg:title").text(function(){

								if(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito > 0){
									return "Físico: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  En Tránsito: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito)+" TM ";
								}else{
									return "Físico: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  ";
								}					
										
							});


			// BARRA DE TRANSITO
			svgLines.append("line")							                       
						.attr("x1",posX )
						.attr("y1",  windowHeight-altura-alturaTransito-20   )
						.attr("y2",  windowHeight-altura-alturaTransito-20-alturaTransitoHoy  )
						.attr("x2",posX )
						.attr("class","timeline")   
						.style("pointer-events","auto")
													
						.style("stroke",function(d){
							this.productos=productos;
							this.data=fechasDisponiblesArr[i];
							return "#1100EE";
						})
						.style("stroke-width",13)
						.on("mouseover",function(d){

							d3.select(this).style('stroke', '#EAFF00');
							
							calculateKpiExpert_Inventario.ProcessData(calculateKpiExpert_Inventario.data,this.data.unix );
							Stage.DrawMapObjects(entities);
							ListEntities();

							$("#toolTip").css("visibility","visible");
							
							$("#toolTip").css("left",mouse_x+50);

							text="";
							for(var j=0;  j < this.productos.length; j++){	
								text+=`
								<tr style='color:"#ffffff";font-size:${12}px;margin:30px;'>
								<th style='text-align: left'><span   > ${this.productos[j].key}</th><th style='text-align: left'> ${formatNumber(this.productos[j].Fisico)}</span  ></th>
								</tr>;
								`;
							}

							$("#toolTip").html(text );

							var posY=mouse_y-50;
							if( $("#toolTip").height()+mouse_y > windowHeight ){
								posY=windowHeight-$("#toolTip").height()-50;
							}
							$("#toolTip").css("top",posY);

						})
						.on("mouseout",function(d){

							d3.select(this).style('stroke', '#1100EE');

						})
						.append("svg:title").text(function(){

							if(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito > 0){
								return "Físico: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  En Tránsito: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito)+" TM "+"  En TránsitoHoy: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].TransitoHoy);
							}else{
								return "Físico: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  ";
							}					
									
						});


			svgLines.append("text")				
							.style("fill","#000000")				
							.style("opacity",1)			
							.attr("class","timeline")   				
							.style("font-family","Cabin")
							.style("font-weight","bold")
							.style("font-size",12 )							
							.style("text-anchor","start")
							.attr("transform"," translate("+String(posX+4)+","+String( windowHeight-23 )+")  rotate("+(-90)+") ")
							.text(function(){
		
								return fechasDisponiblesArr[i].fecha.getDate()+" "+getMes(fechasDisponiblesArr[i].fecha.getMonth());
		
							});

			svgLines.append("text")				
							.style("fill","#FFFFFF")				
							.style("opacity",1)		
							.attr("class","timeline")   					
							.style("font-family","Cabin")
							.style("font-weight","bold")
							.style("font-size",12 )							
							.style("text-anchor","start")
							.attr("transform"," translate("+String(posX+2)+","+String( windowHeight-altura-20-alturaTransitoHoy- alturaTransito-23 )+")  rotate("+(-90)+") ")
							.text(function(){

								if(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito > 0){
									return "F: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  T: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Transito)+" TM ";
								}else{
									return "F: "+formatNumber(fechasDisponibles[fechasDisponiblesArr[i].unix].Fisico)+"  ";
								}							
								
		
							});

	}

	

	if(muestraMinimo){
		if(filtroUNSeleccionada!="" && filtroUNSeleccionada!=undefined){

			for (var e  in entities){
	
				if(e == filtroUNSeleccionada){

					var posY=GetValorRangos(entities[e].inventario.Minimo ,1, maximoInventarioFisicoPorDia, 1 , alturaBarras);;

					svgLines.append("line")							                       
							.attr("x1",windowWidth*.25 )
							.attr("y1", windowHeight-posY-20   )
							.attr("y2",  windowHeight-posY-20  )
							.attr("x2", windowWidth*.75 )
							.attr("class","timeline")   
							.style("pointer-events","auto")
														
							.style("stroke","#FFFFFF")
							.style("stroke-width",1);
				}
	
			}
	
		}

	}

}

var muestraMinimo=false;

function EnciendeApagaMinimo(){
	muestraMinimo=!muestraMinimo;
	Stage.DrawTimeline();

	if(muestraMinimo){
$("#menu1").css("color","yellow");
	}else{
		$("#menu1").css("color","white");
	}
}

var modoInventarioAbasto="abasto";

function MuestraInventarioEntidades(){

	if(modoInventarioAbasto=="inventario"){
		modoInventarioAbasto="abasto";
	}else if(modoInventarioAbasto=="abasto"){
		modoInventarioAbasto="produccion";
	}else if(modoInventarioAbasto=="produccion"){
		modoInventarioAbasto="inventario";
	}

	console.log("MODO: ",modoInventarioAbasto);
	ListEntities();

}

function ListEntities(){

		var caso=0;
		var alturaRenglon=22;
		var offsetX=10;
		var offsetTop=20;

		svgLinesTouch.selectAll(".entities").data([]).exit().remove();	


		$("#barsContainer2").css("width", windowWidth*.2 +"px");

		svgLinesTouch.attr("width", windowWidth*.2 );

		var entitiesArr=[];

		for (var e  in entities){

			var validoFillrate=true;
			
			var validoInventario=true;

			if(filtroInventario!="" && filtroInventario!=undefined){

				validoInventario=false;

				if(filtroInventario == entities[ e ].inventario.tipo){              

                    validoInventario=true;        
                    
                }

			}

			if(validoFillrate && validoInventario)
				entitiesArr.push(entities[e]);

		}

		entitiesArr = entitiesArr.sort(function(a,b)
							{
								if(a.inventario){
									return a.inventario.Capacidad - b.inventario.Capacidad;
								}else{
									return 0;
								}
									
							});

		entitiesArr.reverse();	
		
		
		//Para calcular el maximoVolFisicoPorDiaPorEntidad
		var maxVolFisicoEntidadDia=0;

		for (var e=0; e < entitiesArr.length; e++){

			for(var i=0; i < fechasDisponiblesArr.length; i++){

				var values=fechasDisponiblesArr[i].values.filter(function(element) {
					return element.Destino == entitiesArr[e].ID;
				});

				var volFisico=0;

				for(var j=0; j < values.length; j++){
						volFisico+=Number(values[j].Fisico);
				}

				if(maxVolFisicoEntidadDia<volFisico)
					maxVolFisicoEntidadDia = volFisico;

			}

		}

		var anchoVentanaMaximoEquipos=0;

		for (var e=0; e < entitiesArr.length; e++){	
			
			var colorEntidad="#ffffff";

			if(entitiesArr[e].inventario){

				if(entitiesArr[e].inventario.tipo){

					if(entitiesArr[e].inventario.tipo=="menor_minimo")
						colorEntidad="#ff0000";

					if(entitiesArr[e].inventario.tipo=="equilibrio")
						colorEntidad="#24FC00";

					if(entitiesArr[e].inventario.tipo=="mayor_optimo")
						colorEntidad="#0ABDFF";

				}

			}

			if(entitiesArr[e].inventario)
				colorEntidad = entitiesArr[e].inventario.colorBase;

			entitiesArr[e].LabelList=svgLinesTouch.append("text")				
								.style("fill",colorEntidad)				
								.style("opacity",1)			
								.attr("class","entities")   				
								.style("font-family","Cabin")
								.style("font-weight","bold")
								.style("font-size",12 )							
								.style("text-anchor","start")
								.style("pointer-events","auto")   
								.attr("transform"," translate("+String(offsetX)+","+String( offsetTop+(caso*alturaRenglon) )+")  rotate("+(0)+") ")
								.text(function(){

									this.data=entitiesArr[e];
									this.color=colorEntidad;
								
									if(entitiesArr[e].ID.length > 13)
										return entitiesArr[e].ID.substring(0,13)+"...";

									return entitiesArr[e].ID;
			
								})								
								.on("mouseover",function(d){

									d3.select(this).style('fill', "#ffffff" );

									ClearToolTips();

									$("#toolTip1").css("visibility","visible");
								
									$("#toolTip1").css("left",mouse_x+150);

									var data=this.data;

									filtroUNSeleccionada=data.Nombre;

									if(modoInventarioAbasto=="produccion"){

												var text=` <div class="detailContainer" style="background-color: #082e2e;">        
												<div>
													<div class="tooltipHeader" style=" border-color:#082e2e;">
														<span style='color:#FFFFFF;font-size:15px;'></span><span style='color:#00C6FF'>${data.Nombre}</span>
													</div>
												</div>
												<div style="">
												<div class="detail1" style="line-height:15px;">										
												`;

												text+=`<div class="tooltipDetailElement"><img id="" src="images/inventory.png" style="width:20px"></img>
													<span style='color:#ffffff;font-size:${15}px;'>Producción: </span><br>
													<span style='color:#fff600;font-size:${15}px;'></span> <span style='color:#ffffff'> <span style='color:#ffffff;font-size:${12}px;'> </span>
													</div><br>`;

												if(data.produccion){

													var color="#FFFFFF";													

													for(var j in data.produccion.grupos){

														if(EquiposColores[j])
														color=EquiposColores[j];

														text+=`<div class=""style="line-height:11px;margin-left:10px;font-size:${16}px;color:${color}">Proceso: ${ data.produccion.grupos[j].id }</div><br>
														<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;color:${color}">Utilización: ${formatNumber(data.produccion.grupos[j].Cycles)}</div><br>
														<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;color:${color}">Capacidad: ${formatNumber(data.produccion.grupos[j].MaxCycles)}</div><br><br>
														
														`;

													}

												}											

												text+=`
														<span style='color:#ffffff;font-size:${11}px;'> </span><br>
														`;

												text+=`</div>`;

												text+="</div></div></div>";

									}else{

												calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);												

												var text=` <div class="detailContainer" style="background-color: #082e2e;">        
													<div>
														<div class="tooltipHeader" style=" border-color:#082e2e;">
															<span style='color:#FFFFFF;font-size:15px;'></span><span style='color:#00C6FF'>${data.Nombre}</span>
														</div>
													</div>
													<div style="">
													<div class="detail1" style="">										
													`;

												text+=`<div class="tooltipDetailElement"><img id="" src="images/inventory.png" style="width:20px"></img>
													<span style='color:#ffffff;font-size:${15}px;'>Inventario: </span><br>
													<span style='color:#fff600;font-size:${15}px;'></span> <span style='color:#ffffff'> <span style='color:#ffffff;font-size:${12}px;'> </span>
													</div><br>`;

												text+=`<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Capacidad: ${formatNumber(data.inventario.Capacidad)}</div><br>
													<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Físico: ${formatNumber(data.inventario.Fisico)}</div><br>
													<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Transito: ${formatNumber(data.inventario.Transito)}</div><br>
													<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">TransitoHoy: ${formatNumber(data.inventario.TransitoHoy)}</div><br>
													<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Óptimo: ${formatNumber(data.inventario.Optimo)}</div><br>
													<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">Mínimo: ${formatNumber(data.inventario.Minimo)}</div><br><br>

													<div class=""style="line-height:11px;margin-left:10px;font-size:${14}px;">FillRate: ${(entities[data.Nombre])? entities[data.Nombre].fillRate+"%" : "FR ND" }</div><br>
													`;

												text+=`
														<span style='color:#ffffff;font-size:${11}px;'> </span><br>
														`;

												text+=`</div>`;

												text+="</div></div></div>";

									}

									var posY=mouse_y-50;
									if( $("#toolTip1").height()+mouse_y > windowHeight ){
										posY=windowHeight-$("#toolTip1").height()-50;
									}
									$("#toolTip1").css("top",posY);

									$("#toolTip1").html(text);

								})
								.on("mouseout",function(d){

									d3.select(this).style('fill', this.color );
									$("#toolTip").css("visibility","hidden");
									$("#toolTip1").css("visibility","hidden");

									filtroUNSeleccionada="";
									calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);

								})
								.on("click",function(d){

									Stage.FocusMapElement(this.data.Nombre);

								})
								;
			
			if(entities[entitiesArr[e].ID])
				entities[entitiesArr[e].ID].posYScroll=offsetTop+(caso*alturaRenglon);

			//RUTAS
			var xIndex=0;

			
			$("#abastoLabels").css("visibility","hidden");

			if(modoInventarioAbasto=="abasto"){

				$("#abastoLabels").css("visibility","visible");

					if(!entitiesArr[e].abasto)
						continue;

						console.log("abasto");
			
					for(var i in entitiesArr[e].abasto.comoOrigen.valoresRutas){	

									var radio=GetValorRangos( entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Real , 1 ,calculateKpiExpert_Abasto.maxPorRuta , 2 , 10);
									
									//FILTRADO
									var permiteDibujado=false;

									if(filtroNiveles!="" && filtroNiveles!=undefined){

										var cumplimiento=entitiesArr[e].abasto.comoOrigen.valoresRutas[i].cumplimiento;

										if(entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Plan==0 && entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Real>0 && filtroNiveles=="noPlaneados"){
											permiteDibujado=true;
										}else if(cumplimiento==0 && filtroNiveles=="Menor85"){
											permiteDibujado=true;
										}else if(cumplimiento <= 85 && filtroNiveles=="Menor85"){
											permiteDibujado=true;
										}else if(cumplimiento > 85 && cumplimiento <= 95 && filtroNiveles=="Mayor85"){
											permiteDibujado=true;
										}else if(cumplimiento > 95 && filtroNiveles=="Mayor95" && entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Plan>0){
											permiteDibujado=true;					
										}
										
									}else{
										permiteDibujado=true;	
									}	

									if(!permiteDibujado)
										continue;

									//Filtro de filllrate
									var validoFillrate=true;

									if(filtroFR!="" && filtroFR!=undefined){

										validoFillrate=false;

										if( entities[entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Destino]  ){

											if(  entities[entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Destino].fillRate ){
												
												if( filtroFR =="40" &&  entities[entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Destino].fillRate <= 40 ){             
													validoFillrate=true;                        
												}else if( filtroFR =="80" &&  entities[entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Destino].fillRate <= 80 ){
													validoFillrate=true;
												}else if( filtroFR =="90" &&  entities[entitiesArr[e].abasto.comoOrigen.valoresRutas[i].Destino].fillRate <= 90 ){
													validoFillrate=true;
												}

												
											}
										}                                       

									}

									if(!validoFillrate){
										continue;
									} 

									var circulo = svgLinesTouch
											.append('circle')
											.attr("class","entities")   
											.attr('cx', (xIndex*8)+offsetX+100 )
											.attr('cy', offsetTop+(caso*alturaRenglon))
											.attr('r', radio)
											.style("pointer-events","auto")   
											.style('fill', function(d){
												this.color=entitiesArr[e].abasto.comoOrigen.valoresRutas[i].color;
												this.origen=entitiesArr[e].ID;
												this.data=entitiesArr[e].abasto.comoOrigen.valoresRutas[i];
												this.data._id=i;
												this.fr=entitiesArr[e].fillRate;
												this.size=radio;
												return entitiesArr[e].abasto.comoOrigen.valoresRutas[i].color;
												} )
											.on("mouseover",function(d){

												d3.select(this).style('fill', 'white' ).attr('r', this.size*2);

												$("#toolTip").css("visibility","visible");
								
												$("#toolTip").css("left",mouse_x+40);	
												$("#toolTip").css("top",mouse_y-30);
												
												var text=`
													<p style='color:${this.color};font-size:${14}px;margin:18px;'>Destino: ${this.data.Destino}<br>
													Cumplimiento: ${formatNumber(this.data.cumplimiento)} %<br>
													Plan: ${formatNumber(this.data.Plan)} , Real: ${formatNumber(this.data.Real)} TM
													</p>
													<p style='color:white;font-size:${15}px;margin:18px;'>Fill Rate de ${this.data.Destino}: ${(entities[this.data.Destino])? entities[this.data.Destino].fillRate : "FR ND" }% </p>
													`;

												$("#toolTip").html(text);
												
								
											})
											.on("mouseout",function(d){
												d3.select(this).style('fill', this.color ).attr('r', this.size);
												$("#toolTip").css("visibility","hidden");
											})
											.on("click",function(d){
												console.log("click",this.data._id);
												Stage.idSelected=this.origen;
												Stage.RutaSelected=this.data._id;
												Stage.allowedToDraw=true;
												Stage.DrawLines();
											})
											;


											xIndex++;

					}

			}

			if(modoInventarioAbasto=="inventario"){

						xIndex=0;	
						
						fechasDisponiblesArr=fechasDisponiblesArr.sort((a, b) => b.unix - a.unix);  

						fechasDisponiblesArr.reverse();

						var anchoSVG = offsetX+100+(fechasDisponiblesArr.length*8);

						$("#barsContainer2").css("width", anchoSVG+"px" );

						svgLinesTouch.attr("width", anchoSVG );

						//Inventario por fechas por cdaa entidad
						for(var i=0; i < fechasDisponiblesArr.length; i++){

							var values=fechasDisponiblesArr[i].values.filter(function(element) {
								return element.Destino == entitiesArr[e].ID;
							});

							var volFisico=0;

							for(var j=0; j < values.length; j++){
									volFisico+=Number(values[j].Fisico);
							}


							var colorBase="#878787";

							if(filtroUNSeleccionada!="" && filtroUNSeleccionada!=undefined){

								if(filtroUNSeleccionada==entitiesArr[e].ID){

									if(volFisico == 0){
									
										colorBase="#FF00F6";								
	
									}else if(volFisico < entitiesArr[e].inventario.Minimo){
										colorBase="#ff0000";								
	
									}else if(volFisico > entitiesArr[e].inventario.Minimo && volFisico <  entitiesArr[e].inventario.Minimo+((entitiesArr[e].inventario.Optimo-entitiesArr[e].inventario.Minimo)*.1)  ){
										
										colorBase="#FFAE00";
										
									}else if(volFisico > entitiesArr[e].inventario.Minimo && volFisico < entitiesArr[e].inventario.Optimo){
										
										colorBase="#FCFF0F";
										
									}
									else if(volFisico > entitiesArr[e].inventario.Optimo){
										
										colorBase="#10E800";								
									
									}
								}								

							}else{

								if(volFisico == 0){

									colorBase="#FF00F6";								

								}else if(volFisico < entitiesArr[e].inventario.Minimo){
									colorBase="#ff0000";								

								}else if(volFisico > entitiesArr[e].inventario.Minimo && volFisico <  entitiesArr[e].inventario.Minimo+((entitiesArr[e].inventario.Optimo-entitiesArr[e].inventario.Minimo)*.1)  ){
									
									colorBase="#FFAE00";
									
								}else if(volFisico > entitiesArr[e].inventario.Minimo && volFisico < entitiesArr[e].inventario.Optimo){
									
									colorBase="#FCFF0F";
									
								}
								else if(volFisico > entitiesArr[e].inventario.Optimo){
									
									colorBase="#10E800";								
								
								}

							}

							var posX=(xIndex*8)+offsetX+100;
							
							
							radio=GetValorRangos( volFisico , 1 , maxVolFisicoEntidadDia , 2 , 9);

							if(radio < 1)
							radio=1;

							if(radio > 8)
							radio=8;				

							svgLinesTouch
									.append('circle')
									.attr("class","entities")   
									.attr('cx', (xIndex*8)+offsetX+100 )
									.attr('cy', offsetTop+(caso*alturaRenglon))
									.attr('r', radio)
									.style("pointer-events","auto")   
									.style('fill', function(d){
										this.fecha=fechasDisponiblesArr[i].fecha;
										this.color=colorBase;
										this.size=radio;
										this.volFisico=volFisico;
										this.inventario=entitiesArr[e].inventario;
										this.id=entitiesArr[e].ID;
										
										return colorBase;
										} )
										.on("mouseover",function(d){

											d3.select(this).style('fill', 'white' ).attr('r', this.size*1.4);

											$("#toolTip").css("visibility","visible");
							
											$("#toolTip").css("left",mouse_x+40);	
											$("#toolTip").css("top",mouse_y-30);
											
											var text=`
												<p style='color:${this.color};font-size:${14}px;margin:18px;'>U.N.: ${this.id}<br>
												Volumen Físico: ${formatNumber(this.volFisico)} TM<br>
												Mínimo: ${formatNumber(this.inventario.Minimo)} TM
												</p>
												<p style='color:white;font-size:${12}px;margin:18px;'>Fecha ${this.fecha} </p>
												`;

											$("#toolTip").html(text);
											
							
										})
										.on("mouseout",function(d){
											d3.select(this).style('fill', this.color ).attr('r', this.size);
											$("#toolTip").css("visibility","hidden");
										});

							xIndex++;

				}

				

			}

			
			$("#produccionLabels").css("visibility","hidden");

			if(modoInventarioAbasto=="produccion"){
				
				$("#produccionLabels").css("visibility","visible");

				if(entitiesArr[e].produccion){	

						var posY=offsetTop+(caso*alturaRenglon)-(alturaRenglon/2);
						var anchoMaximo=350;	
						
						var acumuladoGrupo=0;
					
						for(var j in entitiesArr[e].produccion.grupos){

							var anchoMax = GetValorRangos(entitiesArr[e].produccion.grupos[j].MaxCycles  , 1 , calculateKpiExpert_Produccion.max , 1 , anchoMaximo-4 );
							var anchoCiclo = GetValorRangos(entitiesArr[e].produccion.grupos[j].Cycles  , 1 , calculateKpiExpert_Produccion.max , 1 , anchoMaximo-4 );
							var color="#FFFFFF";

							if( EquiposColores[j] ){
								color=EquiposColores[j];
							}

							svgLinesTouch.append("rect")
										.attr("class","entities")
										.attr("width", anchoMax )
										.attr("height", 7)
										.attr("x", offsetX+acumuladoGrupo+100)
										.attr("y", posY-2)		
										.style("pointer-events","auto")  								
										.attr("fill", function(d){

											this.parent=entitiesArr[e].produccion;
											this.name=j;
											this.data=entitiesArr[e].produccion.grupos[j];

											return  "#000000";

										})
										.on("mouseover",function(d){

											if(this.data.fechas){
												for(var l in this.data.fechas){
													console.log(this.data.fechas[l].fecha,this.data.fechas[l].MaxCycles,this.data.fechas[l].Cycles);
												}
											}
											

											d3.select(this).attr('fill', 'white');

											$("#toolTip").css("visibility","visible");
									
											$("#toolTip").css("left",mouse_x+50);	

											var text=`  <div class="detailContainer" style="">        
														<div>
															<div class="tooltipHeader" style='color:"#ffffff";font-size:${13}px;margin:0px;'>
															 ${this.name}<br>			
															Capacidad: ${formatNumber(this.data.MaxCycles)}<br>	
															Producción Plan: ${formatNumber(this.data.Cycles)}<br>
															Cumplimiento: ${ Math.round((this.data.Cycles/this.data.MaxCycles)*100) }%<br>
															</div>
														</div>
																									
														`;

											$("#toolTip").html(text);

											var posY=mouse_y-50;
											if( $("#toolTip").height()+mouse_y > windowHeight ){
												posY=windowHeight-$("#toolTip").height()-30;
											}
											$("#toolTip").css("top",posY);

											
											
										})
										.on("mouseout",function(d){

											d3.select(this).attr('fill', '#000000');
											$("#toolTip").css("visibility","hidden");
			
										})
										.on("click",function(d){
											calculateKpiExpert_Produccion.DibujaDetalleTiempo(this.parent);
										});;

							svgLinesTouch.append("rect")
										.attr("class","entities")
										.attr("width", anchoCiclo )
										.attr("height", 3)
										.attr("x", offsetX+acumuladoGrupo+100)
										.attr("y", posY)		 								
										.attr("fill", function(d){
											return  color;

										});

							acumuladoGrupo+=anchoMax+20;

						}				

						var equipoAncho=0;						

						if( entitiesArr[e].produccion.equipos ){

							for(var j in entitiesArr[e].produccion.equipos ){
								

								var anchoMax=GetValorRangos( entitiesArr[e].produccion.equipos[j].MaxCycles  , 1 , calculateKpiExpert_Produccion.max , 1 , anchoMaximo-4 );
								var anchoCiclo=GetValorRangos( entitiesArr[e].produccion.equipos[j].Cycles  , 1 , calculateKpiExpert_Produccion.max , 1 , anchoMaximo-4 );

								svgLinesTouch.append("line")       
												.attr("class","entities")                                
												.attr("x1",offsetX+100+equipoAncho )
												.attr("y1", posY+11   )
												.attr("x2",offsetX+100+equipoAncho+anchoMax )
												.attr("y2", posY+11   )												
												.style("stroke",function(d){

													this.idPadre=entitiesArr[e].ID;
													this.produccionData=entitiesArr[e].produccion;
													this.data=entitiesArr[e].produccion.equipos[j];
													return "#191919";

												} )
												.style("stroke-width",11)
												.style("stroke-opacity",1)
												.style("pointer-events","auto") 
												.on("mouseover",function(d){

													d3.select(this).style('stroke', 'white');
		
													$("#toolTip").css("visibility","visible");
											
													$("#toolTip").css("left",mouse_x+50);	
		
													var text=`  <div class="detailContainer" style="">        
																<div>
																	<div class="tooltipHeader" style='color:"#ffffff";font-size:${13}px;margin:0px;'>
																	Equipo:  ${this.data.id}		<br>
																	Proceso:  ${this.data.grupo}<br>	
																	Capacidad:  ${formatNumber(this.data.MaxCycles)}<br>	
																	Producción Plan:  ${formatNumber(this.data.Cycles)}<br>
																	Cumplimiento:  ${ Math.round((this.data.Cycles/this.data.MaxCycles)*100) }%<br>
																	</div>
																</div>
																											
																`;
		
													$("#toolTip").html(text);
		
													var posY=mouse_y-50;
													if( $("#toolTip").height()+mouse_y > windowHeight ){
														posY=windowHeight-$("#toolTip").height()-30;
													}
													$("#toolTip").css("top",posY);

													
													
												})
												.on("mouseout",function(d){
		
													d3.select(this).style('stroke', '#191919');
													$("#toolTip").css("visibility","hidden");
					
												})
												.on("click",function(d){
													calculateKpiExpert_Produccion.DibujaDetalleTiempo(this.produccionData,this.idPadre);
												});

								var colorEquipo="#cccccc";
								
								if(EquiposColores[entitiesArr[e].produccion.equipos[j].grupo]){
									colorEquipo=EquiposColores[entitiesArr[e].produccion.equipos[j].grupo];
								}

								svgLinesTouch.append("line")       
												.attr("class","entities")                                
												.attr("x1",offsetX+100+equipoAncho )
												.attr("y1", posY+11   )
												.attr("x2",offsetX+100+equipoAncho+anchoCiclo )
												.attr("y2", posY+11   )												
												.style("stroke",colorEquipo )
												.style("pointer-events","none") 
												.style("stroke-width",6)
												.style("stroke-opacity",1);

								var valorGrande=anchoMax;

								if(anchoMax<anchoCiclo)
									valorGrande=anchoCiclo;

								equipoAncho+=valorGrande+5;

								if(anchoVentanaMaximoEquipos<equipoAncho+anchoMaximo);
									anchoVentanaMaximoEquipos=equipoAncho+anchoMaximo;
							}

						}					
										
				}

				$("#barsContainer2").css("width", anchoVentanaMaximoEquipos+100 );

			svgLinesTouch.attr("width", anchoVentanaMaximoEquipos+100 );


			}

			

			caso++;

		}

}

Stage.FocusMapElement=function(id){

	for (var e  in entities){

		if(e.toLowerCase() == id.toLowerCase()){
			viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(entities[e].Long, entities[e].Lat+(-1.5), 300000 ),
				orientation : {
					heading : Cesium.Math.toRadians(0),
					pitch : Cesium.Math.toRadians(-58.0),
					roll : 0.0
				}
			});
		}

	}
}