//guardar en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ){

    
    if( res. ok ){
        
        return caches.open( dynamicCache ).then( cache =>{
            //almacen en el cache el request
            cache.put( req, res.clone() );
            return res.clone();
        });
    }else{
        return res;
    }
}