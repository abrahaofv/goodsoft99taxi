import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';
import { UtilService } from 'src/app/services/util/util.service';

@Injectable({
    providedIn: 'root',
  })
  export class GetHealthStatusService {
    constructor(
        private http: HttpClient,
        private configuracaoService: ConfiguracaoService,
        private utilService: UtilService) {}

    async GetHealthStatus(): Promise<string>{
        const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
        const endpoint = apiUrl + 'HealthCheck';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const healthStatusObservable = this.http.get<{status: string}>(endpoint, { headers });
        const response = await firstValueFrom(healthStatusObservable);
        return response.status;
    }

    async RetornoGetHealthStatus() {
      // Validação internet
      if (!this.configuracaoService.estaComInternet){
        await this.utilService.showAlert(`Erro`,`Sem conexão de internet. Verifique o seu modem ou operadora.`);
        return;
      }

      // Validação API
      try {
        const status = await this.GetHealthStatus();  
        if (!status || status.trim() == '') {
          //reiniciar aplicação da api
          await this.utilService.showAlert(`Erro`,`Não foi possível se comunicar com a API. Reiniciando aplicação API, aguarde!`);
        }
      } catch (error) {
        await this.utilService.showAlert(`Erro`,`Não foi possível se comunicar com a API. Verifique sua internet e se o computador/servidor está ligado.`);
      }
    }
  }