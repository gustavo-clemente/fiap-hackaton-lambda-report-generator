import { generateReport } from "./src/generate-report.mjs";
import { sendEmail } from "./src/mail-sender.mjs";
import { getUserLastMonthlyReport } from "./src/report-adapter.mjs";


export const handler = async (event, context, cb) => {

    const requestBody = event.body ? JSON.parse(event.body) : {};

    const { userId, userEmail} = requestBody;

    if (!userId) {
        // Se userID não estiver presente, retorne um erro
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'userId não fornecido' }),
        };
    }

    if(!userEmail){
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'userEmail não fornecido' }),
        };
    }

    try {
        const reportData = await getUserLastMonthlyReport(userId)
        const csvStream = await generateReport(reportData)

        await sendEmail(userEmail, csvStream)
        return {
            statusCode: 200,
            body: 'Relatório gerado com sucesso',
        };
    }catch(error){
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocorreu um erro durante o processamento da solicitação' }),
        };
    }

};