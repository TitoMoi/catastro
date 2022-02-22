export interface ConsultaMunicipieroResponse {
  consulta_municipiero: ConsultaMunicipiero;
}

export interface ConsultaMunicipiero {
  control: Control;
  municipiero: Municipiero;
}

export interface Control {
  cumun: string;
}

export interface Municipiero {
  muni: Muni[];
}

export interface Muni {
  nm: string;
  carto: string;
  locat: Locat;
  loine: Loine;
}

export interface Locat {
  cd: string;
  cmc: string;
}

export interface Loine {
  cp: string;
  cm: string;
}
