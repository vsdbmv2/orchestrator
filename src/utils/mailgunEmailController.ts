import dotenv from "dotenv";
import Mailgun from "mailgun-js";

dotenv.config();

type mailgunEmailController = {
	sendEmail: (recipient: string, subject: string, body: string) => Promise<Mailgun.messages.SendResponse>;
};

export default {
	async sendEmail(recipient, subject, body) {
		const sender = "VSDBMv2 <postmaster@saga.bahia.fiocruz.br>";
		const api_key = process.env.MAILGUN_API_KEY as string;
		const mailgun = new Mailgun({ apiKey: api_key, domain: "saga.bahia.fiocruz.br" });
		const data = {
			//Specify email data
			from: sender,
			//The email to contact
			to: recipient,
			//Subject and text data
			subject: subject,
			html: body,
		};

		const resp = mailgun.messages().send(data, function (err, body) {
			if (err) {
				console.error("got an error: ", err);
				throw new Error("Error on send e-mail.");
			} else {
				return body;
			}
		});
		return resp;
	},
} as mailgunEmailController;
