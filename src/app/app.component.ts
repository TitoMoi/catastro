import { Component, OnInit } from '@angular/core';
import { CatastroService } from './services/catastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  constructor(private catastroService: CatastroService) {
    this.title = 'catastro';
  }
  ngOnInit(): void {
    /* this.catastroService.getProvincias(); */
    /* this.catastroService.getMunicipios('VALENCIA'); */
    this.catastroService.getMunicipios('46');
    /* this.catastroService.getMunicipios('46', '246'); //TORRENT*/
    /* this.catastroService.getViasCodigo('46', '246'); //23 AZORIN */
    /*  this.catastroService.getNumero('46', '246', undefined, '23', '1'); //7377104YJ1677N */
  }
}
