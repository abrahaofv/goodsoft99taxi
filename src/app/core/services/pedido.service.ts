import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { CupomDescontoRequest } from 'src/app/shared/models/cupomdesconto.request.model';
import { CupomDesconto } from 'src/app/shared/models/cupomdesconto.model';
import { Pedido } from 'src/app/shared/models/pedido.model';
import { confirmarPedidoRequest } from 'src/app/shared/models/confirmarPedido.request.model';
import { cancelarPedidoRequest } from 'src/app/shared/models/cancelarPedido.request.model';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';


@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  constructor(
    private http: HttpClient,
    private configuracaoService: ConfiguracaoService) {
  }

  async confirmarPedido(pedido: confirmarPedidoRequest): Promise<Pedido> {
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'ConfirmarPedido';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const pedidoObservable = this.http.post<Pedido>(endpoint, pedido, { headers });
    return await firstValueFrom(pedidoObservable);
  }

  async cancelarPedido(pedido: cancelarPedidoRequest): Promise<Pedido> {   
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'CancelarPedido';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const pedidoObservable = this.http.post<Pedido>(endpoint, pedido, { headers });
    return await firstValueFrom(pedidoObservable);
  }

  // ValidarCupomDesconto
}
