var calculateKpiExpert_Plan={};
calculateKpiExpert_Plan.maxReal=50000;

calculateKpiExpert_Plan.DrawObjects=function(){

    for(var i=0;i < mapElementsArr.length;i++){

        viewer.entities.remove(mapElementsArr[i]);

    }

    mapElementsArr=[];

    for(var i in entities ){

            
            var radio=7000;

            var alturas = d3.scale.linear()
                        .domain([1,50000])
                        .range([30000, 50000 ]);

       

        if(entities[i].Long && entities[i].Lat ){

                var tipo;

                var colorBase="#00C6FF";

               

                //VASO TRANSPARENTE DE CAPACIDAD +***********
                var alturaParaLinea=0;

                var altura0=alturas( 80000 );
                
                if(entities[i].tipo=="cedis"){

                    var geometry1= viewer.entities.add({
                        name : '',
                        position: Cesium.Cartesian3.fromDegrees( entities[i].Long , entities[i].Lat , (altura0/2)  ),
                        cylinder : {
                            length : altura0,
                            topRadius : radio,
                            bottomRadius : radio,
                            material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.1)              
                            
                        }
                    });

                }else{

                    var geometry1= viewer.entities.add({
                        name: "",
                        position:  Cesium.Cartesian3.fromDegrees(entities[i].Long , entities[i].Lat , (altura0/2)  ),
                        box: {
                          dimensions: new Cesium.Cartesian3(radio*1.6, radio, altura0),
                          material: Cesium.Color.fromCssColorString("#ffffff").withAlpha(.1),
                        },
                    });

                }     
                
                geometry1.tipo=tipo;

                mapElementsArr.push(geometry1);

                entities[i].altura1=altura0;

                mapElements[geometry1.id]=entities[i];                        

                // FISICO 
                var altura2=alturas( 40000 );
                
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

               
                alturaParaLinea=60000;
                
                mapElements[geometry1.id].alturaGeom=alturaParaLinea;
                mapElements[geometry2.id].alturaGeom=alturaParaLinea;

               
               

              

        }
        
    }
                

}
