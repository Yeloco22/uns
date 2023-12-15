var kpiExpert_FR={};

kpiExpert_FR.DrawElement=function(entity,varName,i){      
      
        var altura1=GetValorRangos(entity[varName].por1,1 ,100 ,1 ,entity.altura );

        var geometry1= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura1/2)  ),
                cylinder : {
                    length : altura1,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#4989FF").withAlpha(1)              
                    
                }
        });


        mapElementsArr.push(geometry1);						

        var altura2=GetValorRangos(entity[varName].por2,1 ,100 ,1 ,entity.altura );

        var geometry2= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura2/2)+altura1+(entity.altura*.02) ),
                cylinder : {
                    length : altura2,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#FFF117").withAlpha(1)              
                    
                }
        });


        mapElementsArr.push(geometry2);

        var altura3=GetValorRangos(entity[varName].por3,1 ,100 ,1 ,entity.altura );

        var geometry3= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura3/2)+altura1+altura2+(entity.altura*.04)  ),
                cylinder : {
                    length : altura3,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#FF0018").withAlpha(1)              
                    
                }
        });

        mapElementsArr.push(geometry3);

        if(i < 300){

                //VASO EXTERIOR
                var geometryExt= viewer.entities.add({
                        name : '',
                        position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (entity.altura/2)  ),
                        cylinder : {
                                length : entity.altura+(entity.altura*.04),
                                topRadius : entity.radio,
                                bottomRadius : entity.radio,
                                material : Cesium.Color.fromCssColorString("#ffffff").withAlpha(.2)              
                                
                        }
                        });

                mapElementsArr.push(geometryExt);
                mapElements[geometryExt.id]=entity;

        }else{
                mapElementsArr.push(geometry1);
                mapElements[geometry1.id]=entity;
        }   

       
   
}