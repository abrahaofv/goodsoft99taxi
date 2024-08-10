import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor() {
    this.initPushNotifications();
  }

  private initPushNotifications() {
    // Solicitar permissão do usuário
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Registrar para receber push notifications
        PushNotifications.register();
      }
    });

    // Listener para quando o token é gerado
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ', token.value);
      // Enviar token para o backend, se necessário
    });

    // Listener para erros de registro
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ', error);
    });

    // Listener para notificações recebidas
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ', notification);
      alert(`Push Notification Received: ${notification.title}`);
    });

    // Listener para quando uma notificação é clicada
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ', notification);
      alert(`Push Notification Action Performed: ${notification.notification.title}`);
    });
  }
}
