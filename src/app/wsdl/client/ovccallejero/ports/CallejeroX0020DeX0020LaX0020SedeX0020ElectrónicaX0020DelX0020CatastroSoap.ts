import { Sstring } from "../definitions/Sstring";
import { ConsultaDnp } from "../definitions/ConsultaDnp";
import { Provincias } from "../definitions/Provincias";
import { Sstring1 } from "../definitions/Sstring1";
import { Municipios } from "../definitions/Municipios";
import { Sstring2 } from "../definitions/Sstring2";
import { Callejero } from "../definitions/Callejero";
import { Sstring3 } from "../definitions/Sstring3";
import { Sstring4 } from "../definitions/Sstring4";
import { ConsultaDnp1 } from "../definitions/ConsultaDnp1";
import { Sstring5 } from "../definitions/Sstring5";
import { ConsultaDnppp } from "../definitions/ConsultaDnppp";

export interface CallejeroX0020DeX0020LaX0020SedeX0020ElectrónicaX0020DelX0020CatastroSoap {
    Consulta_DNPRC(provincia: Sstring, callback: (err: any, result: ConsultaDnp, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    ObtenerProvincias(consultaProvinciaSoapIn: {}, callback: (err: any, result: Provincias, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    ObtenerMunicipios(provincia: Sstring1, callback: (err: any, result: Municipios, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    ObtenerCallejero(provincia: Sstring2, callback: (err: any, result: Callejero, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    ObtenerNumerero(provincia: Sstring3, callback: (err: any, result: Callejero, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    Consulta_DNPLOC(provincia: Sstring4, callback: (err: any, result: ConsultaDnp1, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
    Consulta_DNPPP(provincia: Sstring5, callback: (err: any, result: ConsultaDnppp, rawResponse: any, soapHeader: any, rawRequest: any) => void): void;
}
