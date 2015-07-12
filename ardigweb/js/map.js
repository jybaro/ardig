 
 var StorageTileLayer = L.TileLayer.extend({
	    _setUpTile: function (tile, value, blob) {
	        tile._layer = this;
	        if (blob) {
	            value = URL.createObjectURL(value);
	            tile.onload = function () {
	                URL.revokeObjectURL(value);
	                L.TileLayer.prototype._tileOnLoad.apply(this, arguments);
	            };
	            tile.onerror = function () {
	                URL.revokeObjectURL(value);
	                L.TileLayer.prototype._tileOnError.apply(this, arguments);
	            };
	        } else {
	            tile.onload = this._tileOnLoad;
	            tile.onerror = this._tileOnError;
	        }

	        tile.src = value;

	        this.fire('tileloadstart', {
	            tile: tile,
	            url: tile.src
	        });
	    },

	    _loadTile: function (tile, tilePoint) {
	        this._adjustTilePoint(tilePoint);
	        var key = tilePoint.z + ',' + tilePoint.x + ',' + tilePoint.y;
	        var self = this;
	        if (this.options.storage) {
	            this.options.storage.getAttachment(key, '', function (err, value) {
	                if (value) {
	                    self._setUpTile(tile, value, true);
	                } else {
	                    self._setUpTile(tile, self.getTileUrl(tilePoint));
	                }
	            });
	        } else {
	            self._setUpTile(tile, self.getTileUrl(tilePoint));
	        }
	    }
	});
 
 	db = new PouchDB('geo2');
    /*db.sync('http://104.131.40.56:5984/hackmapp', {
        live: true,
        retry: true
    }).on('change', function (change) {
    }).on('paused', function (info) {
    }).on('active', function (info) {
    }).on('denied', function (info) {
    }).on('complete', function (info) {
    }).on('error', function (err) {
    });*/
    
    //Informacion de la base de datos
    /*db.info().then(function (info) {
    	  console.log(info);
    	});*/
    	
    //Habilitar / desahilitar debug	
    //PouchDB.debug.enable('*');
    //PouchDB.debug.disable();
    
    //Guardar datos en la base hackmap2
    /*var doc = {
	  "_id": "0004",
	  "entrevistado_nombre": "Clara Sánchez",
	  "entrevistado_cargo": "Representante",
	  "entrevistado_correo": "clara.sanchez@tecnologia593.net",
	  "entrevistado_telefono": "0988228410",
	  "barrio": "Conocoto",
	  "parroquia": "Conocoto",
	  "canton": "Quito",
	  "provincia": "Pichincha",
	  "organizacion_nombre": "Colegio Sánchez",
	  "organizacion_tipo": "Colegio",
	  "organizacion_mision": "La misión de este colegio es ser una institución lider en la preparación de estudiantes secundarios dentro del Ecuador",
	  "organizacion_telefono": "",	  
	  "organizacion_relacionadas": [
	    "Tecnologia 593",
	    "Jybaro"
	  ],
	  "opiniones": "Opciones",
	  "expectativas": "Expectativas",
	  "problemas": "Problemas",
	  "propuestas": "Propuestas",
	  "historia": "Historia",
	  "capacitacion": [
	    "Word",
	    "Excel"
	  ],
	  "latitud": "-0.2201",
	  "longitud": "-78.5201",
	  "fotografia": "",
	  "video": "",
	  "usuario": "ehuertas",
	  "fecha_creacion": "20150711",
	  "fecha_modificacion": "20150711",
	};
	db.put(doc);*/
	

    	
 //leftlet
 //L.marker([-0.2201, -78.5121], {draggable: true}).bindPopup('<b>Plaza de la Independencia</b><br>Esta plaza es el centro de la ciudad de Quito').addTo(map);
var Escuela = L.layerGroup();
var Colegio = L.layerGroup();
db.allDocs({
            include_docs : true,
            startkey : '',
            endkey : '\uffff'
        }).then(function(response) {
            response.rows.forEach(function(resp){
            	doc=resp.doc;
            	//console.log(doc);
            	var icono = 'phone';
            	var tipo=doc.organizacion_tipo;
            	L.marker([doc.latitud, doc.longitud], {icon: L.AwesomeMarkers.icon({icon: icono, prefix: 'fa', markerColor: 'darkblue'}) }).bindPopup('<b>'+doc.organizacion_nombre+'</b><br>'+doc.organizacion_tipo+'<br>'+doc.organizacion_mision).addTo(tipo=='Escuela'?Escuela:Colegio);            		
            	
				//console.log(a.length);
            });
        }).catch(function(err){
            console.log('ERROR:', err);
        });

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';



var calles  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
completo  = L.tileLayer(mbUrl, {id: '',   attribution: mbAttr});

var map = L.map('map',{
	 layers: [Colegio, Escuela]
}).setView([-0.2201, -78.5121], 14);

new StorageTileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {storage: db,
//L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	 //L.tileLayer('leaflet/images/map/{z}/{x}/{y}.png',
   /*attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',*/
   maxZoom: 18,
}).addTo(map);

/*map.on('click', function(e) {
   alert(e.latlng);
});*/

var baseLayers = {		
		"Vista Completa": completo,
		"Vista de Calles": calles
	};


var overlayMaps = {
	    "Escuelas": Escuela,
	    "Colegios": Colegio
	};
L.control.layers(baseLayers, overlayMaps).addTo(map);

//Escala
L.control.scale().addTo(map);

//Localizacion
lc = L.control.locate({
    follow: true,
    strings: {
        title: "Ubícame"
    }
}).addTo(map);

map.on('startfollowing', function() {
    map.on('dragstart', lc._stopFollowing, lc);
}).on('stopfollowing', function() {
    map.off('dragstart', lc._stopFollowing, lc);
});