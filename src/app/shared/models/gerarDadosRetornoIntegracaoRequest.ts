import { Timestamp } from "rxjs";

export interface GerarDadosRetornoIntegracaoRequest {

  id: number;
  descontoPagamento: GerarDadosRetornoIntegracaoPagamentoPedidoRequest[] | null;
  NomeAtendente: string;
  totalPreco: number;
  totalDesconto : number;
  dataHora: Date;
  recibo: string;
  idPedidoDidiGlobal: string;
  codigoDesconto: string;
  confirmado: boolean;
  totalDescontoRecebido: number;
  cancelado: boolean;
  descontoCombustivel: GerarDadosRetornoIntegracaoDescontoCombustivelRequest[] | null;
}


export interface GerarDadosRetornoIntegracaoDescontoCombustivelRequest {
id : number;
idDesconto: number;
idCombustivel: number;
idBomba: number;
idBico: number;
nome: string;
preco: number;
totalLitros: number;
totalPrecoCombustivel: number;
totalDescontoCombustivel: number;
totalDescontoRecebidoCombustivel: number;

}

export interface GerarDadosRetornoIntegracaoPagamentoPedidoRequest {
  id: number;
  idDesconto: number;
  tipo: string;
  valor: number;
}

