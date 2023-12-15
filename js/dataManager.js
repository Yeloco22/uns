var dataManager={};
var entities={};
dataManager.currentKpi;
//PROCESO QUE AGRUPA ELEMENTOS SEGUN EL NIVEL AL Q SE ENCUENTRA

dataManager.ClusterObjects=function(){

    //Stage.blockScreen.style("visibility","visible");

    //Crea entities a parir de catalogo de U.N.
    entities={};

    for(var i=0;  i < store.cat_plantas.length; i++){

        entities[ store.cat_plantas[i].ID ] = {ID:store.cat_plantas[i].ID , Lat:store.cat_plantas[i].Lat , Long:store.cat_plantas[i].Long , tipo:"planta",Nombre:store.cat_plantas[i].Nombre };

    }

    for(var i=0;  i < store.cat_cedis.length; i++){

        entities[ store.cat_cedis[i].ID ] = {ID:store.cat_cedis[i].ID ,Lat:store.cat_cedis[i].Lat , Long:store.cat_cedis[i].Long , tipo:"cedis",Nombre:store.cat_cedis[i].Nombre};

    }

    console.log("entities",entities);

    //Utiliza un timeout solo para q sea posible poner una pantalla de espera (negra)
    setTimeout(()=>{
        dataManager.CalculateKPIs();
    }, 100);

}

//PROCESO QUE GESTIONA CALCULOS DE KPI´s SEGUN EL NIVEL EN EL Q SE ENCUENTRA
var loadsCount=0;
var loadsTarget=0;
dataManager.CalculateKPIs=function(){   

    loadsCount=0;
    loadsTarget=4;

    if(calculateKpiExpert_FR){
        calculateKpiExpert_FR.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }
    
    if(calculateKpiExpert_Abasto){
        calculateKpiExpert_Abasto.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }
    
    if(calculateKpiExpert_Inventario){
        calculateKpiExpert_Inventario.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }
    
    if(calculateKpiExpert_Produccion){
        calculateKpiExpert_Produccion.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }

}

dataManager.checkAllLoads=function(){   

    if(loadsTarget==loadsCount){      
       
        dataManager.initDrawing("inventario");
        ListEntities();
    }
}

dataManager.initDrawing=function(kpi){  
    
    dataManager.currentKpi=kpi;
    Stage.DrawMapObjects(entities);

    var titulo=`<div style="font-size:100%;width:${windowWidth*.56}px";> 
    <span style="font-size:12px; color:white">
       Período: ${dateInit.getDate()} ${getMes(dateInit.getMonth())} ${String(dateInit.getFullYear())} al ${dateEnd.getDate()}  ${getMes(dateEnd.getMonth())} ${String(dateEnd.getFullYear())}
    </span></div>`;

    $("#titulo").html(titulo);   

}