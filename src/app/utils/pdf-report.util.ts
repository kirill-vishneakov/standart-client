import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

export function generateEmployeeReportPDF(report: any, periodLabel: string): void {
  if (!report || !report.employee) {
    console.error('Недостаточно данных для создания отчета.');
    return;
  }

  const servicesTableBody: Content[][] = [
    [
      { text: 'Услуга', style: 'tableHeader' },
      { text: 'Кол-во приёмов', style: 'tableHeader' },
      { text: 'Доход (₽)', style: 'tableHeader' }
    ],
    ...report.services.map((s: any) => [
      { text: s.name },
      { text: s.count.toString() },
      { text: s.income.toLocaleString() }
    ])
  ];

  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: 'Отчёт по сотруднику', style: 'header' },
      { text: `Сотрудник: ${report.employee.full_name}`, style: 'subheader' },
      { text: `Период: ${periodLabel}`, style: 'subheader' },
      { text: `Количество приёмов: ${report.totalAppointments}`, margin: [0, 10, 0, 0] },
      { text: `Общий доход: ${report.totalIncome.toLocaleString()} ₽`, margin: [0, 0, 0, 20] },
      {
        table: {
          widths: ['*', '*', '*'],
          body: servicesTableBody
        },
        layout: 'lightHorizontalLines'
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        margin: [0, 0, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    }
  };

  const printer = Object.assign({}, pdfMake, { vfs: pdfFonts.vfs });
  const fileName = `Отчёт_${report.employee.full_name.replace(/\s+/g, '_')}_${periodLabel}.pdf`;

  printer.createPdf(docDefinition).download(fileName);
}
