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
      pageSetup: { paperSize: 9, orientation: 'portrait' },
    });
    return worksheet;
  }

  private addBicosToSheet(bicos: Bico[]) {
    for (let i = 0; i < bicos.length; i++) {
      /*  this.sheet.addRow({ ldt: bicos[i].bi.ldt }); */
      this.sheet.getRow(i).getCell(1).value = bicos[i].bi.ldt;
    }
  }

  /**
   *
   * @param bicos the array of bicos to add in the model1
   */
  createModel1(bicos: Bico[]) {
    let workbook = this.createWorkbook();

    workbook = this.setInitialProperties(workbook);

    workbook = this.setInitialViews(workbook);

    this.sheet = this.addSheetA4AndPortrait(workbook);

    this.addBicosToSheet(bicos);

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
}
