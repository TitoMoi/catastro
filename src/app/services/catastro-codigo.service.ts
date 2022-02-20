import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';

//Definiciones XML
/* https://www.catastro.meh.es/ws/esquemas/esquemas.htm */

//Pdf guía
/* https://www.catastro.meh.es/ws/Webservices_Libres.pdf */

//Ejemplos de ejecución sin código (datos son diferentes)
/* http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx */

//Ejemplos de ejecución por código
/* http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx */

//const headers = new HttpHeaders();
//headers.set('Cookie', 'TS01da3df4=01737a9c024fcf723d3a1a56f703a9e99afc9101eab3c8176d50b8f3226e376542b0d588b8274083b66951107b737d9b532456ed43')

@Injectable({
  providedIn: 'root',
})
export class CatastroCodigoService {
  provinciaWsUrl: string;
  //codigos
  municipioCodigoWsUrl: string;
  viaCodigoWsUrl: string;
  numeroCodigoWsUrl: string;

  constructor(private httpClient: HttpClient) {
    this.provinciaWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaProvincia';

    //codigos
    this.municipioCodigoWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/ConsultaMunicipioCodigos';

    this.viaCodigoWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/ConsultaViaCodigos';
    this.numeroCodigoWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/ConsultaNumeroCodigos';
  }

  getProvincias() {
    this.httpClient
      .get(this.provinciaWsUrl, { responseType: 'text' })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  /**
   *
   * @param codProv código cpine de la provincia.
   */
  getMunicipiosCodigo(codProv: string, codMuni = '', codMuniIne = '') {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('CodigoProvincia', codProv);
    httpParams = httpParams.set('CodigoMunicipio', codMuni);
    httpParams = httpParams.set('CodigoMunicipioIne', codMuniIne);
    this.httpClient
      .get(this.municipioCodigoWsUrl, {
        responseType: 'text',
        params: httpParams,
      })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  getViasCodigo(
    codProv: string,
    codMuni: string,
    codMuniIne = '',
    codVia = ''
  ) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('CodigoProvincia', codProv);
    httpParams = httpParams.set('CodigoMunicipio', codMuni);
    httpParams = httpParams.set('CodigoMunicipioINE', codMuniIne);
    httpParams = httpParams.set('CodigoVia', codVia);
    this.httpClient
      .get(this.viaCodigoWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  getNumeroCodigo(
    codProv: string,
    codMuni: string,
    codMuniIne = '',
    codVia: string,
    codNum = '0'
  ) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('CodigoProvincia', codProv);
    httpParams = httpParams.set('CodigoMunicipio', codMuni);
    httpParams = httpParams.set('CodigoMunicipioINE', codMuniIne);
    httpParams = httpParams.set('CodigoVia', codVia);
    httpParams = httpParams.set('Numero', codNum);
    this.httpClient
      .get(this.numeroCodigoWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  getRefCatastral() {}
}
