// src\app\app.component.ts

import { Component, OnInit  } from '@angular/core';
import { GetHealthStatusService } from './core/services/gethealthstatus.service';
import { UtilService } from '../app/services/util/util.service';
import { SignalRService } from './services/SignalR/signalr-service.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private getHealthStatusService: GetHealthStatusService,
    private utilService: UtilService,
    private signalRService: SignalRService,
  ) {}

  ngOnInit() {

  }

  //#region appPages
  public appPages = [
    { title: 'Configuração', url: 'configuracao', icon:'settings' },    
    { title: 'Ajuda', url: 'ajuda', icon: 'help-circle' }
  ];
  //#endregion

  //#region GetHealthStatus
  async GetHealthStatus() {
    try {
      const status = await this.getHealthStatusService.GetHealthStatus();  
      if (status && status.trim() !== '') {
        await this.utilService.showAlert(`Sucesso`,`${status}`);
      } else {
        await this.utilService.showAlert(`Erro`,`Não foi possível se comunicar com a API. Verifique sua internet e se o computador/servidor está ligado.`);
      }
    } catch (error) {
      await this.utilService.showAlert(`Erro`,`Não foi possível se comunicar com a API. Verifique sua internet e se o computador/servidor está ligado.`);
    }
  }
  //#endregion
}
