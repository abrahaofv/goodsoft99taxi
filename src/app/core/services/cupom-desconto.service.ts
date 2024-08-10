// src\app\core\services\cupom-desconto.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { CupomDescontoRequest } from 'src/app/shared/models/cupomdesconto.request.model';
import { CupomDesconto } from 'src/app/shared/models/cupomdesconto.model';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';


@Injectable({
  providedIn: 'root',
})
export class CupomDescontoService {
  constructor(
    private http: HttpClient,
    private configuracaoService: ConfiguracaoService) {}

  async validarDesconto(cupomDesconto: CupomDescontoRequest): Promise<CupomDesconto> {     
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'ValidarCupomDesconto';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const cupomObservable = this.http.post<CupomDesconto>(endpoint, cupomDesconto, { headers });
    return await firstValueFrom(cupomObservable);
  }
}
