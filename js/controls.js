var filterControls={};
var controlsInit=false;
var filtroTipo;
var filtroNiveles;
var filtroInventario;
var filtroPresentacion;
var filtroFR;
var filtroUNSeleccionada;
var filtroProducto;

filterControls.createDataFiltersControls=function(catalogs){

    console.log("createDataFiltersControls ******");
    
    if(!controlsInit){

        controlsInit=true;
        vix_tt_formatMenu("#Controls",".",160);
        //$("#Controls").css("max-height","600px");
        $("#Controls").css("height","550px");
        $("#Controls").css("width","350px");

        $("#Controls").append(`

            <div id="ControlsBlocks" style="display: flex;">

                    <div id="ControlsFields"></div>  
                    
                    <div style="width:90%;position:absolute;bottom:15px;display: flex;">
                             
                                <button class="filters" onclick=";" style="margin: 3px;color:black">Filtrar</button> 
                                <button id="mostrarModo" class="filters" onclick="CambiaModo()" style="margin: 3px;color:black">Muestra Solo Selección</button>
                                <button id="mostrarModo" class="filters" onclick="CambiaModoEspesor()" style="margin: 3px;color:black">Espesor Relativo/Global</button>
                                <button id="mostrarModo" class="filters" onclick="CambiaModoAlturaCedis()" style="margin: 3px;color:black">Altura CEDIS</button>   
                        </div>

                    <div id="ControlsFieldsCustom" style="margin-left: 15px;">                    

                    </div>
            </div>

        `);      
    
        
    }
   

    // TIPOS DE SERVICIO
    $("#ControlsFieldsCustom").append(
        `
        <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
            Tipo de transporte: <br> <br>                 
            <select id="tipo_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
            <option value=""></option>
            <option value="auto">Auto</option>
            <option value="ffcc">FFCC</option>
            <option value="barco">Barco</option>
           
            </select>

        </div>                            
        `
    );

    d3.select("#tipo_cb").on("change",function(){           
      
            filtroTipo=$("#tipo_cb").val();

    });

    // CUMPLIMIENTO
    $("#ControlsFieldsCustom").append(
        `
        <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
            Niveles de Cumplimiento en rutas: <br> <br>               
            <select id="cumplimiento_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
            <option value=""></option>
            <option value="Mayor95">Mayor a 95%</option>
            <option value="Mayor85">Entre 85 y 95</option>
            <option value="Menor85">Menor a 85</option>
            <option value="noPlaneados">No planeados</option>
           
            </select>

        </div>                            
        `
    );

    d3.select("#cumplimiento_cb").on("change",function(){           

        filtroNiveles=$("#cumplimiento_cb").val();  
        ListEntities();

    });

    // CUMPLIMIENTO INVENTARIO
    $("#ControlsFieldsCustom").append(
        `
        <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
            Niveles de Inventario: <br> <br>                 
            <select id="inventario_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
            <option value=""></option>
            <option value="mayor_optimo">Arriba del óptimo</option>
            <option value="equilibrio">Entre óptimo y mínimo</option>
            <option value="menor_minimo">Debajo del mínimo</option>
        
            </select>

        </div>                            
        `
    );

    d3.select("#inventario_cb").on("change",function(){           

            filtroInventario=$("#inventario_cb").val();
            MuestraOcultaInventario();
            calculateKpiExpert_FR.ProcessData(calculateKpiExpert_FR.data);
            ListEntities();
            
    });  
    
    // PRESENTACIÓN
    $("#ControlsFieldsCustom").append(
        `
        <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
            Presentación: <br> <br>                 
            <select id="presentacion_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
            <option value=""></option>
            <option value="sacos">sacos</option>
            <option value="granel">granel</option>
        
            </select>

        </div>                            
        `
    );

    d3.select("#presentacion_cb").on("change",function(){           

            filtroPresentacion=$("#presentacion_cb").val();
            calculateKpiExpert_Abasto.FiltraPresentacionAbasto();
            calculateKpiExpert_Inventario.ProcessData(calculateKpiExpert_Inventario.data);
            calculateKpiExpert_FR.ProcessData(calculateKpiExpert_FR.data);
            Stage.DrawMapObjects(entities);
            ListEntities();
            calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);

    });  

    // PRODUCTO
    $("#ControlsFieldsCustom").append(
        `
        <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
            Producto: <br> <br>                 
            <select id="producto_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
            <option value=""></option>
            <option value="Gris">Gris</option>
            <option value="Mortero">Mortero</option>
            <option value="Blanco">Blanco</option>
            <option value="Multiplast">Multiplast</option>
            <option value="Impercem">Impercem</option>
            <option value="Otros">Otros</option>
            </select>

        </div>                            
        `
    );

    d3.select("#producto_cb").on("change",function(){           
      
        filtroProducto=$("#producto_cb").val();

        calculateKpiExpert_Inventario.ProcessData(calculateKpiExpert_Inventario.data);
        calculateKpiExpert_Inventario.ProcessDates(calculateKpiExpert_Inventario.data);
        Stage.DrawMapObjects(entities);
        

        
        calculateKpiExpert_Abasto.calculateKPI(entities).then(()=>{
            
            ListEntities();

         });

         calculateKpiExpert_Produccion.calculateKPI(entities).then(()=>{
            ListEntities();
         });


    });

    // FILLRATE
    $("#ControlsFieldsCustom").append(
        `
        <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
            Nivel de Fillrate: <br> <br>                 
            <select id="fr_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
            <option value=""></option>
            <option value="90">Menores de 90</option>
            <option value="80">Menores de 80</option>
            <option value="40">Menores de 40</option>         
            </select>

        </div>                            
        `
    );

    d3.select("#fr_cb").on("change",function(){           

            filtroFR=$("#fr_cb").val();
            
            calculateKpiExpert_Inventario.ProcessData(calculateKpiExpert_Inventario.data);
            calculateKpiExpert_FR.ProcessData(calculateKpiExpert_FR.data);

            Stage.DrawMapObjects(entities);
            ListEntities();

    });  

    
     

    
}

