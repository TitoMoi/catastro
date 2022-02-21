export interface ConsultaProvincieroResponse {
  consulta_provinciero: ConsultaProvinciero;
}

export interface ConsultaProvinciero {
  control: Control;
  provinciero: Provinciero;
}

export interface Control {
  cuprov: string;
}

export interface Provinciero {
  prov: Prov[];
}

export interface Prov {
  cpine: string;
  np: string;
}
