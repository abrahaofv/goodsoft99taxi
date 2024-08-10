import { sincronizarProdutoSingleRequest } from "./sincronizarProdutoSingle.request.model";

export interface sincronizarProdutoBatchRequest {
  listaProdutos : sincronizarProdutoSingleRequest[] | null;
}