var caso=0;
filterControls.FilterData=function(){

     //Valida si hay valores en los fomrCOntrols
     caso=0;
     for(var i=0; i < store.catlogsForFilters.length; i++){
         
             if($("#"+store.catlogsForFilters[i].id).val() != "" && $("#"+store.catlogsForFilters[i].id).val() != undefined ){
                 caso++;
             }
         
     }  

    //valida , si no ha cmabiado nada no procede con el filtrado
    if( caso==0 && (store[store.mainDataset].length==store.dataToDraw.length) ){

        return;

    }else{

        store.dataToDraw=filterControls.FilterSpecificDataSet(store[store.mainDataset],"nameOnFR");

        store.pendientes_filtered=filterControls.FilterSpecificDataSet(store.pendientes,"nameOnFR");

        document.getElementById('cesiumContainer').focus();

        dataManager.ClusterObjects();
    }  

    

}   

filterControls.FilterSpecificDataSet=function(Rows,fieldsNames){     

    if(caso>0){

     for(var i=0; i < Rows.length; i++){
       // for(var i=0; i < 500; i++){

            Rows[i].filtrosCumplidos=0;
            Rows[i].visible=false; 

            for(var j=0; j < store.catlogsForFilters.length; j++){    
                    
                if(store.catlogsForFilters[j].id){
                    if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined ){

                        if(Rows[i][store.catlogsForFilters[j][fieldsNames]]){
                            if( 
                                ($("#"+store.catlogsForFilters[j].id).val().toLowerCase() == Rows[i][store.catlogsForFilters[j][fieldsNames]].toLowerCase() ) ||
                                ( getIdFromCatlog($("#"+store.catlogsForFilters[j].id).val().toLowerCase(),store.catlogsForFilters[j].records ).toLowerCase() == Rows[i][store.catlogsForFilters[j][fieldsNames]].toLowerCase() )                            
                            ){             
                                            
                                Rows[i].filtrosCumplidos++;
                            }     
                        }else{
                        
                            Rows[i].filtrosCumplidos++;
                        }          

                    }else{
                        
                        Rows[i].filtrosCumplidos++;
                    }
                }else{
                        
                    Rows[i].filtrosCumplidos++;
                } 
            }

            if(Rows[i].filtrosCumplidos==store.catlogsForFilters.length){
                             
                Rows[i].visible=true;
            }
               

        }

    }else{

        for(var i=0; i < Rows.length; i++){
            Rows[i].visible=true;    
        }

    }
    
    var visibles=[];
    var no_visibles=[];

    for(var i=0; i < Rows.length; i++){
       if( Rows[i].visible==true){
            visibles.push(Rows[i]);    
       }else{
            no_visibles.push(Rows[i]);    
       }        
    }

    return visibles;

    

}

function getIdFromCatlog(name,catlog){
   
    for(var i=0; i < catlog.length; i++){    
        if(name == catlog[i].Nombre.toLowerCase()){
           
            return catlog[i].ID;
        }
    }

}

filterControls.createHardCodedControls=function(){
    
       
}