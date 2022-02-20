import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as fastxmlparser from 'fast-xml-parser';

@Injectable({
  providedIn: 'root',
})
export class CatastroService {
  provinciaUrl: string;
  constructor(private httpClient: HttpClient) {
    this.provinciaUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaProvincia';
  }

  getProvincias() {
    //const headers = new HttpHeaders();
    //headers.set('Cookie', 'TS01da3df4=01737a9c024fcf723d3a1a56f703a9e99afc9101eab3c8176d50b8f3226e376542b0d588b8274083b66951107b737d9b532456ed43')

    this.httpClient
      .get(this.provinciaUrl, { responseType: 'text' })
      .subscribe((data: string) => {
        const xmlParser = new fastxmlparser.XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }
}
