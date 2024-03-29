import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Subject } from 'rxjs';
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
import { Bico, ConsultaDnpResponse } from '../models/consulta-rc';
import { ConsultaDnpListResponse, Rcdnp } from '../models/consulta-rc-list';

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
  refCatastralWsUrl: string;

  municipios: Muni[];
  calles: Calle[];
  _numeros: Nump[];
  numeros$: Subject<Nump[]>;

  _provincias: Prov[];
  provincias$: Subject<Prov[]>;

  _bico!: Bico;
  bico$: Subject<Bico>;

  get bico() {
    return this._bico;
  }

  set bico(bico: Bico) {
    this._bico = bico;
    this.bico$.next(bico);
  }

  _rcdnps!: Rcdnp[];
  rcdnps$: Subject<Rcdnp[]>;

  get rcdnps() {
    return this._rcdnps;
  }

  set rcdnps(rcdnps: Rcdnp[]) {
    this._rcdnps = rcdnps;
    this.rcdnps$.next(rcdnps);
  }

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
      'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaProvincia';

    this.municipioWsUrl =
      'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaMunicipio';

    this.viaWsUrl =
      'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaVia';
    this.numeroWsUrl =
      'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaNumero';

    this.refCatastralWsUrl =
      'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/Consulta_DNPRC';
    this._provincias = [];
    this.municipios = [];
    this.calles = [];
    this._numeros = [];

    this.provincias$ = new Subject<Prov[]>();
    this.numeros$ = new Subject<Nump[]>();
    this.bico$ = new Subject<Bico>();
    this.rcdnps$ = new Subject<Rcdnp[]>();

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
    this.errNumeros = false;
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
    this.numeros = []; //reset
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
    if (!nomVia) return; //security check
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
            /*  console.log(
              'catastroService proximity',
              consultaNumeroResponse.consulta_numerero.numerero.nump
            ); */
            if (
              Array.isArray(
                consultaNumeroResponse.consulta_numerero.numerero.nump
              )
            ) {
              this.numeros =
                consultaNumeroResponse.consulta_numerero.numerero.nump;
            } else {
              this.numeros = [
                consultaNumeroResponse.consulta_numerero.numerero.nump,
              ];
            }
          } else {
            this.errNumeros = true;
          }
        } else {
          //filter by number
          /* console.log(
            'catastroService no error',
            consultaNumeroResponse.consulta_numerero.numerero.nump
          ); */
          let _nump = consultaNumeroResponse.consulta_numerero.numerero.nump;
          if (Array.isArray(_nump)) {
            this.numeros = _nump;
          } else {
            this.numeros = [_nump];
          }
        }
      });
  }

  getRefCatastral(prov: string, muni: string, rc: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('Provincia', prov);
    httpParams = httpParams.set('Municipio', muni);
    httpParams = httpParams.set('RC', rc);
    this.httpClient
      .get(this.refCatastralWsUrl, { responseType: 'text', params: httpParams })
      .subscribe((data: string) => {
        const xmlParser = new XMLParser();
        const refCatastralResponseUnknown = xmlParser.parse(data);
        const isList = 'lrcdnp' in refCatastralResponseUnknown.consulta_dnp;
        if (isList) {
          const refCatastralListResponse: ConsultaDnpListResponse =
            refCatastralResponseUnknown;
          this.rcdnps = refCatastralListResponse.consulta_dnp.lrcdnp.rcdnp;
        } else {
          const refCatastralResponse: ConsultaDnpResponse =
            refCatastralResponseUnknown;
          this.bico = refCatastralResponse.consulta_dnp.bico;
        }
      });
  }
}
