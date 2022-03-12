import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Nump } from './models/consulta-numero.interface';
import { Bico, Con } from './models/consulta-rc';
import { Rcdnp } from './models/consulta-rc-list';
import { CustomNumeroInterface } from './models/custom-numero';
import { FormFilterInterface } from './models/form-filter.interface';
import { CatastroService } from './services/catastro.service';
import { HttpCounterService } from './services/http-counter.service';
import { orderBy } from 'natural-orderby';
import { ExcelService } from './services/excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  form: FormGroup;
  formFilter: FormGroup;
  lastNumero: string;
  oldNumero: string;
  lastRefCatastral: string;
  oldRefCatastral: string;

  bicos: Bico[];
  rcdnps: Rcdnp[];

  refCatastralSet: Set<string>;

  isVisible: boolean;

  constructor(
    public catastroService: CatastroService,
    private formBuilder: FormBuilder,
    public httpCounterService: HttpCounterService,
    private excelService: ExcelService
  ) {
    this.title = 'catastro';
    this.form = this.formBuilder.group({
      provincia: [undefined],
      municipio: [undefined],
      calle: [undefined],
      numeros: this.formBuilder.array([]),
    });

    this.formFilter = this.formBuilder.group({
      isAparcamiento: [undefined],
      isComercial: [undefined],
      isAlmacen: [undefined],
      isVivienda: [true],
      isResidencial: [true],
    });

    this.lastNumero = '0';
    this.oldNumero = '';
    this.lastRefCatastral = '';
    this.oldRefCatastral = '';

    this.bicos = [];
    this.rcdnps = [];
    this.refCatastralSet = new Set();

    this.isVisible = true;
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

    this.registerBicos();

    this.registerRcdnps();
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
            refCatastral: [
              numero.pc.pc1.toString().padStart(7, '0') +
                numero.pc.pc2.toString().padStart(7, '0'),
            ],
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
      }
    });
  }

  registerBicos() {
    this.catastroService.bico$.subscribe((bico: Bico) => {
      //Filter by selections

      const formFilterValue: FormFilterInterface = this.formFilter.value;
      const consResult: Con[] = [];
      try {
        if (Array.isArray(bico.lcons.cons)) {
          for (let con of bico.lcons.cons) {
            if (con.dt) {
              switch (con.lcd) {
                case 'VIVIENDA':
                  if (formFilterValue.isVivienda) consResult.push(con);
                  break;
                case 'RESIDENCIAL':
                  if (formFilterValue.isResidencial) consResult.push(con);
                  break;
                case 'APARCAMIENTO':
                  if (formFilterValue.isAparcamiento) consResult.push(con);
                  break;
                case 'COMERCIAL':
                case 'COMERCIO':
                  if (formFilterValue.isComercial) consResult.push(con);
                  break;
                case 'ALMACEN':
                  if (formFilterValue.isAlmacen) consResult.push(con);
                  break;
                default:
                  break;
              }
            }
          }
        } else {
          if (bico.lcons.cons) {
            const con = bico.lcons.cons as Con; //single
            if (con.dt) {
              switch (con.lcd) {
                case 'VIVIENDA':
                  if (formFilterValue.isVivienda) consResult.push(con);
                  break;
                case 'RESIDENCIAL':
                  if (formFilterValue.isResidencial) consResult.push(con);
                  break;
                case 'APARCAMIENTO':
                  if (formFilterValue.isAparcamiento) consResult.push(con);
                  break;
                case 'COMERCIAL':
                case 'COMERCIO':
                  if (formFilterValue.isComercial) consResult.push(con);
                  break;
                case 'ALMACEN':
                  if (formFilterValue.isAlmacen) consResult.push(con);
                  break;
                default:
                  break;
              }
            }
          }
        }
        //Assign new cons result
        bico.lcons.cons = consResult;
        //If no length means has not passed any filter
        if (bico.lcons.cons.length) {
          //Check bico doesnt already exists
          if (!this.bicos.some((b) => b.bi.ldt === bico.bi.ldt)) {
            this.bicos.push(bico);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  registerRcdnps() {
    this.catastroService.rcdnps$.subscribe((rcdnps: Rcdnp[]) => {
      for (let rcdnp of rcdnps) {
        const rc = rcdnp.rc;
        //Fill car property with zeros in the left
        rc.car = rc.car.toString();
        rc.car = rc.car.padStart(4, '0');
        this.catastroService.getRefCatastral(
          this.getProvinciaControlValue(),
          this.getMunicipioControlValue(),
          rc.pc1 + rc.pc2 + rc.car + rc.cc1 + rc.cc2
        );
      }
    });
  }

  onCleanBicos() {
    this.bicos = []; //reset
    this.refCatastralSet.clear();
  }

  onPrint() {
    window.print();
  }

  onCsvPrint() {
    const rows = this.bicos.map((bico) => bico.bi.ldt + '\n');

    const a: HTMLAnchorElement = document.createElement('a');
    const file = new Blob(rows, { type: 'text/csv' });
    a.href = URL.createObjectURL(file);
    a.download = 'territorio.csv';
    a.click();
  }

  onSaveExcelModel1() {
    this.excelService.createModel1(this.bicos);
  }

  onOrderBicos() {
    this.bicos = orderBy(this.bicos, [(v) => v.bi.ldt], ['asc']);
  }

  onSubmit() {
    this.rcdnps = []; //reset
    const formValue = this.form.value;
    let numeros: CustomNumeroInterface[] = formValue.numeros;
    //Only selected
    numeros = numeros.filter((numero) => numero.selected);
    //Get all rc data
    for (let numero of numeros) {
      //Check if we already have the ref. catastral
      if (!this.refCatastralSet.has(numero.refCatastral)) {
        this.refCatastralSet.add(numero.refCatastral);

        this.catastroService.getRefCatastral(
          this.getProvinciaControlValue(),
          this.getMunicipioControlValue(),
          numero.refCatastral
        );
      }
    }
  }
}
