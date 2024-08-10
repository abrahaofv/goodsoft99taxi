// src\app\core\services\gerar-dados-retorno-integracao.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { GerarDadosRetornoIntegracaoRequest } from 'src/app/shared/models/gerarDadosRetornoIntegracaoRequest';
import { gerarDadosRetornoIntegracaoResponse } from 'src/app/shared/models/gerarDadosRetornoIntegracaoResponse';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';

@Injectable({
  providedIn: 'root'
})
export class GerarDadosRetornoIntegracaoService {
  constructor(
    private http: HttpClient,
    private configuracaoService: ConfiguracaoService) {}

  async gerarDadosRetorno(cupomDesconto: GerarDadosRetornoIntegracaoRequest): Promise<gerarDadosRetornoIntegracaoResponse> {
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'GerarDadosRetornoIntegracao';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const cupomObservable = this.http.post<gerarDadosRetornoIntegracaoResponse>(endpoint, cupomDesconto, { headers });
    return await firstValueFrom(cupomObservable);
  }
}
