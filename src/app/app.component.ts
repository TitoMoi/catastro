import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CatastroService } from './services/catastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  form: FormGroup;
  constructor(
    public catastroService: CatastroService,
    private formBuilder: FormBuilder
  ) {
    this.title = 'catastro';
    this.form = this.formBuilder.group({
      provincia: [undefined],
      municipio: [undefined],
    });
  }
  ngOnInit(): void {
    this.catastroService.getProvincias();

    this.form.get('provincia')!.valueChanges.subscribe((prov) => {
      this.catastroService.getMunicipios(prov);
    });

    this.form.get('municipio')!.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }

  /* this.catastroService.getMunicipios('VALENCIA'); */
  /* this.catastroService.getMunicipios('VALENCIA'); */
  /* this.catastroService.getMunicipios('46', '246'); //TORRENT*/
  /* this.catastroService.getViasCodigo('46', '246'); //23 AZORIN */
  /*  this.catastroService.getNumero('46', '246', undefined, '23', '1'); //7377104YJ1677N */
}
