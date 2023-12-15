var kpiExpert_OOS={};

kpiExpert_OOS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();
    $("#toolTip2").css("visibility","hidden");	

}

kpiExpert_OOS.DrawTooltipDetail=function(entity){    

    console.log(entity);

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();

    var maximo=0;
    for(var e in entity.oos.unidades){

        if(maximo < entity.oos.unidades[e].oosVal*1000){
            maximo=entity.oos.unidades[e].oosVal*1000;
        }

    }

    var ancho=20;
    var caso=0;
   
    var elementos = Object.keys(entity.oos.unidades);
    var svgTooltipWidth=elementos.length*ancho;
    var svgTooltipHeight=500;
    var marginBottom=svgTooltipHeight*.3;
    var tamanioFuente=ancho*.8;


    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",(mouse_x+300)+"px");
    $("#toolTip2").css("top",mouse_y-50+"px");    
    var toolText =  
                "<span style='color:#fff600'><span style='color:#ffffff'>"+entity.key+"</span></span> <br>"+               
                "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);
    d3.select("#toolTip2")                                     
                .style("width", (svgTooltipWidth)+"px" );

    d3.select("#svgTooltip")                     
                .style("width", svgTooltipWidth )
                .style("height", svgTooltipHeight )
                ;

    var unidadesArr=[];

    for(var e in entity.oos.unidades){
        unidadesArr.push(entity.oos.unidades[e]);
    }

    unidadesArr = unidadesArr.sort((a, b) => b.oosVal - a.oosVal);


    for(var i=0; i < unidadesArr.length; i++ ){
    
        var altura=GetValorRangos( unidadesArr[i].oosVal*1000,-1, maximo ,1,svgTooltipHeight*.5);
      
        d3.select("#svgTooltip").append("rect")		    		
					.attr("width",ancho*.8 )
                    .attr("class","ossDetail")
					.attr("x",ancho*caso  )
					.attr("y", svgTooltipHeight-altura-3-marginBottom  )
					.attr("height",1)
					.attr("fill","#ffffff")
                    .transition().delay(0).duration(i*50)
					.style("height",altura )	
					;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","ossDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight-altura-5)-marginBottom  )+")  rotate("+(-90)+") ")
                    .text(function(){
                    
                        return Math.round( unidadesArr[i].oosVal*10000 )/100;

                    })
                    .transition().delay(0).duration(i*50)
					.style("opacity",1 )
                  ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","ossDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)	
                    .style("text-anchor","end")
                    .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight)-marginBottom  )+")  rotate("+(-90)+") ")
                    .text(function(){
                  
                        return  unidadesArr[i].origen;

                    });

                    caso++;

        
    }

    

}