var db;

var inicializado = false;

var app = {
    info: {
        estado_conexion:'',
        numero_estacion:0,
        usuario:null,
        crypt_password: 'H4ck.m4pP',
        
        remoteDB_url: 'http://104.131.40.56:5984/hackmapp',
        
        remoteDB_mail_url: 'http://104.131.40.56:5984/hackmapp_mail',
        
        version:1
    },

    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
    },
    
    
    onDeviceReady: function() {
        if (!window.inicializado) {
            //app.receivedEvent('deviceready');
            window.inicializado = true;
            app.conectarBdd();
        }
    },
    
    
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    
    conectarBdd: function() {
        console.log('en conectarBdd');
        db = new PouchDB('hackmapp');
        
        db.sync(window.app.info.remoteDB_url, {
            live: true,
            retry: true
        }).on('change', function (change) {
            p_inicializar_sistema();
        }).on('paused', function (info) {
            if (info) {
                p_mostrar_estado_conexion('offline');
            } else {
                p_mostrar_estado_conexion('online');
            }
        }).on('active', function (info) {
            p_mostrar_estado_conexion('online');
        }).on('denied', function (info) {
        }).on('complete', function (info) {
        }).on('error', function (err) {
        }).catch(function(err){
        });
        
        console.log('en conectarBdd 2');
        
        var remoteDB = new PouchDB(window.app.info.remoteDB_url).then(function(r){
            p_mostrar_estado_conexion('online');

            //////////////////////////////////////////////////////////
            // Obteniendo la cantidad de documentos locales y remotos:
            //l.allDocs({limit:0}).then(function(ll){
            //    // comentados todos los console.log //console.log('Docs en local: ' + ll.total_rows);
            //});

            //r.allDocs({limit:0}).then(function(rr){
            //    // comentados todos los console.log //console.log('Docs en remoto: ' + rr.total_rows);
            //});
            remoteDB = null;
            // comentados todos los console.log //console.log('--- --- ---');

        }).catch(function(err){
            p_mostrar_estado_conexion('offline');
            // comentados todos los console.log //console.log('Error en remoto: ', err);
        });
    }
};

app.initialize();


function p_mostrar_estado_conexion(estado) {
    console.log('mostrando estado', estado);
    app.info.estado_conexion = estado;
    
    msg = p_('online_offline');
    if (estado == 'offline') {
        msg.innerHTML = 'offline';
        msg.style.color = '#696';
        msg.style.backgroundColor = '#030';
    } else if (estado == 'online') {
        msg.innerHTML = 'online';
        msg.style.color = '#FFF';
        msg.style.backgroundColor = '#3a3';
        
        //evento ONLINE
        //p_evaluar_metadata_sistema();
        //p_verificar_configuracion();
        p_inicializar_sistema();
    }
}

function p_inicializar_sistema() {
    //p_evaluar_metadata_sistema();

    //p_llenar_opciones_ubicaciones();
    
    //p_borrar_ordenes_correo_atendidas();
    
    
    
    //p_poner_foco_en_nombre_usuario();
}

function p_alerta(msg) {
    p_('vm_alerta_mensaje').innerHTML = msg;
    $('#vm_alerta').modal('show');
}

function p_(target) {
    return document.getElementById(target);
}

function p_display(target, display) {

    var nodo = (typeof(target) == 'string') ? p_(target) : target;

    if (nodo) {
        var typeof_display = typeof(display);

        if (typeof_display == 'undefined') {
            display = (nodo.style.display != 'none');
        } else if (typeof_display == 'string' && display == 'cambio') {
            display = p_display(nodo, !p_display(nodo));
        } else {
            nodo.style.display = (display) ? '' : 'none';
            if (!display) {
                //si se oculta, borra todos los valores de los campos dentro:
                //var listado_campos = nodo.querySelectorAll(":scope > input,textarea,select");
                
                //var listado_campos = nodo.querySelectorAll("input");
                //// comentados todos los console.log //console.log('LISTADO querySelectorAll: ', listado_campos);
                //for (var i = 0; i < listado_campos.length; i++) {
                //    campo = listado_campos[i];
                    //p_valor(campo, '');
                //    if (campo.type == 'text' || campo.type == 'number') {
                //        campo.value = '';
                //    }
                //}
            }
        }
    }
    return display;
}


function p_select(target, value) {
    value = value || null;
    
    if (target) {
        var nodo = (typeof(target) == 'string') ? p_(target) : target;
        
        if (nodo.tagName.toLowerCase() == 'select') {
            if (value !== null) {
                // poner valor en select
                nodo.value = value;

            } else {
                // retornar valor de select
                value = nodo.options[nodo.selectedIndex].value;
            }
        }
    }
    return value;
}

