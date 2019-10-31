import mailgun from 'mailgun.js';

export class MailgunDelivery {

  static createClient() {
    return mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
  }

  static async send(email: string, html: string) {
    const data = {
      from: "Digestif <photos@digest.photos>",
      to: [email],
      subject: "A new photo digest",
      text: "Sorry we have no text available.",
      html: html
    };
    const domain = 'mg.digest.photos';
    return await MailgunDelivery.createClient().messages.create(domain, data)
  }
}
