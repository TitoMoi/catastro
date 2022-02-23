export interface ConsultaCalleResponse {
  consulta_callejero: ConsultaCallejero;
}

export interface ConsultaCallejero {
  control: Control;
  callejero: Callejero;
}

export interface Callejero {
  calle: Calle[];
}

export interface Calle {
  loine: Loine;
  dir: Dir;
}

export interface Dir {
  cv: string;
  tv: string;
  nv: string;
}

export interface Loine {
  cp: string;
  cm: string;
}

export interface Control {
  cuca: string;
}
