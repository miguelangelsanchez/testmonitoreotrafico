var map;
var marcadores = [];

var marcadoresGasolineras = [];
var marcadoresIncidentes = [];
var marcadoresEstacionamientos = [];

var ventanaInformacionGrande;
var limites;
var markerImage;
var defaultIcon ;
var highlightedIcon;

var estilosAgua = {
    featureType: 'water',
    stylers: [
        { color: '#FF0000' }
    ]
};

var estilosStroke = {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
        { color: '#ffffff' },
        { weight: 6 }
    ]
};

var estilosTextFill = {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
        { color: '#e85113' }
    ]
};

var estilosRoadHighWay = {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
    ]
};
/*
var styles = [
    estilosAgua,
    estilosStroke,
    estilosTextFill,
    estilosRoadHighWay, {
        featureType: 'transit.station',
        stylers: [
            { weight: 9 },
            { hue: '#e85113' }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
            { visibility: 'off' }
        ]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
            { lightness: 100 }
        ]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            { lightness: -100 }
        ]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            { visibility: 'on' },
            { color: '#f0e4d3' }
        ]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
        ]
    }
];
*/

var styles = [
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
];

var ubicaciones = [
];

var ubicacionesGasolineras = [];

var ubicacionesIncidentes = [];

var ubicacionesEstacionamientos = [];

function inicializarMapa() {
    ventanaInformacionGrande = new google.maps.InfoWindow();
    limites = new google.maps.LatLngBounds();
    //markerImage = new google.maps.MarkerImage('Imagenes/estacionamiento.png');//new google.maps.MarkerImage();

    //defaultIcon = makeMarkerIcon('0091ff');
    defaultIcon = makeMarkerIcon('ff0000');
    highlightedIcon = makeMarkerIcon('FFFF24');
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 19.4218896, lng: -99.1247552
        },
        zoom: 13,
        //styles: styles,
        mapTypeControl: false
    });

}

function crearIconoMarcador(colorMarcador) {
    /*
    imagenMarcador = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + colorMarcador +
        '|40|_|%E2%80%A2',
        new google.maps.Size(18, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(18, 34)
    );
    return imagenMarcador;
    */
    return new google.maps.MarkerImage('Imagenes/gasolinera.png');
}

function makeMarkerIcon(markerColor) {

    //return new google.maps.MarkerImage('https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png');

    //return new google.maps.MarkerImage('Imagenes/gasolinera.png');
    //return new google.maps.MarkerImage('Imagenes/estacionamiento.png');
    return new google.maps.MarkerImage('Imagenes/incidente.png');
    /*
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var marker = new google.maps.Marker({
        //position: myLatLng,
        //map: map,
        icon: iconBase + 'parking_lot_maps.png'
    });

    return marker;
    */

    /*
    markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(18, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(18, 34)
    );
    return markerImage;
    */
}

function crearMarcadoresUbicaciones(ubicaciones, tipoMarcador) {

    var marcadores = [];

    for (var indice = 0; indice < ubicaciones.length; indice++) {
        var pocision = ubicaciones[indice].ubicacion;
        var titulo = ubicaciones[indice].titulo;
        var marcador = crearMarcador(pocision, titulo, indice);
        
        marcadores.push(marcador);
        
        marcador.addListener('click', function () {
            crearVentanaInformacion(this, ventanaInformacionGrande);
        });
        
        marcador.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });

        marcador.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
        
        limites.extend(marcadores[indice].position);
    }
    
    map.fitBounds(limites);

    if (tipoMarcador == "Gasolineras")
        marcadoresGasolineras = marcadores;
    else if (tipoMarcador == "Incidentes")
        marcadoresIncidentes = marcadores;
    else if (tipoMarcador == "Estacionamientos")
        marcadoresEstacionamientos = marcadores;
}



function establecerNuevoPunto() {
    var puntoTribeca = { lat: 40.719526, lng: -74.0089934 };
    crearMarcador(puntoTribeca, "texto marcador 1",0);
}

