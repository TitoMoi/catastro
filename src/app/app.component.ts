import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Nump } from './models/consulta-numero.interface';
import { CatastroService } from './services/catastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  form: FormGroup;
  isNumerosAvailable: boolean;
  constructor(
    public catastroService: CatastroService,
    private formBuilder: FormBuilder
  ) {
    this.title = 'catastro';
    this.form = this.formBuilder.group({
      provincia: [undefined],
      municipio: [undefined],
      calle: [undefined],
      numeros: this.formBuilder.array([]),
    });
    this.isNumerosAvailable = false;
  }
  ngOnInit(): void {
    this.catastroService.getProvincias();

    this.form.get('provincia')!.valueChanges.subscribe((prov) => {
      this.catastroService.getMunicipios(prov);
    });

    this.form.get('municipio')!.valueChanges.subscribe((muni) => {
      this.catastroService.getVias(this.getProvinciaControlValue(), muni);
    });

    this.form.get('calle')!.valueChanges.subscribe((calle) => {
      this.catastroService.getNumero(
        this.getProvinciaControlValue(),
        this.getMunicipioControlValue(),
        '',
        calle
      );
    });

    this.registerAddNumeroGroupControl();
  }

  onSubmit() {
    console.log(this.form.value);
  }

  getProvinciaControlValue() {
    return this.form.get('provincia')?.value;
  }

  getMunicipioControlValue() {
    return this.form.get('municipio')?.value;
  }

  getCalleControlValue() {
    return this.form.get('calle')?.value;
  }

  get getNumerosFormArray(): FormArray {
    return this.form.get('numeros') as FormArray;
  }

  registerAddNumeroGroupControl() {
    this.catastroService.numeros$.subscribe((numeros: Nump[]) => {
      numeros.forEach((numero) => {
        console.log(numero.num.pnp);
        const numeroFormGroup: FormGroup = this.formBuilder.group({
          pnp: [numero.num.pnp],
          refCatastral: [numero.pc.pc1 + numero.pc.pc2],
          selected: [undefined],
        });

        const fa = this.form.get('numeros') as FormArray;
        fa.push(numeroFormGroup);
      });
      this.isNumerosAvailable = true;
    });
  }

  /* this.catastroService.getMunicipios('VALENCIA'); */
  /* this.catastroService.getMunicipios('VALENCIA'); */
  /* this.catastroService.getMunicipios('46', '246'); //TORRENT*/
  /* this.catastroService.getViasCodigo('46', '246'); //23 AZORIN */
  /*  this.catastroService.getNumero('46', '246', undefined, '23', '1'); //7377104YJ1677N */
}
