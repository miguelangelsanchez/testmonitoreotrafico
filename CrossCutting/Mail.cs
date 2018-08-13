using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Mail;
using System.Net;
using System.Configuration;

namespace CrossCutting
{
    public class Mail
    {
        public String DIRECCION_CORREO_FROM;
        public String ALIAS_CORREO_FROM;
        public String HOST_MAILS;
        public Boolean HABILITAR_SSL;
        public String USUARIO_CUENTA;
        public String PASSWORD_CUENTA;
        public int NUMERO_PUERTO;

        public Mail() {
            DIRECCION_CORREO_FROM = ConfigurationManager.AppSettings["DIRECCION_CORREO_FROM"].ToString();
            ALIAS_CORREO_FROM = ConfigurationManager.AppSettings["ALIAS_CORREO_FROM"].ToString();
            HOST_MAILS = ConfigurationManager.AppSettings["HOST_MAILS"].ToString();
            HABILITAR_SSL = Convert.ToBoolean(ConfigurationManager.AppSettings["HABILITAR_SSL"].ToString());
            USUARIO_CUENTA = ConfigurationManager.AppSettings["USUARIO_CUENTA"].ToString();
            PASSWORD_CUENTA = ConfigurationManager.AppSettings["PASSWORD_CUENTA"].ToString();
            NUMERO_PUERTO = Convert.ToInt32(ConfigurationManager.AppSettings["NUMERO_PUERTO"].ToString());
        }

        public  void SendMail(string mailDestinatarios, string asunto, string mensaje)
        {
            
            try
            {
                MailMessage correo = new MailMessage();

                string[] destinatarios = mailDestinatarios.Split(';');

                foreach (string word in destinatarios)
                    correo.To.Add(word);
                
                correo.From = new MailAddress(DIRECCION_CORREO_FROM, ALIAS_CORREO_FROM);

                correo.Subject = asunto;

                correo.Body = mensaje;
                correo.IsBodyHtml = true;

                correo.BodyEncoding = Encoding.UTF8;
                correo.Priority = MailPriority.High;
                
                SmtpClient smtp = new SmtpClient();
                
                smtp.Host = HOST_MAILS;
                smtp.EnableSsl = HABILITAR_SSL;
                smtp.Port = NUMERO_PUERTO;
                smtp.Timeout = 10000000;

                smtp.Credentials = new System.Net.NetworkCredential(USUARIO_CUENTA, PASSWORD_CUENTA);

                smtp.Send(correo);
                
                /*
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp-relay.gmail.com";
                smtp.EnableSsl = false;
                smtp.Port = 25;
                smtp.Timeout = 10000000;
                smtp.Send(correo);
                */
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            
        }

        public  void SendMailWithAttachment(string mailDestinatarios, string asunto, string mensaje, string attachmentName)
        {
            MailMessage correo = new MailMessage();

            Attachment attach = Attachment.CreateAttachmentFromString(mensaje, attachmentName);

            string[] destinatarios = mailDestinatarios.Split(';');

            foreach (string word in destinatarios)
                correo.To.Add(word);

            correo.From = new MailAddress(DIRECCION_CORREO_FROM, ALIAS_CORREO_FROM);

            correo.Subject = asunto;
            correo.Body = mensaje;
            correo.IsBodyHtml = true;
            correo.Attachments.Add(attach);
            correo.BodyEncoding = Encoding.UTF8;
            correo.Priority = MailPriority.High;
            SmtpClient smtp = new SmtpClient();

            smtp.Host = HOST_MAILS;
            smtp.EnableSsl = HABILITAR_SSL;
            smtp.Port = NUMERO_PUERTO;
            smtp.Timeout = 10000000;
            smtp.Credentials = new System.Net.NetworkCredential(USUARIO_CUENTA, PASSWORD_CUENTA);

            smtp.Send(correo);

        }

        public  void SendMailWithAttachmentV2(string mailDestinatarios, string asunto, string mensaje, string attachmentContent, string attachmentName)
        {
            MailMessage correo = new MailMessage();

            Attachment attach = Attachment.CreateAttachmentFromString(attachmentContent, attachmentName);

            string[] destinatarios = mailDestinatarios.Split(';');

            foreach (string word in destinatarios)
                correo.To.Add(word);

            correo.From = new MailAddress(DIRECCION_CORREO_FROM, ALIAS_CORREO_FROM);

            correo.Subject = asunto;
            correo.Body = mensaje;
            correo.IsBodyHtml = true;
            correo.Attachments.Add(attach);
            correo.BodyEncoding = Encoding.UTF8;
            correo.Priority = MailPriority.High;
            SmtpClient smtp = new SmtpClient();

            smtp.Host = HOST_MAILS;
            smtp.EnableSsl = HABILITAR_SSL;
            smtp.Port = NUMERO_PUERTO;
            smtp.Timeout = 10000000;
            smtp.Credentials = new System.Net.NetworkCredential(USUARIO_CUENTA, PASSWORD_CUENTA);

            smtp.Send(correo);

        }

    }
}
