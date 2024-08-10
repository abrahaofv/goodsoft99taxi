import { Injectable } from '@angular/core';
import { DatabaseUtilsService } from '../database-utils.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseToJSONService {

  constructor(private dbUtilService: DatabaseUtilsService) { }

  async exportDatabaseToJSON(): Promise<boolean> {
    return await this.dbUtilService.exportDatabaseToJSON();
  }

  async importDatabaseFromJSON(jsonData: string, importCombustiveis: boolean, importBombas: boolean): Promise<boolean> {
    return await this.dbUtilService.importDatabaseFromJSON(jsonData, importCombustiveis, importBombas);
  }

  // Homologação do método importDatabaseFromJSON
  async retornaJSON(): Promise<string>{
    const jsonString = `{
      "combustiveis": [
        {
          "id": 1,
          "nome": "GASOLINA",
          "idbicos": "10,12",
          "idbombas": "1",
          "preco": "5.99",
          "tipoproduto": "GASOLINA",
          "status": true,
          "ehcombustivel": true,
          "ncm": 12345,
          "anp": 12345,
          "codigobarras": 123154
        },
        {
          "id": 2,
          "nome": "ETANOL",
          "idbicos": "1",
          "idbombas": "2",
          "preco": "4.7851",
          "tipoproduto": "ETANOL",
          "status": true,
          "ehcombustivel": true,
          "ncm": 1234,
          "anp": 1234,
          "codigobarras": 1234
        },
        {
          "id": 3,
          "nome": "GASOLINA PODIUM",
          "idbicos": "2",
          "idbombas": "2",
          "preco": "8.5127",
          "tipoproduto": "GASOLINA_PODIUM",
          "status": true,
          "ehcombustivel": true,
          "ncm": 12345,
          "anp": 12345,
          "codigobarras": 12345
        },
        {
          "id": 4,
          "nome": "GASOLINA PREMIUM",
          "idbicos": "3",
          "idbombas": "3",
          "preco": "8.00",
          "tipoproduto": "GASOLINA_PREMIUM",
          "status": true,
          "ehcombustivel": true,
          "ncm": 1234,
          "anp": 12354,
          "codigobarras": 12345
        }
      ],
      "bombas": [
        {
          "idbomba": 1,
          "idbicos": "10,12"
        },
        {
          "idbomba": 2,
          "idbicos": "1,2"
        },
        {
          "idbomba": 3,
          "idbicos": "3"
        }
      ],
      "descontos": [
        {
          "totalpreco": 23.95,
          "totaldesconto": 23.95,
          "datahora": "2024-08-01T00:02:48.521Z",
          "numerorecibo": "123",
          "idpedidodidiglobal": "13e70bf0-0cfa-93cf-957e-590afd1b9899",
          "codigodesconto": "9MCN8",
          "confirmado": false,
          "totaldescontorecebido": 0,
          "cancelado": false,
          "nomeatendente": "Roberta Cristina",
          "id": 1
        },
        {
          "totalpreco": 124.47,
          "totaldesconto": 114.08,
          "datahora": "2024-08-06T22:02:18.317Z",
          "numerorecibo": "7897",
          "idpedidodidiglobal": "e870bba5-9029-9b0c-af15-a7c469915b21",
          "codigodesconto": "9MCN8",
          "confirmado": false,
          "totaldescontorecebido": 0,
          "cancelado": false,
          "nomeatendente": "RONALD SOUZA",
          "id": 2
        },
        {
          "totalpreco": 101.13,
          "totaldesconto": 93.74,
          "datahora": "2024-08-06T22:27:58.025Z",
          "numerorecibo": "79815",
          "idpedidodidiglobal": "2632c3ac-76b8-99de-9efb-3d153c2d3564",
          "codigodesconto": "9MCN8",
          "confirmado": true,
          "totaldescontorecebido": 0,
          "cancelado": false,
          "nomeatendente": "ANDRÉ DANTAS",
          "id": 3
        },
        {
          "totalpreco": 299.5,
          "totaldesconto": 279.5,
          "datahora": "2024-08-06T23:02:54.606Z",
          "numerorecibo": "789456",
          "idpedidodidiglobal": "7f31542e-b228-9829-b8fc-9c69255f78fe",
          "codigodesconto": "9MCN8",
          "confirmado": true,
          "totaldescontorecebido": 20,
          "cancelado": true,
          "nomeatendente": "Ricardo Silva",
          "id": 4
        },
        {
          "totalpreco": 80,
          "totaldesconto": 75,
          "datahora": "2024-08-06T23:17:30.308Z",
          "numerorecibo": "12345",
          "idpedidodidiglobal": "1bf1352b-ecf6-9bbd-a81f-6ce4f382c3a5",
          "codigodesconto": "9MCN8",
          "confirmado": true,
          "totaldescontorecebido": 0,
          "cancelado": false,
          "nomeatendente": "Ricardo Silva",
          "id": 5
        },
        {
          "totalpreco": 160,
          "totaldesconto": 150,
          "datahora": "2024-08-06T23:55:51.230Z",
          "numerorecibo": "12367",
          "idpedidodidiglobal": "081d0980-5dd8-990d-a4ed-ba59560e2053",
          "codigodesconto": "9MCN8",
          "confirmado": true,
          "totaldescontorecebido": 0,
          "cancelado": false,
          "nomeatendente": "RONALDINHO GAUCHO",
          "id": 6
        }
      ],
      "descontoscombustiveis": [
        {
          "iddesconto": 1,
          "idcombustivel": 2,
          "idbomba": 2,
          "idbico": "1",
          "nome": "ETANOL",
          "preco": 4.79,
          "totallitros": 5,
          "totalprecocombustivel": 23.95,
          "totaldescontocombustivel": 23.95,
          "totaldescontorecebidocombustivel": 0,
          "id": 1
        },
        {
          "iddesconto": 2,
          "idcombustivel": 1,
          "idbomba": 1,
          "idbico": "12",
          "nome": "GASOLINA",
          "preco": 5.99,
          "totallitros": 20.78,
          "totalprecocombustivel": 124.47,
          "totaldescontocombustivel": 114.08,
          "totaldescontorecebidocombustivel": 10.39,
          "id": 2
        },
        {
          "iddesconto": 3,
          "idcombustivel": 3,
          "idbomba": 2,
          "idbico": "2",
          "nome": "GASOLINA PODIUM",
          "preco": 8.51,
          "totallitros": 5,
          "totalprecocombustivel": 42.55,
          "totaldescontocombustivel": 40.05,
          "totaldescontorecebidocombustivel": 2.5,
          "id": 3
        },
        {
          "iddesconto": 3,
          "idcombustivel": 1,
          "idbomba": 1,
          "idbico": "10",
          "nome": "GASOLINA",
          "preco": 5.99,
          "totallitros": 9.78,
          "totalprecocombustivel": 58.58,
          "totaldescontocombustivel": 53.69,
          "totaldescontorecebidocombustivel": 4.89,
          "id": 4
        },
        {
          "iddesconto": 4,
          "idcombustivel": 1,
          "idbomba": 1,
          "idbico": "12",
          "nome": "GASOLINA",
          "preco": 5.99,
          "totallitros": 50,
          "totalprecocombustivel": 299.5,
          "totaldescontocombustivel": 279.5,
          "totaldescontorecebidocombustivel": 20,
          "id": 5
        },
        {
          "iddesconto": 5,
          "idcombustivel": 4,
          "idbomba": 3,
          "idbico": "3",
          "nome": "GASOLINA PREMIUM",
          "preco": 8,
          "totallitros": 10,
          "totalprecocombustivel": 80,
          "totaldescontocombustivel": 75,
          "totaldescontorecebidocombustivel": 5,
          "id": 6
        },
        {
          "iddesconto": 6,
          "idcombustivel": 4,
          "idbomba": 3,
          "idbico": "3",
          "nome": "GASOLINA PREMIUM",
          "preco": 8,
          "totallitros": 20,
          "totalprecocombustivel": 160,
          "totaldescontocombustivel": 150,
          "totaldescontorecebidocombustivel": 10,
          "id": 7
        }
      ],
      "descontotipospagamento": [
        {
          "iddesconto": 3,
          "tipopagamento": "Dinheiro",
          "valorpago": 93.74,
          "id": 1
        },
        {
          "iddesconto": 4,
          "tipopagamento": "Dinheiro",
          "valorpago": 279.5,
          "id": 2
        },
        {
          "iddesconto": 5,
          "tipopagamento": "Pix",
          "valorpago": 75,
          "id": 3
        },
        {
          "iddesconto": 6,
          "tipopagamento": "Pix",
          "valorpago": 100,
          "id": 4
        },
        {
          "iddesconto": 6,
          "tipopagamento": "Dinheiro",
          "valorpago": 50,
          "id": 5
        }
      ],
      "configuracao": [
        {
          "id": 1,
          "login": "",
          "senha": "",
          "urlapi": "http://localhost:5000/api/GasStation/",
          "loginsagaz": "",
          "senhasagaz": "",
          "diretoriojson": ""
        }
      ]
    }`;

    return jsonString;
  }
}
