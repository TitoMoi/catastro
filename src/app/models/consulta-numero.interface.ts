export interface ConsultaNumeroResponse {
  consulta_numerero: ConsultaNumerero;
}

export interface ConsultaNumerero {
  control: Control;
  numerero: Numerero;
}

export interface Control {
  cunum: string;
  cuerr: string;
}

export interface Numerero {
  nump: Nump[];
}

export interface Nump {
  pc: PC;
  num: Num;
}

export interface Num {
  pnp: string;
  plp: string;
}

export interface PC {
  pc1: string;
  pc2: string;
}
