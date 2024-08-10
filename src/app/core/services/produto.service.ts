import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { Produto } from 'src/app/shared/models/produto.model';
import { sincronizarProdutoSingleRequest } from 'src/app/shared/models/sincronizarProdutoSingle.request.model';
import { sincronizarProdutoBatchRequest } from 'src/app/shared/models/sincronizarProdutoBatch.request.model';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';

@Injectable({
  providedIn: 'root', 
})
export class ProdutoService {
  constructor(
    private http: HttpClient,
    private configuracaoService: ConfiguracaoService) {}

  async sincronizarProdutoSingle(produto: sincronizarProdutoSingleRequest): Promise<Produto> {
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'SincronizarProdutoSingle';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const produtoObservable = this.http.post<Produto>(endpoint, produto, { headers });
    return await firstValueFrom(produtoObservable);
  }

  async sincronizarProdutoBatch(listaProduto: sincronizarProdutoBatchRequest): Promise<Produto> {    
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'SincronizarProdutoBatch';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const produtoObservable = this.http.post<Produto>(endpoint, listaProduto, { headers });
    return await firstValueFrom(produtoObservable);
  }


}
