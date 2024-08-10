// src\app\services\SignalR\signalr-service.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfiguracaoService } from 'src/app/services/configuracao/configuracao.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor(
    private configuracaoService: ConfiguracaoService
  ) {    
    this.initialize();
  }

  // Método para inicializar a conexão e listeners
  private async initialize() {
    await this.startConnection();
    this.addListener();
  }

  async retornaApiUrlSignalR(): Promise<string> {
    const apiUrl = await this.configuracaoService.getConfiguracaoUrlApi();
    
    // Remove "api/GasStation/" da URL
    const finalUrl = apiUrl.replace('api/GasStation/', '');

    return finalUrl;
  }

  private async startConnection() {
    const apiUrl = await this.retornaApiUrlSignalR();
    const endpoint = apiUrl + 'notificationHub';

    if (!endpoint) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(endpoint, {
        skipNegotiation: true, // Se necessário
        transport: signalR.HttpTransportType.WebSockets
      }
      ) // URL do seu backend SignalR
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect() // Habilita reconexão automática
      .build();

    await this.hubConnection
      .start()
      .then(() => console.log('SignalR conectado'))
      .catch((err) => console.log('Erro ao iniciar conexão com SignalR: ' + err));

    // Gerenciamento de eventos de reconexão
    this.hubConnection.onreconnecting(error => {
      console.warn('Reconectando SignalR...', error);
    });

    this.hubConnection.onreconnected(connectionId => {
      console.log('SignalR reconectado. Connection ID:', connectionId);
    });

    this.hubConnection.onclose(() => {
      console.warn('Conexão SignalR fechada.');
    });
  }

  public addListener() {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveNotification', (message: string) => {
        console.log('Notificação recebida: ', message);
      });
    } else {
      console.warn('A conexão com o SignalR ainda não foi estabelecida.');
    }
  }
}