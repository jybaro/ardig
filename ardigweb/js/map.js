 
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
 
 	db = new PouchDB('geo');
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
	  "_id": "clara",
	  "nombre": "Clara Sánchez",
	  "edad": 3,
	  "hobbies": [
	    "Basquet"
	  ]
	};
	db.put(doc);*/
	
	//Guardar datos en la base geo
	/*var doc = {
	  "_id": "002",
	  "lat": -0.2201,
	  "lng": -78.5121,
	  "titulo": "Punto1",
	  "descripcion": "Este es el punto 1"
	};
	db.put(doc);*/

    //Consultar un registro
    /*db.get('001').then(function (doc) {
    	  console.log(doc.lat);
    	});*/
    	
    	/*db.allDocs({
            include_docs : true,
            startkey : '',
            endkey : '\uffff'
        }).then(function(response) {
            response.rows.forEach(function(resp){
                console.log(resp);
            });
        }).catch(function(err){
            console.log('ERROR:', err);
        });*/
    	
 //leftlet
 var map = L.map('map').setView([-0.2201, -78.5121], 14);
 new StorageTileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {storage: db,
 //L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	 //L.tileLayer('leaflet/images/map/{z}/{x}/{y}.png',
    /*attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',*/
    maxZoom: 18,
 }).addTo(map);

/*map.on('click', function(e) {
    alert(e.latlng);
});*/

L.control.scale().addTo(map);
//L.marker([-0.2201, -78.5121], {draggable: true}).bindPopup('<b>Plaza de la Independencia</b><br>Esta plaza es el centro de la ciudad de Quito').addTo(map);

db.allDocs({
            include_docs : true,
            startkey : '',
            endkey : '\uffff'
        }).then(function(response) {
            response.rows.forEach(function(resp){
            	doc=resp.doc;
            	//console.log(doc);
				L.marker([doc.lat, doc.lng], {draggable: true}).bindPopup('<b>'+doc.titulo+'</b><br>'+doc.descripcion).addTo(map);	
            });
        }).catch(function(err){
            console.log('ERROR:', err);
        });