function crearMarcador(punto, texto, numeroIdentificador) {

    return new google.maps.Marker({
        map: map,
        position: punto,
        title: texto,
        animation: google.maps.Animation.DROP,
        id: numeroIdentificador
        , label: { text: texto, color: "black", fontWeight: "bold" }
        , icon: 'Imagenes/estacionamiento.png'
            //'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    });
}

var marcadorTemporal;

function crearVentanaInformacion(marcador, ventanaInformacion) {
    
    if (ventanaInformacion.marker != marcador) {
        marcadorTemporal = marcador;

        ventanaInformacion.marker = marcador;
        //ventanaInformacion.setContent('<div><b>' + marcador.title + "<br/>ubicacion: " + marcador.position.toString() + '</b></div>');
        ventanaInformacion.setContent('');
        //ventanaInformacion.open(map, marcador);

        ventanaInformacion.addListener('closeclick', function () {
            ventanaInformacion.setMarker = null;
        });

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marcadorTemporal.position);
                ventanaInformacion.setContent('<div>' + marcadorTemporal.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marcadorTemporal.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }

        streetViewService.getPanoramaByLocation(marcador.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        ventanaInformacion.open(map, marcador);
    }
}



function extenderLimitesPorMarcador(indice) {
    marcadores[indice].setMap(map);
    limites.extend(marcadores[indice].position);
}

function mostrarUbicaciones(tipoMarcador) {

    if (tipoMarcador == "Gasolineras")
        marcadores = marcadoresGasolineras ;
    else if (tipoMarcador == "Incidentes")
        marcadores = marcadoresIncidentes ;
    else if (tipoMarcador == "Estacionamientos")
        marcadores = marcadoresEstacionamientos;

    limites = new google.maps.LatLngBounds();
    
    for (var indice = 0; indice < marcadores.length; indice++) 
        extenderLimitesPorMarcador(indice);
    
    //map.fitBounds(limites);
}

function ocultarUbicaciones(tipoMarcador) {

    if (tipoMarcador == "Gasolineras")
        marcadores = marcadoresGasolineras;
    else if (tipoMarcador == "Incidentes")
        marcadores = marcadoresIncidentes;
    else if (tipoMarcador == "Estacionamientos")
        marcadores = marcadoresEstacionamientos;

    for (var indice = 0; indice < marcadores.length; indice++) 
        marcadores[indice].setMap(null);
}

function asignarComportamientoMostrarPuntos() {
    $("#mostrarGasolineras").on("click", function () {
        mostrarUbicaciones("Gasolineras");
    });
    $("#mostrarIncidentes").on("click", function () {
        mostrarUbicaciones("Incidentes");
    });
    $("#mostrarEstacionamientos").on("click", function () {
        mostrarUbicaciones("Estacionamientos");
    });
}

function asignarComportamientoOcultarPuntos() {
    $("#ocultarGasolineras").on("click", function () {
        ocultarUbicaciones("Gasolineras");
    });
    $("#ocultarIncidentes").on("click", function () {
        ocultarUbicaciones("Incidentes");
    });
    $("#ocultarEstacionamientos").on("click", function () {
        ocultarUbicaciones("Estacionamientos");
    });
}

function inicializarUbicacionesIncidentes(puntosIncidentes) {
    ubicacionesIncidentes = [];
    var contadorPuntos = 0;

    $.each(puntosIncidentes, function (key, value) {

        var coordenada = value.geometry.coordinates;
        var descripcion = value.description;

        listaIncidentes.push(descripcion);

        var indice = 0;
        var latitudTemporal = null;
        var longitudTemporal = null;
        $.each(coordenada, function (key, value) {
            if (indice == 0)
                longitudTemporal = value;
            else
                latitudTemporal = value;

            indice++;
        });

        ubicacionesIncidentes.push({ titulo: descripcion, ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        contadorPuntos++;
    });
}

function inicializarUbicacionesGasolineras(puntosGasolinera) {
    ubicacionesGasolineras = [];
    var contadorPuntos = 0;

    $.each(puntosGasolinera, function (key, value) {
        
        var coordenada = value.geometry.coordinates;

        var indice = 0;
        var latitudTemporal = null;
        var longitudTemporal = null;
        $.each(coordenada, function (key, value) {
            if (indice == 0)
                longitudTemporal = value;
            else
                latitudTemporal = value;

            indice++;
        });
        
        ubicacionesGasolineras.push({ titulo: "Gasolinera", ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        contadorPuntos++;
    });
}

function inicializarUbicacionesEstacionamientos(puntosEstacionamiento) {
    ubicacionesEstacionamientos = [];
    var contadorPuntos = 0;

    $.each(puntosEstacionamiento, function (key, value) {

        var coordenada = value.geometry.coordinates;

        var indice = 0;
        var latitudTemporal = null;
        var longitudTemporal = null;
        $.each(coordenada, function (key, value) {
            if (indice == 0)
                longitudTemporal = value;
            else
                latitudTemporal = value;

            indice++;
        });

        ubicacionesEstacionamientos.push({ titulo: "Estacionamiento", ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        contadorPuntos++;
    });
}

function inicializarUbicaciones(coordenadas) {
    ubicaciones = [];
    var contadorPuntos = 0;
    $.each(coordenadas, function (key, value) {
        var coordenada = value;
        var indice = 0;
        var latitudTemporal = null;
        var longitudTemporal = null;
        $.each(coordenada, function (key, value) {
            if (indice == 0)
                longitudTemporal = value;
            else
                latitudTemporal = value;

            indice++;
        });

        //console.log("{ titulo: 'Punto " + contadorPuntos + "', ubicacion: { lat: " + latitudTemporal + ", lng: " + longitudTemporal + " } }");

        ubicaciones.push({ titulo: "Punto " + contadorPuntos, ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        contadorPuntos++;
    });

}

function pruebasAPISinTrafico() {
    var parameters = {
        'key': '03db794691de5576fb99e405115350ca0388e9b6a07b25af123a02d78e579bd6',
        'start': '19.385994,-99.192323',
        'end': '19.458232,-99.113169',
        'poi_in[]': [0,1,2,3,4]
    };
    $.getJSON('http://api.sintrafico.com/route', parameters)
        .done(function (data, textStatus, jqXHR) {

            inicializarUbicacionesGasolineras(data.routes[0].pois.gas_stations);
            inicializarUbicacionesIncidentes(data.routes[0].pois.incidents);
            inicializarUbicacionesEstacionamientos(data.routes[0].pois.parkings);

            crearMarcadoresUbicaciones(ubicacionesGasolineras,"Gasolineras");
            crearMarcadoresUbicaciones(ubicacionesIncidentes, "Incidentes");
            crearMarcadoresUbicaciones(ubicacionesEstacionamientos, "Estacionamientos");

            asignarComportamientoMostrarPuntos();
            asignarComportamientoOcultarPuntos();

            //MostrarMensajeAlertasIncidentes();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert('Error ' + jqXHR.status);
        });
    
}

function comportamientoCbGeneral(nombreCheckBox,tipoMarcadores) {
    $('#' + nombreCheckBox).prop("checked", true);
    $('#' + nombreCheckBox).change(function () {
        if ($(this).prop("checked")) 
            mostrarUbicaciones(tipoMarcadores);
        else 
            ocultarUbicaciones(tipoMarcadores);
    });
}

function comportamientoCbNormal(tipoMarcador) {
    comportamientoCbGeneral("cb" + tipoMarcador, tipoMarcador);
}

function comportamientoCbIncidentes() {
    comportamientoCbNormal("Incidentes");
}

function comportamientoCbGasolineras() {
    comportamientoCbNormal("Gasolineras");
}

function comportamientoCbEstacionamientos() {
    comportamientoCbNormal("Estacionamientos");
}

function comportamientosCheckBox() {
    comportamientoCbGasolineras();
    comportamientoCbIncidentes();
    comportamientoCbEstacionamientos();
}

function ObtenerListadoIncidentes() {
    var listadoIncidentes = [];//"";
    $.each(listaIncidentes, function (key, val) {
        listadoIncidentes.push(val);
    });
    return listadoIncidentes.join("<br>");;
}

var audioElement = document.createElement('audio');
audioElement.setAttribute('src', 'http://www.soundjay.com/misc/sounds/bell-ringing-01.mp3');

function DetenerSonido() {
    audioElement.pause();
}

function ReproducirSonido() {
    audioElement.play();
}

function MostrarMensajeAlertasIncidentes() {
    ReproducirSonido();
    swal({
        title: 'Incidentes en la ruta',
        text: "Tome precauciones sobre los siguientes incidentes \n" + ObtenerListadoIncidentes(),
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Entendido'
        //,
        //cancelButtonText: 'Cancelar'
    }).then((result) => {
        DetenerSonido();
    });
}

function mostrarMensajeIncidentes() {
    $("#mostrarMensajeIncidentes").on("click", function () {
        MostrarMensajeAlertasIncidentes();
    });
}

var listaIncidentes = [];//"";

$(document).ready(function () {
    pruebasAPISinTrafico();
    comportamientosCheckBox();
    mostrarMensajeIncidentes();
});
