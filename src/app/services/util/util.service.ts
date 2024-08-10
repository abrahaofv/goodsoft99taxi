import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private alertController: AlertController) {}

  async showAlert(header: string, message: string): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [{
          text: 'OK',
          handler: () => {
            resolve();
          }
        }]
      });
      await alert.present();
    });
  }

  // Método para verificar e converter o valor do preço
  verificarEConverterPreco(preco: any): number {
    if (preco === null || preco === undefined || preco === '') {
      return 0; 
    }

    // Verifica se o valor é uma string
    if (typeof preco === 'string') {
      // Converte a string para número e arredonda para duas casas decimais
      const precoConvertido = parseFloat(preco);
      return parseFloat(precoConvertido.toFixed(2));
    }
    // Se já for um número, arredonda para duas casas decimais
    return parseFloat(preco.toFixed(2));
  }
}
