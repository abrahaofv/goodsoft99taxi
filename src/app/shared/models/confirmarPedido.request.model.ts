export interface ConfirmarPedidoRequestPagamento {
  tipo: string;
  valor: number;
}

export interface confirmarPedidoRequest {
  pedidoId: string;
  recibo: string;
  Pagamentos : ConfirmarPedidoRequestPagamento[] | null;
}



