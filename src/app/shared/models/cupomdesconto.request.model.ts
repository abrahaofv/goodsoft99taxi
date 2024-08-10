export interface CupomDescontoRequestProduto {
  codigoProduto: string;
  totalItem: number;
  precoUnitario: number;
  quantidade : number;
}

export interface CupomDescontoRequest {
  nomeAtendente: string;
  codigoDesconto: string;
  valorTotalPedido: number;
  listaItensPedido : CupomDescontoRequestProduto[] | null;
}

