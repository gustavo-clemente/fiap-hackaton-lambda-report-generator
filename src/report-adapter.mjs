import axios from "axios"

const apiUrl = process.env.REPORT_BASE_URL

export const getUserLastMonthlyReport = async (userId) => {
    console.log(`Iniciando busca do relatório na API na instância  - ${new Date().toISOString()}`);
    try {
        const response = await axios.get(`${apiUrl}/records/user/${userId}/reports/last-monthly`);

        console.log(`Finalizando busca do relatório na API na instância  - ${new Date().toISOString()}`);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao fazer requisição: ' + error);
    }
}

