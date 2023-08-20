//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE      = 'static-v2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

//esta constante va a contener lo necesario para mi aplicación
//STATICO
const APP_SHELL =[
    //'/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/js/app.js',
    '/js/sw-utils.js',
];

//NO SE MODFICA
const APP_SHELL_INMUTABLE =[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    '/css/animate.css',
    '/js/libs/jquery.js'
];


//INSTALACIÓN
self.addEventListener('install', e=>{

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>{
        cache.addAll( APP_SHELL);
    })

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>{
        cache.addAll( APP_SHELL_INMUTABLE);
    })

    //esperar a que termine
    e.waitUntil( Promise.all([cacheStatic, cacheInmutable])) ;
})

//ELIMINAR CACHE ANTIGUO STATICO
self.addEventListener('activate', e =>{
    
    const respuesta = caches.keys().then( keys =>{
        keys.forEach( key =>{
            if(key  !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        })
    })

    e.waitUntil( respuesta);
})


//TRABAJAR CON CACHE
self.addEventListener( 'fetch', e=>{

    //verificar en la cache si existe request
    const respuesta =caches.match(e.request).then( res =>{
        
        if(res){
            return res;
        }else{
            console.log(e.request.url);
            return fetch( e.request).then( newRes =>{
                //almacenar en el cache dinamico
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
            })

        }
        
    })

    e.respondWidth( respuesta );
})