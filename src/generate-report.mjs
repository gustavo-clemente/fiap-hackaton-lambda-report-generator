import { stringify } from 'csv-stringify';

// Função principal para gerar o relatório
export const generateReport = (data) => {
    const reportRows = [];

    addTotalWorkedHoursRow(reportRows, data.workedHours);
    addReportHeadersRow(reportRows);
    addRecordsRows(reportRows, data.records);

    const csvStream = generateCSVStream(reportRows);

    return csvStream;
}

// Adicionar linha com o total de horas trabalhadas
const addTotalWorkedHoursRow = (reportRows, workedHours) => {
    reportRows.push(['Total de horas trabalhadas:', workedHours]);
}

// Adicionar cabeçalhos dos apontamentos
const addReportHeadersRow = (reportRows) => {
    reportRows.push(['Data', 'Entrada1', 'Saida1', 'Entrada2', 'Saída2']);
}

// Adicionar os registros de entrada e saída
const addRecordsRows = (reportRows, records) => {
    const recordsByDate = groupRecordsByDate(records);
    for (const date in recordsByDate) {
        const recordsOnDate = recordsByDate[date];
        const [entry1, exit1, entry2, exit2] = getEntryExitTimes(recordsOnDate);
        reportRows.push([date, entry1, exit1, entry2, exit2]);
    }
}

// Agrupar registros por data
const groupRecordsByDate = (records) => {
    const recordsByDate = {};
    records.forEach(record => {
        const date = formatDate(new Date(record.entry)).split(' ')[0]; // Somente a data, sem o horário
        if (!recordsByDate[date]) {
            recordsByDate[date] = [];
        }
        recordsByDate[date].push(record);
    });
    return recordsByDate;
}

// Obter os tempos de entrada e saída de cada registro
const getEntryExitTimes = (records) => {
    const entryTimes = [];
    const exitTimes = [];
    records.forEach(record => {
        entryTimes.push(record.entry ? formatDate(new Date(record.entry)).split(' ')[1] : '-');
        exitTimes.push(record.exit ? formatDate(new Date(record.exit)).split(' ')[1] : '-');
    });
    return [entryTimes[0], exitTimes[0], entryTimes[1] ?? '-', exitTimes[1] ?? '-'];
}

// Função para formatar a data
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Gerar o CSV a partir das linhas do relatório
const generateCSVStream = (reportRows) => {
    const stringifier = stringify();

    // Catch any error
    stringifier.on('error', function(err){
        console.error(err.message);
    });

    // When finished, do something with the CSV data
    stringifier.on('finish', function(){
        console.log('Geração do CSV finalizada');
    });

    // Write records to the stream
    reportRows.forEach(row => stringifier.write(row));

    const csvStream = stringifier.read();
    stringifier.end();

    return csvStream;
}
