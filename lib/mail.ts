import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import { activationTemplate } from "@/emails/activation";
import { resetPasswordTemplate } from "@/emails/resetPass";
import { collaborationTemplate } from "@/emails/collaboration";

export async function  sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMPT_EMAIL } = process.env;
  
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
    secure: false
  })

  try {
    await transport.verify();
   
  } catch (e) {
    console.log(e);
  }
  try {
    const sendResult = await transport.sendMail({
      from: SMPT_EMAIL,
      to,
      subject,
      html: body,
      
    });
    return sendResult;
  } catch (e) {
    console.log(e);
  }
}

export function compileActivationTemplate(name: string, url: string) {
  const template = Handlebars.compile(activationTemplate);
  const htmlBody = template({
    name,
    url,
  });
  return htmlBody;
}
export function compileResetPassTemplate(name: string, url: string) {
  const template = Handlebars.compile(resetPasswordTemplate);
  const htmlBody = template({
    name,
    url,
  });
  return htmlBody;
}


export function compileCollaborationTemplate(receiverName: string, url: string, senderName: string, senderEmail: string, senderImg: string) {
  const template = Handlebars.compile(collaborationTemplate);
  const htmlBody = template({
    receiverName,
    url,
    senderName,
    senderEmail,
    senderImg,
  });

  return htmlBody

}