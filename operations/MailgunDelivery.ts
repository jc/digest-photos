import mailgun from "mailgun.js";

export class MailgunDelivery {
  public static createClient() {
    return mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY
    });
  }

  public static async send(
    email: string,
    html: string,
    name: string,
    url: string
  ) {
    const data = {
      from: "Digestif <photos@digest.photos>",
      to: [email],
      subject: `A new photo digest from ${name}`,
      text: `Here are the latest photographs from ${name}, delivered in a handy digest. You can view all the photographs at ${url}`,
      html
    };
    const domain = "mg.digest.photos";
    return await MailgunDelivery.createClient().messages.create(domain, data);
  }
}
