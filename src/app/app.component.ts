import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as xmljs from 'xml-js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  provinciaUrl: string;
  constructor(private httpClient: HttpClient) {
    this.title = 'catastro';
    this.provinciaUrl =
      'http://localhost:4200/api/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/ConsultaProvincia';
  }
  ngOnInit(): void {
    //const headers = new HttpHeaders();
    //headers.set('Cookie', 'TS01da3df4=01737a9c024fcf723d3a1a56f703a9e99afc9101eab3c8176d50b8f3226e376542b0d588b8274083b66951107b737d9b532456ed43')
    this.httpClient
      .get(this.provinciaUrl, { responseType: 'text' })
      .subscribe((data) => {
        console.log(data);
        /* const domParser = new DOMParser();
      domParser.parseFromString(data)
      xmljs.xml2js(data); */
      });
  }
}
