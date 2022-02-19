import { Client as SoapClient, createClientAsync as soapCreateClientAsync } from "soap";
import { Sstring } from "./definitions/Sstring";
import { ConsultaDnp } from "./definitions/ConsultaDnp";
import { Provincias } from "./definitions/Provincias";
import { Sstring1 } from "./definitions/Sstring1";
import { Municipios } from "./definitions/Municipios";
import { Sstring2 } from "./definitions/Sstring2";
import { Callejero } from "./definitions/Callejero";
import { Sstring3 } from "./definitions/Sstring3";
import { Sstring4 } from "./definitions/Sstring4";
import { ConsultaDnp1 } from "./definitions/ConsultaDnp1";
import { Sstring5 } from "./definitions/Sstring5";
import { ConsultaDnppp } from "./definitions/ConsultaDnppp";
import { CallejeroX0020DeX0020LaX0020SedeX0020ElectrónicaX0020DelX0020Catastro } from "./services/CallejeroX0020DeX0020LaX0020SedeX0020ElectrónicaX0020DelX0020Catastro";

export interface OvccallejeroClient extends SoapClient {
    CallejeroX0020DeX0020LaX0020SedeX0020ElectrónicaX0020DelX0020Catastro: CallejeroX0020DeX0020LaX0020SedeX0020ElectrónicaX0020DelX0020Catastro;
    Consulta_DNPRCAsync(provincia: Sstring): Promise<[result: ConsultaDnp, rawResponse: any, soapHeader: any, rawRequest: any]>;
    ObtenerProvinciasAsync(consultaProvinciaSoapIn: {}): Promise<[result: Provincias, rawResponse: any, soapHeader: any, rawRequest: any]>;
    ObtenerMunicipiosAsync(provincia: Sstring1): Promise<[result: Municipios, rawResponse: any, soapHeader: any, rawRequest: any]>;
    ObtenerCallejeroAsync(provincia: Sstring2): Promise<[result: Callejero, rawResponse: any, soapHeader: any, rawRequest: any]>;
    ObtenerNumereroAsync(provincia: Sstring3): Promise<[result: Callejero, rawResponse: any, soapHeader: any, rawRequest: any]>;
    Consulta_DNPLOCAsync(provincia: Sstring4): Promise<[result: ConsultaDnp1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    Consulta_DNPPPAsync(provincia: Sstring5): Promise<[result: ConsultaDnppp, rawResponse: any, soapHeader: any, rawRequest: any]>;
}

/** Create OvccallejeroClient */
export function createClientAsync(...args: Parameters<typeof soapCreateClientAsync>): Promise<OvccallejeroClient> {
    return soapCreateClientAsync(args[0], args[1], args[2]) as any;
}
