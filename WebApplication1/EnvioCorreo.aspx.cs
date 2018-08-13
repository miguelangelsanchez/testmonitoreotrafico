using CrossCutting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication1
{
    public partial class EnvioCorreo : System.Web.UI.Page
    {
        public static int SEGUNDOS_ESPERA = 0;

        public static string ObtenerAsunto()
        {
            return ConfigurationManager.AppSettings["ASUNTO_CORREO"].ToString();
        }

        public static string ObtenerMailsDestinoPorNombreAlerta()
        {
            return string.Join(";", CorreosDestinatarios);
        }

        public static string ObtenerMailsDestino()
        {
            //obtener destinatarios consultando en la bd
            return ObtenerMailsDestinoPorNombreAlerta();
        }

        public static string ObtenerCuerpoCorreo()
        {
            StringBuilder cuerpoCorreo = new StringBuilder();
            
            cuerpoCorreo.Append("<b>Estimad@:</b>");
            cuerpoCorreo.Append("<br>&nbsp;");
            
            cuerpoCorreo.Append("Le solicitamos este al pendiente de los siguientes incidentes:");
            cuerpoCorreo.Append("&nbsp;<u></u><u></u></p>");
            cuerpoCorreo.Append("<p class='MsoNormal'><u></u>&nbsp;<u></u></p>");

            for (int indice=0;indice< DireccionesIncidentes.Count;indice++) {

                String coordenadasFormateadas = CoordenadasIncidentes[indice].ToString();
                coordenadasFormateadas = coordenadasFormateadas.Replace(";", ",");

                cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'>Incidente: <b>" + Incidentes[indice] + "</b><br>");
                cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'>Dirección: <b>" + DireccionesIncidentes[indice] + "</b><br>");
                /*
                cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'><b><a href='https://www.google.com/maps/@"+ coordenadasFormateadas + ",3a,73.7y,150.73h,120t/data=!3m6!1e1!3m4!1syUpzBs7HEIR-k6l7R7bq0A!2e0!7i13312!8i6656' target='_blank'>Vista de las calles</a></b><br>");
                //cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'><b><a href='https://www.google.com/maps/place/@"+ coordenadasFormateadas + ",17z/data=!3m1!4b1!4m5!3m4!1s0x85d207655ad327df:0x7a0f3a0b941e9102!8m2!3d19.3514235!4d-99.280171' target='_blank'>Vista del mapa</a></b><br>");
                cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'><b><a href='https://www.google.com/maps/place/@" + coordenadasFormateadas + ",17z/data=!3m1!4b1!4m5!3m4!1s0x85d207655ad327df:0x7a0f3a0b941e9102!8m2' target='_blank'>Vista del mapa</a></b><br>");
                */

                cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'><b><a href='https://www.google.com/maps/@?api=1&map_action=map&center=" + coordenadasFormateadas + "8&zoom=13' target='_blank'>Vista del mapa</a></b><br>");
                cuerpoCorreo.Append("<p class='MsoNormal' style='text-indent:35.4pt'><b><a href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + coordenadasFormateadas + "&heading=-65&pitch=5&fov=80' target='_blank'>Vista de las calles</a></b><br>");

                cuerpoCorreo.Append("<br>");
            }
            
            cuerpoCorreo.Append("&nbsp;Este correo fue enviado de forma automática. Por favor no responder.<u></u><u></u></p>");
            
            return cuerpoCorreo.ToString();
        }

        public static void EnviarCorreo(string destinatario, string asunto, string bodyConDatos)
        {
            Mail mail = new Mail();
            mail.SendMail(destinatario, asunto, bodyConDatos);
        }

        public static void EnviarCorreoYGuardarRegistro(string destinatario, string asunto, string body)
        {
            try
            {
                Console.WriteLine("enviando...");

                string bodyConDatos;
                
                bodyConDatos = body;

                EnviarCorreo(destinatario, asunto, bodyConDatos);

                //guardar listado de envio de correo en tabla que llevara el registro
                //controladorCorreoEnviado.InsertarCorreoEnviado(correoEnviadoTemporal);

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR EN EL ENVIO: " + ex.Message);
            }
        }
        
        public static bool VerificarExistenciaEntregas(int contadorEntregaRECHAZADA, int contadorEntregaOK)
        {
            return ((contadorEntregaRECHAZADA + contadorEntregaOK) > 0);
        }

       
        public static void IterarDestinatarios(string[] destinatarios,  string asunto, string body)
        {
            foreach (string destinatario in destinatarios)
                    EnviarCorreoYGuardarRegistro(destinatario, asunto, body);
        }
        
        public static void IterarRegistros( string asunto, string body, string mailsDestino)
        {
            string[] destinatarios = mailsDestino.Split(';');

            IterarDestinatarios(destinatarios,  asunto, body);
        }

        public List<String> obtenerPartesDatos(StreamReader reader) {
            var json = reader.ReadToEnd();

            var cadenaInicial = WebUtility.HtmlDecode(json);
            var cadenaDecodificada = HttpUtility.UrlDecode(cadenaInicial);

            List<String> partesDatos = new List<String>();
            partesDatos = cadenaDecodificada.Split('&').ToList<String>();

            return partesDatos;
        }

        public List<String> obtenerDatos(string partesDatos) {
            var pocision = partesDatos.IndexOf("[");
            var partes = partesDatos.Substring(pocision);

            partes = partes.Replace("[", "");
            partes = partes.Replace("]", "");
            partes = partes.Replace("'", "");

            return partes.Split(',').ToList<string>();
        }
        
        public static List<string> CorreosDestinatarios = new List<string>();
        public static List<string> NombresDestinatarios = new List<string>();
        public static List<string> Incidentes = new List<string>();
        public static List<string> DireccionesIncidentes = new List<string>();
        public static List<string> CoordenadasIncidentes = new List<string>();

        public const int INDICE_CORREOS_DESTINATARIOS = 0;
        public const int INDICE_NOMBRES_DESTINATARIOS = 1;
        public const int INDICE_INCIDENTES = 2;
        public const int INDICE_DIRECCIONES_INCIDENTES = 3;
        public const int INDICE_COORDENADAS_INCIDENTES = 4;

        protected void Page_Load(object sender, EventArgs e)
        {
            using (StreamReader reader = new StreamReader(Request.InputStream))
            {
                List<String> partesDatos = obtenerPartesDatos(reader);
                
                CorreosDestinatarios = obtenerDatos(partesDatos[INDICE_CORREOS_DESTINATARIOS]);

                NombresDestinatarios = obtenerDatos(partesDatos[INDICE_NOMBRES_DESTINATARIOS]);

                Incidentes = obtenerDatos(partesDatos[INDICE_INCIDENTES]);

                DireccionesIncidentes = obtenerDatos(partesDatos[INDICE_DIRECCIONES_INCIDENTES]);

                CoordenadasIncidentes = obtenerDatos(partesDatos[INDICE_COORDENADAS_INCIDENTES]);

                Console.WriteLine("Ejecutando consola de alertas de entrega ecommerce...");

                IterarRegistros(ObtenerAsunto(), ObtenerCuerpoCorreo(), ObtenerMailsDestino());

                Console.WriteLine("Terminando consola de alertas de entrega ecommerce...");
                
            }


            
        }
    }
}