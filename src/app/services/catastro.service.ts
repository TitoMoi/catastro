import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Observable, of } from 'rxjs';
import {
  ConsultaMunicipiero,
  ConsultaMunicipieroResponse,
  Muni,
} from '../models/consulta-municipio.interface';
import {
  ConsultaProvinciero,
  ConsultaProvincieroResponse,
  Prov,
} from '../models/consulta-provincia.interface';

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
export class CatastroService {
  provinciaWsUrl: string;
  municipioWsUrl: string;
  viaWsUrl: string;
  numeroWsUrl: string;

  provincias$: Observable<Prov[]>;
  municipios$: Observable<Muni[]>;

  constructor(private httpClient: HttpClient) {
    this.provinciaWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaProvincia';

    this.municipioWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaMunicipio';

    this.viaWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaVia';
    this.numeroWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaNumero';

    this.provincias$ = new Observable<Prov[]>();
    this.municipios$ = new Observable<Muni[]>();
  }

  getProvincias(): void {
    this.httpClient
      .get(this.provinciaWsUrl, { responseType: 'text' })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const consultaProvincieroResponse: ConsultaProvincieroResponse =
          xmlParser.parse(data);
        this.provincias$ = of(
          consultaProvincieroResponse.consulta_provinciero.provinciero.prov
        );
      });
  }

  /**
   *
   * @param prov the name of the province
   * @param muni optional the name of the municipio
   */
  getMunicipios(prov: string, muni = '') {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('Provincia', prov);
    httpParams = httpParams.set('Municipio', muni);
    this.httpClient
      .get(this.municipioWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const consultaMunicipieroResponse: ConsultaMunicipieroResponse =
          xmlParser.parse(data);
        console.log(consultaMunicipieroResponse);
        this.municipios$ = of(
          consultaMunicipieroResponse.consulta_municipiero.municipiero.muni
        );
      });
  }

  /**
   *
   * @param codProv the code of the province
   * @param codMuni optional the code of the municipio
   * @param filtro optional the string to filter
   */
  postMunicipios(codProv: string, codMuni = '', filtro = '') {
    this.httpClient
      .post(
        this.municipioWsUrl,
        {
          /* filtro, */
          provincia: codProv,
          municipio: codMuni,
        },
        { responseType: 'text' }
      )
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  getVias(prov: string, muni: string, via = '') {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('Provincia', prov);
    httpParams = httpParams.set('Municipio', muni);
    httpParams = httpParams.set('Via', via);
    this.httpClient
      .get(this.viaWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  getNumero(prov: string, muni: string, via: string, num = '0') {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('Provincia', prov);
    httpParams = httpParams.set('Municipio', muni);
    httpParams = httpParams.set('Via', via);
    httpParams = httpParams.set('Numero', num);
    this.httpClient
      .get(this.numeroWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const json = xmlParser.parse(data);
        console.log(json);
      });
  }

  getRefCatastral() {}
}
