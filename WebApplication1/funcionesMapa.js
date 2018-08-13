var map;
var marcadores = [];

var marcadoresGasolineras = [];
var marcadoresIncidentes = [];
var marcadoresEstacionamientos = [];
var marcadoresCasetas = [];

var ventanaInformacionGrande;
var limites;
var markerImage;
var defaultIcon;
var highlightedIcon;

var ubicaciones = [];

var ubicacionesGasolineras = [];

var ubicacionesIncidentes = [];

var ubicacionesEstacionamientos = [];

var ubicacionesCasetas = [];

var marcadorTemporal;

var audioElement = document.createElement('audio');
audioElement.setAttribute('src', 'http://www.soundjay.com/misc/sounds/bell-ringing-01.mp3');

var listaIncidentes = [];

function inicializarMapa() {
    ventanaInformacionGrande = new google.maps.InfoWindow();
    limites = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            //lat: 19.385994, lng: -99.192323
            lat: 18.325847765727083, lng: -100.28594970703125
            //'start': '18.325847765727083,-100.28594970703125',
        },
        zoom: 13,
        mapTypeControl: false
    });

}

function crearMarcadoresUbicaciones(ubicaciones, tipoMarcador) {

    var marcadores = [];

    for (var indice = 0; indice < ubicaciones.length; indice++) {
        var pocision = ubicaciones[indice].ubicacion;
        var titulo = ubicaciones[indice].titulo;
        var marcador = crearMarcador(pocision, titulo, indice, tipoMarcador);

        marcadores.push(marcador);

        marcador.addListener('click', function () {
            crearVentanaInformacion(this, ventanaInformacionGrande);
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
    else if (tipoMarcador == "Casetas")
        marcadoresCasetas = marcadores;
}

function obtenerIconoDelMarcador(tipoMarcador) {
    var icono = "Imagenes/";
    if (tipoMarcador == "Gasolineras")
        icono += 'gasolinera.png';
    else if (tipoMarcador == "Incidentes")
        icono += 'incidente.png';
    else if (tipoMarcador == "Estacionamientos")
        icono += 'estacionamiento.png';
    else if (tipoMarcador == "Casetas")
        icono += 'caseta.png';

    return icono;
}

function crearMarcador(punto, texto, numeroIdentificador, tipoMarcador) {

    var icono = obtenerIconoDelMarcador(tipoMarcador);

    return new google.maps.Marker({
        map: map,
        position: punto,
        title: texto,
        animation: google.maps.Animation.DROP,
        id: numeroIdentificador
        , label: { text: texto, color: "black", fontWeight: "bold" }
        , icon: icono
    });
}

function crearVentanaInformacion(marcador, ventanaInformacion) {

    if (ventanaInformacion.marker != marcador) {
        marcadorTemporal = marcador;

        ventanaInformacion.marker = marcador;
        ventanaInformacion.setContent('');

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

function ObtenerTipoMarcadores(tipoMarcador) {
    if (tipoMarcador == "Gasolineras")
        marcadores = marcadoresGasolineras;
    else if (tipoMarcador == "Incidentes")
        marcadores = marcadoresIncidentes;
    else if (tipoMarcador == "Estacionamientos")
        marcadores = marcadoresEstacionamientos;
    else if (tipoMarcador == "Casetas")
        marcadores = marcadoresCasetas;
    return marcadores;
}

function mostrarUbicaciones(tipoMarcador) {

    marcadores = ObtenerTipoMarcadores(tipoMarcador);

    limites = new google.maps.LatLngBounds();

    for (var indice = 0; indice < marcadores.length; indice++)
        extenderLimitesPorMarcador(indice);

    //map.fitBounds(limites);
}

function ocultarUbicaciones(tipoMarcador) {

    marcadores = ObtenerTipoMarcadores(tipoMarcador);

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
    $("#mostrarCasetas").on("click", function () {
        mostrarUbicaciones("Casetas");
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
    $("#ocultarCasetas").on("click", function () {
        ocultarUbicaciones("Casetas");
    });
}

var listaDescripcionesIncidentes = [];
var listaDireccionesIncidentes = [];
var listadoIncidentesInfo = [];
var listadoCoordenadasIncidentes = [];

function ObtenerListadoIncidentesInfo() {
    listadoIncidentesInfo = [];
    var contador = 0;
    $.each(listaDescripcionesIncidentes, function (key, value) {
        //console.log("Incidente " + value + " - Direccion " + listaDireccionesIncidentes[contador]);
        //"Incidente " + 
        listadoIncidentesInfo.push(value);//+ " - Direccion " + listaDireccionesIncidentes[contador] );
        contador++;
    });
    return listadoIncidentesInfo.join("");
}

var listadoIncidentesParaSeleccionar = [];
var listadoDireccionesIncidentesParaSeleccionar = [];

var listadoCoordenadasIncidentesParaSeleccionar = [];

function DibujarTablaListadoIncidentes() {
    var contenidoTablaListadoIncidentes = [];

    var contador = 0;

    $.each(listadoIncidentesInfo, function (key, value) {
        var infoIncidente = value;

        var elementosIncidente = infoIncidente.split(":");


        contenidoTablaListadoIncidentes.push("<tr>");
        contenidoTablaListadoIncidentes.push(" <td>");
        contenidoTablaListadoIncidentes.push("     <table class='customersSub' >");
        contenidoTablaListadoIncidentes.push("         <tr>");
        contenidoTablaListadoIncidentes.push("             <td>");
        //contenidoTablaListadoIncidentes.push("                 <input type='checkbox' name='Incidentes' value='" + elementosIncidente[1] + "'>");
        contenidoTablaListadoIncidentes.push("                 <input type='checkbox' class='cbIncidentes' name='Incidentes' value='" + contador + "'>");
        contenidoTablaListadoIncidentes.push("             </td>");
        contenidoTablaListadoIncidentes.push("             <td>");
        contenidoTablaListadoIncidentes.push("                 <b>");

        listadoIncidentesParaSeleccionar.push(elementosIncidente[1]);

        contenidoTablaListadoIncidentes.push(elementosIncidente[1]);
        contenidoTablaListadoIncidentes.push("                 </b>");
        contenidoTablaListadoIncidentes.push("             </td>");
        contenidoTablaListadoIncidentes.push("         </tr>");
        contenidoTablaListadoIncidentes.push("     </table>");
        contenidoTablaListadoIncidentes.push("</td>");
        contenidoTablaListadoIncidentes.push("</tr>");
        contenidoTablaListadoIncidentes.push("<tr>");
        contenidoTablaListadoIncidentes.push("<td>");

        listadoDireccionesIncidentesParaSeleccionar.push(elementosIncidente[0]);

        contenidoTablaListadoIncidentes.push(elementosIncidente[0]);
        contenidoTablaListadoIncidentes.push("</td>");
        contenidoTablaListadoIncidentes.push("</tr>");
        contenidoTablaListadoIncidentes.push("<tr>");
        contenidoTablaListadoIncidentes.push("<td>");
        contenidoTablaListadoIncidentes.push("</td>");
        contenidoTablaListadoIncidentes.push("</tr>");

        contador++;
    });

    $("#tablaListadoIncidentes").html(contenidoTablaListadoIncidentes.join(""));
}

function inicializarUbicacionesIncidentes(puntosIncidentes) {
    ubicacionesIncidentes = [];
    var contadorPuntos = 0;

    $.each(puntosIncidentes, function (key, value) {

        var coordenada = value.geometry.coordinates;
        var descripcion = value.description;
        var direccion = value.address;

        listaDescripcionesIncidentes.push(descripcion);
        listaDireccionesIncidentes.push(direccion);

        

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

        listadoCoordenadasIncidentes.push(latitudTemporal + ";" + longitudTemporal );

        var elementosIncidente = descripcion.split(":");
        //var tituloMostrar = elementosIncidente[0] + "\n" + elementosIncidente[1];
        var tituloMostrar = elementosIncidente[1];
        //tituloMostrar
        ubicacionesIncidentes.push({ titulo: " ", ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        //ubicacionesIncidentes.push({ titulo: tituloMostrar, ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        contadorPuntos++;
    });

    //console.log();
    ObtenerListadoIncidentesInfo();
    DibujarTablaListadoIncidentes();

}

function inicializarUbicacionesCasetas(puntosCaseta) {
    ubicacionesCasetas = [];
    var contadorPuntos = 0;

    $.each(puntosCaseta, function (key, value) {

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

        //console.log("longitudTemporal : " + longitudTemporal);
        //"Caseta"
        ubicacionesCasetas.push({ titulo: " ", ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        //ubicacionesCasetas.push({ titulo: value.address, ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
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
        //"Gasolinera"
        ubicacionesGasolineras.push({ titulo: " ", ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
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
        //"Estacionamiento"
        ubicacionesEstacionamientos.push({ titulo: " ", ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
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

        ubicaciones.push({ titulo: "Punto " + contadorPuntos, ubicacion: { lat: latitudTemporal, lng: longitudTemporal } });
        contadorPuntos++;
    });

}

function pruebasAPISinTrafico() {
    var parameters = {
        'key': '03db794691de5576fb99e405115350ca0388e9b6a07b25af123a02d78e579bd6',
        /*
         'start': '19.385994,-99.192323',
        'end': '19.458232,-99.113169',
         */
        'start': '18.325847765727083,-100.28594970703125',
        'end': '20.125576455270583,-98.1463623046875',
        /*
         18.325847765727083
        %2C
        -100.28594970703125
        %2C
        20.125576455270583
        %2C
        -98.1463623046875
         */

        'poi_in[]': [0, 1, 2, 3, 4]
    };
    $.getJSON('http://api.sintrafico.com/route', parameters)
        .done(function (data, textStatus, jqXHR) {

            //console.log(JSON.stringify(data));

            inicializarUbicacionesCasetas(data.routes[0].pois.tolls);
            inicializarUbicacionesGasolineras(data.routes[0].pois.gas_stations);
            inicializarUbicacionesIncidentes(data.routes[0].pois.incidents);
            inicializarUbicacionesEstacionamientos(data.routes[0].pois.parkings);


            crearMarcadoresUbicaciones(ubicacionesCasetas, "Casetas");
            crearMarcadoresUbicaciones(ubicacionesGasolineras, "Gasolineras");
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

function comportamientoCbGeneral(nombreCheckBox, tipoMarcadores) {
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

function comportamientoCbCasetas() {
    comportamientoCbNormal("Casetas");
}

function comportamientoCbEstacionamientos() {
    comportamientoCbNormal("Estacionamientos");
}

function comportamientosCheckBox() {
    comportamientoCbCasetas();
    comportamientoCbGasolineras();
    comportamientoCbIncidentes();
    comportamientoCbEstacionamientos();
}

function ObtenerListadoIncidentes() {
    var listadoIncidentes = [];
    $.each(listaIncidentes, function (key, val) {
        listadoIncidentes.push(val);
    });
    return listadoIncidentes.join("<br>");;
}

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
    }).then((result) => {
        DetenerSonido();
    });
}

function mostrarMensajeIncidentes() {
    $("#mostrarMensajeIncidentes").on("click", function () {
        MostrarMensajeAlertasIncidentes();
    });
}

var listadoCorreos = ["migana14@gmail.com", "msanchez@altotrack.com","fbaro@altotrack.com"];

var listadoDestinatarios = ["Miguel Angel Sánchez López", "ALTO Miguel Angel","ALTO Felipe Baró"];

function ObtenerCorreos() {
    var correos = [];
    /*
    correos.push("migana14@gmail.com");
    correos.push("msanchez@altotrack.com");
    */
    $.each(arregloDestinatariosSeleccionados, function (key, value) {
        correos.push(listadoCorreos[value]);
    });
    return correos;
}

function ObtenerDestinatarios() {
    var nombresDestinatarios = [];
    /*
    nombresDestinatarios.push("Miguel Angel Sánchez López");
    nombresDestinatarios.push("ALTO Miguel Angel");
    */
    $.each(arregloDestinatariosSeleccionados, function (key, value) {
        nombresDestinatarios.push(listadoDestinatarios[value]);
    });
    return nombresDestinatarios;
}

function ObtenerIncidentes() {
    var listaIncidentes = [];
    $.each(arregloIncidentesSeleccionados, function (key, value) {
        listaIncidentes.push(listadoIncidentesParaSeleccionar[value]);
        listadoCoordenadasIncidentesParaSeleccionar.push(listadoCoordenadasIncidentes[value]);
        //listaIncidentes.push("Enorme grieta a la altura de Acueducto con dirección a Circuito Interior.");
    });
    /*
    listaIncidentes.push("Enorme grieta a la altura de Acueducto con dirección a Circuito Interior.");
    listaIncidentes.push("Reducción de carriles por trabajos de construcción de Tren Interurbano a la altura de Contadero con dirección a La Marquesa.");
    */
    return listaIncidentes;
}

function ObtenerListaDireccionesIncidentes() {
    var listaDireccionesIncidentes = [];
    $.each(arregloIncidentesSeleccionados, function (key, value) {
        listaDireccionesIncidentes.push(listadoDireccionesIncidentesParaSeleccionar[value]);
        //listaIncidentes.push("Enorme grieta a la altura de Acueducto con dirección a Circuito Interior.");
    });
    /*
    listaDireccionesIncidentes.push("Avenida Constituyentes");
    listaDireccionesIncidentes.push("Autopista México - Toluca");
    */
    return listaDireccionesIncidentes;
}

function ObtenerObjetoIncidentesYDestinatariosJSON() {

    var correos = ObtenerCorreos();
    var nombresDestinatarios = ObtenerDestinatarios();
    var listaIncidentes = ObtenerIncidentes();
    var listaDireccionesIncidentes = ObtenerListaDireccionesIncidentes();

    correos = "['" + correos.join("','") + "']";
    nombresDestinatarios = "['" + nombresDestinatarios.join("','") + "']";
    listaIncidentes = "['" + listaIncidentes.join("','") + "']";
    listaDireccionesIncidentes = "['" + listaDireccionesIncidentes.join("','") + "']";

    listadoCoordenadasIncidentesParaSeleccionar = "['" + listadoCoordenadasIncidentesParaSeleccionar.join("','") + "']";

    var objetoIncidentesYDestinatariosJSON = {
        "Correos": correos,
        "NombresDestinatarios": nombresDestinatarios,
        "Incidentes": listaIncidentes,
        "DireccionesIncidentes": listaDireccionesIncidentes,
        "CoordenadasIncidentes": listadoCoordenadasIncidentesParaSeleccionar
    };

    console.log("objetoIncidentesYDestinatariosJSON : " + JSON.stringify(objetoIncidentesYDestinatariosJSON));

    return objetoIncidentesYDestinatariosJSON;
}

function notificarIncidentesSeleccionados() {

    $.ajax({

        url: 'EnvioCorreo.aspx',
        data: ObtenerObjetoIncidentesYDestinatariosJSON(),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json'
        /*
        ,
        success: function (respuesta) {
            
        },
        error: function () {
            swal({
                title: "No se han podido enviar las notificaciones",
                text: "",
                type: 'danger'
            });
        }
        */
    });
}

function limpiarSelecciones() {
    $(".cbDestinatarios").each(function () {
        $(this).prop("checked",false);
    });
    $(".cbIncidentes").each(function () {
        $(this).prop("checked", false);
    });
}

function notificarEnvioCorreos() {
    swal({
        title: "Se han enviado las notificaciones",
        text: "",
        type: 'success'
    });
}

function asignarComportamientoNotificarIncidentes() {
    $("#notificarIncidentes").on("click", function () {
        obtenerIncidentesSeleccionados();
        obtenerDestinatariosSeleccionados();
        notificarIncidentesSeleccionados();
        limpiarSelecciones();
        notificarEnvioCorreos();
    });
}

var arregloIncidentesSeleccionados = [];

function obtenerIncidentesSeleccionados() {
    arregloIncidentesSeleccionados=[];
    $(".cbIncidentes:checked").each(function () {
        arregloIncidentesSeleccionados.push($(this).val());
    });
    //console.log("arregloIncidentesSeleccionados: " + arregloIncidentesSeleccionados);
    if (arregloIncidentesSeleccionados.length <= 0) {
        alert("debe seleccionar al menos un incidente para notificar");
        throw ("debe seleccionar al menos un incidente para notificar");
    }
        
}

var arregloDestinatariosSeleccionados = [];

function obtenerDestinatariosSeleccionados() {
    arregloDestinatariosSeleccionados = [];
    $(".cbDestinatarios:checked").each(function () {
        arregloDestinatariosSeleccionados.push($(this).val());
    });
    //console.log("arregloDestinatariosSeleccionados: " + arregloDestinatariosSeleccionados);
    if (arregloIncidentesSeleccionados.length <= 0) {
        alert("debe seleccionar al menos un destinatario para notificar");
        throw ("debe seleccionar al menos un destinatario para notificar");
    }
        
}


$(document).ready(function () {
    pruebasAPISinTrafico();
    comportamientosCheckBox();
    mostrarMensajeIncidentes();
    asignarComportamientoNotificarIncidentes();
});
