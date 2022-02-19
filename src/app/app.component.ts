import { Component, OnInit } from '@angular/core';
import {
  createClientAsync,
  OvccallejeroClient,
  Provincias,
} from './wsdl/client/ovccallejero';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'catastro';
  provincias: Provincias;
  client!: OvccallejeroClient;
  constructor() {
    this.provincias = '';
  }
  async ngOnInit() {
    this.client = await createClientAsync('./wsdl/ovccallejero.asmx');
    this.provincias = await this.client.ObtenerProvinciasAsync({});
  }
}
