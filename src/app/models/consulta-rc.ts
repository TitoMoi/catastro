export interface ConsultaDnpResponse {
  consulta_dnp: ConsultaDnp;
}

export interface ConsultaDnp {
  control: Control;
  bico: Bico;
}

export interface Bico {
  bi: BI;
  lcons: Lcons;
}

export interface BI {
  idbi: Idbi;
  dt: BIDt;
  ldt: string;
  debi: Debi;
}

export interface Debi {
  luso: string;
  sfc: string;
  cpt: string;
  ant: string;
}

export interface BIDt {
  loine: string;
  cmc: string;
  np: string;
  nm: string;
  locs: Locs;
}

export interface Locs {
  lous: Lous;
}

export interface Lous {
  lourb: LousLourb;
}

export interface LousLourb {
  dir: Dir;
  loint: PurpleLoint;
  dp: string;
  dm: string;
}

export interface Dir {
  cv: string;
  tv: string;
  nv: string;
  pnp: string;
  snp: string;
}

export interface PurpleLoint {
  es: string;
  pt: string;
  pu: string;
}

export interface Idbi {
  cn: string;
  rc: RC;
}

export interface RC {
  pc1: string;
  pc2: string;
  car: string;
  cc1: string;
  cc2: string;
}

export interface Lcons {
  cons: Con[];
}

export interface Con {
  lcd: string;
  dt: ConDt;
  dfcons: Dfcons;
}

export interface Dfcons {
  stl: string;
}

export interface ConDt {
  lourb: DtLourb;
}

export interface DtLourb {
  loint: FluffyLoint;
}

export interface FluffyLoint {
  pt: string;
  pu: string;
}

export interface Control {
  cudnp: string;
  cucons: string;
  cucul: string;
}
