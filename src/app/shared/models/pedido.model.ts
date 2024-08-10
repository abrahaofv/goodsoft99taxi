export interface Pedido {
  trace_Id: string;
  statusCode: number;
  errmsg: string;
  cupomvalido : boolean;
  confirmado: boolean;
  Data : object;
}
