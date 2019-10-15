import * as mailgun from 'mailgun.js';

export class MailgunDelivery {

  static createClient() {
    return mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
  }

  static send(html: string) {
    const data = {
      from: "Digestif <photos@digest.photos>",
      to: ["clarkeje@gmail.com"],
      subject: "A new photo Digest from James Clarke",
      text: "Sorry we have no text available.",
      html: html
    };
    const domain = 'mg.digest.photos';
    MailgunDelivery.createClient().messages.create(domain, data)
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err));
  }
}

