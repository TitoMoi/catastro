import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { Bico } from '../models/consulta-rc';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private sheet!: ExcelJS.Worksheet;
  constructor() {}

  private createWorkbook(): ExcelJS.Workbook {
    return new ExcelJS.Workbook();
  }

  private setInitialProperties(workbook: ExcelJS.Workbook) {
    workbook.creator = 'Moisés Medina';
    workbook.lastModifiedBy = 'Moisés Medina';
    workbook.created = new Date(Date.now());
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(Date.now());
    return workbook;
  }

  private setInitialViews(workbook: ExcelJS.Workbook) {
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: 'visible',
      },
    ];
    return workbook;
  }

  private addSheet(workbook: ExcelJS.Workbook): ExcelJS.Worksheet {
    return workbook.addWorksheet('Hoja1');
  }

  private addSheetA4AndPortrait(workbook: ExcelJS.Workbook): ExcelJS.Worksheet {
    // create new sheet with pageSetup settings for A4 - landscape
    const worksheet = workbook.addWorksheet('Hoja1', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });
    return worksheet;
  }

  private addBicosToSheet(bicos: Bico[]) {
    for (let i = 0; i < bicos.length; i++) {
      const row = this.sheet.addRow({});
      const cell = row.getCell(1);
      cell.value = bicos[i].bi.ldt;
    }
  }

  /**
   * dark blue foreground with white text
   */
  private addHeaderModel1() {
    const firstRow = this.sheet.addRow({});
    const cell = firstRow.getCell(1);
    cell.value = 'TERRITORI';
    cell.style = {
      font: {
        size: 24,
        bold: true,
        color: { argb: 'FFFFFFFF' },
        name: 'arial',
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0b5394' },
      },
      alignment: {
        horizontal: 'center',
      },
    };
  }

  mergeCells(from: string, to: string) {
    this.sheet.mergeCells(from + ':' + to);
  }

  autoSizeColumnWidth() {
    this.sheet.columns.forEach((column) => {
      const lengths = column.values!.map((v) => v!.toString().length);
      const maxLength = Math.max(
        ...lengths.filter((v) => typeof v === 'number')
      );
      column.width = maxLength;
    });
  }

  writeBufferToFile(workbook: ExcelJS.Workbook) {
    workbook.xlsx.writeBuffer().then((file) => {
      let blob = new Blob([file], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const anchor = document.createElement('a');
      const url = URL.createObjectURL(blob);
      anchor.href = url;
      anchor.download = 'catastro' + '.xlsx';
      anchor.click();
    });
  }
  splitBicos(bicos: Bico[]) {
    const splitedBicos: any[] = bicos.map((bico) => {
      return bico.bi.ldt.split(' ');
    });
    console.log(splitedBicos);
  }
  filterBicos(bicos: Bico[], provincia: string, municipio: string) {
    //remove bloque, planta, escalera, puerta
    bicos.forEach((bico) => {
      let ldt = bico.bi.ldt;
      ldt = ldt.replace(/Pl:[0-9]*/, ''); //planta eliminar
      ldt = ldt.replace(/Es:[0-9]*/, ''); //escalera eliminar
      ldt = ldt.replace(/Bl:[0-9a-zA-Z]*/, ''); //bloque eliminar
      ldt = ldt.replace(/\d{5}/, ''); //código postal
      ldt = ldt.replace(provincia, ''); //provincia eliminar
      ldt = ldt.replace(municipio, ''); //municipio eliminar
      ldt = ldt.replace(/  +/g, ''); //espacios en blanco eliminar
      ldt = ldt.replace(/Pt:/, ' Puerta:'); //puerta solo sustituir literal
      ldt = ldt.replace(/[()]+/g, ''); //parentesis
      bico.bi.ldt = ldt;
    });
  }
  /**
   *
   * @param bicos the array of bicos to add in the model1
   */
  createModel1(bicos: Bico[], provincia: string, municipio: string) {
    const newbicos = [...bicos];
    this.filterBicos(newbicos, provincia, municipio);
    //const splitBicos = this.splitBicos(bicos);

    let workbook = this.createWorkbook();

    workbook = this.setInitialProperties(workbook);

    workbook = this.setInitialViews(workbook);

    this.sheet = this.addSheetA4AndPortrait(workbook);
    this.addHeaderModel1();
    this.addBicosToSheet(newbicos);
    this.autoSizeColumnWidth();
    this.mergeCells('A1', 'B1');

    this.writeBufferToFile(workbook);
  }
}
