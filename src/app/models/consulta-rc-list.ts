export interface ConsultaDnpListResponse {
  consulta_dnp: ConsultaDnp;
}

export interface ConsultaDnp {
  control: Control;
  lrcdnp: Lrcdnp;
}

export interface Control {
  cudnp: string;
}

export interface Lrcdnp {
  rcdnp: Rcdnp[];
}

export interface Rcdnp {
  rc: RC;
  dt: Dt;
}

export interface Dt {
  loine: Loine;
  cmc: string;
  np: string;
  nm: string;
  locs: Locs;
}

export interface Locs {
  lous: Lous;
}

export interface Lous {
  lourb: Lourb;
}

export interface Lourb {
  dir: Dir;
  loint: Loint;
  dp: string;
  dm: string;
}

export interface Dir {
  cv: string;
  tv: string;
  nv: string;
  pnp: string;
}

export interface Loint {
  es?: string;
  pt: string;
  pu: string;
}

export interface Loine {
  cp: string;
  cm: string;
}

export interface RC {
  pc1: string;
  pc2: string;
  car: string;
  cc1: string;
  cc2: string;
}
