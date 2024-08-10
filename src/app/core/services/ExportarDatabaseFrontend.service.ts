// src\app\core\services\ExportarDatabaseFrontend.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ExportarDatabaseFrontendRequest } from 'src/app/shared/models/exportarDatabaseFrontendRequest';
import { exportarDatabaseFrontendResponse } from 'src/app/shared/models/exportarDatabaseFrontendResponse';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';

@Injectable({
  providedIn: 'root'
})
export class ExportarDatabaseFrontendService {
  constructor(
    private http: HttpClient,
    private configuracaoService: ConfiguracaoService) {}

  async ExportarDatabaseFrontend(jsondb: ExportarDatabaseFrontendRequest): Promise<exportarDatabaseFrontendResponse> {
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    const endpoint = apiUrl + 'ExportarDatabaseFrontend';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const cupomObservable = this.http.post<exportarDatabaseFrontendResponse>(endpoint, jsondb, { headers });
    return await firstValueFrom(cupomObservable);
  }
}
