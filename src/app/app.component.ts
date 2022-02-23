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
  lastNumero: string;
  oldNumero: string;
  lastRefCatastral: string;
  oldRefCatastral: string;
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
    this.lastNumero = '0';
    this.oldNumero = '';
    this.lastRefCatastral = '';
    this.oldRefCatastral = '';
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
      this.getNumerosFormArray.clear();
      this.lastNumero = '0'; //reset
      this.oldNumero = ''; //reset
      this.lastRefCatastral = ''; //reset
      this.oldRefCatastral = ''; //reset
      this.catastroService.getNumero(
        this.getProvinciaControlValue(),
        this.getMunicipioControlValue(),
        '',
        calle,
        this.lastNumero
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
      for (const numero of numeros) {
        //skip numeros that we already have but check equal or greater numeros
        if (numero.num.pnp < this.lastNumero) continue;
        this.oldNumero = this.lastNumero;
        this.lastNumero = numero.num.pnp;
        this.oldRefCatastral = this.lastRefCatastral;
        this.lastRefCatastral = numero.pc.pc1 + numero.pc.pc2;

        //Double security check, we can receive the lastNumero again
        if (this.oldRefCatastral !== this.lastRefCatastral) {
          //Add numeroFormGroup
          const numeroFormGroup: FormGroup = this.formBuilder.group({
            pnp: [numero.num.pnp],
            refCatastral: [numero.pc.pc1 + numero.pc.pc2],
            selected: [undefined],
          });
          const fa = this.form.get('numeros') as FormArray;
          fa.push(numeroFormGroup);
        }
      }

      const newNumero = this.lastNumero + 1; //We already have lastNumero, we need the next
      if (
        this.oldRefCatastral !== this.lastRefCatastral ||
        this.oldNumero !== this.lastNumero
      ) {
        this.catastroService.getNumero(
          this.getProvinciaControlValue(),
          this.getMunicipioControlValue(),
          '',
          this.getCalleControlValue(),
          newNumero
        );
      } else {
        this.isNumerosAvailable = true;
      }
    });
  }

  /* this.catastroService.getMunicipios('VALENCIA'); */
  /* this.catastroService.getMunicipios('VALENCIA'); */
  /* this.catastroService.getMunicipios('46', '246'); //TORRENT*/
  /* this.catastroService.getViasCodigo('46', '246'); //23 AZORIN */
  /*  this.catastroService.getNumero('46', '246', undefined, '23', '1'); //7377104YJ1677N */
}
