import { MailtrapClient } from "mailtrap"
import 'dotenv/config'


export const sendEmail = async (recipient_email, reportCsvStream) => {

    const TOKEN = process.env.EMAIL_TOKEN;
    const ENDPOINT = "https://send.api.mailtrap.io/";
    
    const SENDER_EMAIL = process.env.SENDER_EMAIL

    const client = new MailtrapClient(
        {
            endpoint: ENDPOINT,
            token: TOKEN
        }
    )

    const sender = { name: "Relatório de ponto", email: SENDER_EMAIL }

    try {
        await client.send({
            from: sender,
            to: [{ email: recipient_email }],
            subject: 'Relatório de ponto',
            text: 'Prezado(a) Colaborador(a), segue em anexo seu relatório de ponto do último mês',
            attachments: [
                {
                    filename: "relatorio.csv",
                    content_id: "relatorio.csv",
                    disposition: "inline",
                    content: reportCsvStream,
                },
            ],
        });
        console.log("Email enviado com sucesso");
    } catch (error) {
        console.error("Erro ao enviar o email:", error);
        throw error; // Lança o erro para que seja tratado externamente
    }
}