import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Observable, of, Subject } from 'rxjs';
import {
  ConsultaMunicipieroResponse,
  Muni,
} from '../models/consulta-municipio.interface';
import {
  ConsultaProvincieroResponse,
  Prov,
} from '../models/consulta-provincia.interface';
import {
  Calle,
  ConsultaCalleResponse,
} from '../models/consulta-calle.interface';
import {
  ConsultaNumeroResponse,
  Nump,
} from '../models/consulta-numero.interface';

//Definiciones XML
/* https://www.catastro.meh.es/ws/esquemas/esquemas.htm */

//Pdf guía
/* https://www.catastro.meh.es/ws/Webservices_Libres.pdf */

//Interfaces generadas con:
/* https://jsonformatter.org/xml-to-typescript */

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

  municipios: Muni[];
  calles: Calle[];
  _numeros: Nump[];
  numeros$: Subject<Nump[]>;

  _provincias: Prov[];
  provincias$: Subject<Prov[]>;

  errNumeros: boolean;

  get provincias() {
    return this._provincias;
  }

  set provincias(provincias: Prov[]) {
    this._provincias = provincias; // Set the new value
    this.provincias$.next(provincias); // Trigger the subject, which triggers the Observable
  }

  get numeros() {
    return this._numeros;
  }

  set numeros(numeros: Nump[]) {
    this._numeros = numeros; // Set the new value
    this.numeros$.next(numeros); // Trigger the subject, which triggers the Observable
  }

  constructor(private httpClient: HttpClient) {
    this.provinciaWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaProvincia';

    this.municipioWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaMunicipio';

    this.viaWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaVia';
    this.numeroWsUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaNumero';

    this._provincias = [];
    this.municipios = [];
    this.calles = [];
    this._numeros = [];

    this.provincias$ = new Subject<Prov[]>();
    this.numeros$ = new Subject<Nump[]>();

    this.errNumeros = false;
  }

  getProvincias(): void {
    this.httpClient
      .get(this.provinciaWsUrl, { responseType: 'text' })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const consultaProvincieroResponse: ConsultaProvincieroResponse =
          xmlParser.parse(data);
        this.provincias =
          consultaProvincieroResponse.consulta_provinciero.provinciero.prov;
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
        this.municipios =
          consultaMunicipieroResponse.consulta_municipiero.municipiero.muni;
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
      });
  }

  getVias(prov: string, muni: string, tipoVia = '', nomVia = '') {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('Provincia', prov);
    httpParams = httpParams.set('Municipio', muni);
    httpParams = httpParams.set('TipoVia', tipoVia);
    httpParams = httpParams.set('NombreVia', nomVia);
    this.httpClient
      .get(this.viaWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const consultaCalleResponse: ConsultaCalleResponse =
          xmlParser.parse(data);
        this.calles = consultaCalleResponse.consulta_callejero.callejero.calle;
      });
  }

  getNumero(
    prov: string,
    muni: string,
    tipoVia = '',
    nomVia: string,
    num = '0'
  ) {
    this.errNumeros = false; //reset

    let httpParams = new HttpParams();
    httpParams = httpParams.set('Provincia', prov);
    httpParams = httpParams.set('Municipio', muni);
    httpParams = httpParams.set('TipoVia', tipoVia);
    httpParams = httpParams.set('NomVia', nomVia);
    httpParams = httpParams.set('Numero', num);
    this.httpClient
      .get(this.numeroWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const consultaNumeroResponse: ConsultaNumeroResponse =
          xmlParser.parse(data);
        const control = consultaNumeroResponse.consulta_numerero.control;
        if (control.cuerr) {
          if (control.cunum) {
            //Has proximity values
            //filter by number
            console.log(
              'catastroService proximity',
              consultaNumeroResponse.consulta_numerero.numerero.nump
            );
            const _nump =
              consultaNumeroResponse.consulta_numerero.numerero.nump.filter(
                (nump) => nump.num.pnp > num
              );

            this.numeros = [...this.numeros, ..._nump];
          } else {
            this.errNumeros = true;
          }
        } else {
          //filter by number
          console.log(
            'catastroService no error',
            consultaNumeroResponse.consulta_numerero.numerero.nump
          );
          let _nump = consultaNumeroResponse.consulta_numerero.numerero.nump;
          if (Array.isArray(_nump)) {
            _nump =
              consultaNumeroResponse.consulta_numerero.numerero.nump.filter(
                (nump) => nump.num.pnp > num
              );
            this.numeros = [...this.numeros, ..._nump];
          } else {
            this.numeros = [...this.numeros, _nump];
          }
        }
      });
  }

  getRefCatastral() {}
}
