// src/app/pages/cadbomba/cadbomba.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BombaService } from '../../../services/bomba/bomba.service';
import { Bomba } from '../../../services/database.service';
import { BombaDataService } from '../../../services/bomba-data/bomba-data.service';
import { AlertController } from '@ionic/angular';
import { UtilService } from '../../../services/util/util.service';

@Component({
  selector: 'app-cadbomba',
  templateUrl: './cadbomba.page.html',
  styleUrls: ['./cadbomba.page.scss']
})
export class CadbombaPage implements OnInit {
  newBomba: Bomba = { idbomba: null, idbicos: '' };

  constructor(
    private bombaService: BombaService,
    private route: ActivatedRoute,
    private bombaDataService: BombaDataService,
    private alertController: AlertController,
    private router: Router,
    private utilService: UtilService,
  ) {}

  ngOnInit() {
    this.loadBomba();
  }

  loadBomba() {
    const bomba = this.bombaDataService.getBomba();
    if (bomba) {
      this.newBomba = bomba;
    }
  }

  async saveBomba() {
    // Validações antes de salvar a bomba
    if (!(await this.validacoesSaveBomba())) {
      return;
    }

    let message = '';
    const bombaExiste = await this.bombaService.getBombaById(this.newBomba.idbomba);
    if (bombaExiste == undefined) {
      const idbomba = await this.bombaService.addBomba(this.newBomba.idbomba, this.newBomba.idbicos);
      this.newBomba.idbomba = idbomba;
      message = `Bomba ${idbomba} adicionada com sucesso!`;
    } else {
      await this.bombaService.updateBomba(this.newBomba.idbomba, this.newBomba.idbicos);
      message = `Bomba ${this.newBomba.idbomba} atualizada com sucesso!`;
    }

    // Exibir alerta de sucesso
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Redirecionar para a página bomba após clicar em OK
            this.router.navigate(['/bomba']);
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  voltarPagina() {
    this.router.navigate(['/bomba']);
  }

  async validaBicoJaCadastrado(): Promise<boolean> {
    const bombas = await this.bombaService.getAllBombas();
    const bicosInput = this.newBomba.idbicos.split(',').map(Number);

    for (const bicoInput of bicosInput) {
      for (const bomba of bombas) {
        const bicosExistentes = bomba.idbicos.split(',').map(Number);
        if (bicosExistentes.includes(bicoInput) && bomba.idbomba !== this.newBomba.idbomba) {
          await this.utilService.showAlert('Erro de Validação', `O bico ${bicoInput} já está cadastrado na bomba ${bomba.idbomba}.`);
          return false;
        }
      }
    }

    return true;
  }

  temBicosDuplicados(idbicos: string): boolean {
    const bicosArray = idbicos.split(',').map(bico => bico.trim());
    const bicosSet = new Set(bicosArray);
    return bicosArray.length !== bicosSet.size;
  }

  async validacoesSaveBomba(): Promise<boolean> {
    // Validação de campos obrigatórios
    if (!this.newBomba.idbomba || !this.newBomba.idbicos) {
      await this.utilService.showAlert('Erro', 'Todos os campos são obrigatórios.');
      return false;
    }

    // Validação de idbomba para aceitar apenas números
    const idbombaRegex = /^\d+$/;
    if (!idbombaRegex.test(this.newBomba.idbomba.toString())) {
      await this.utilService.showAlert('Erro', 'O campo Bomba deve conter apenas números.');
      return false;
    }
    
    // Validação de idbicos para aceitar apenas números e vírgulas, e remover vírgulas no início ou no fim
    this.newBomba.idbicos = this.newBomba.idbicos.replace(/(^,)|(,$)/g, '');
    
    const idbicosRegex = /^(\d+)(,\d+)*$/;
    
    if (!idbicosRegex.test(this.newBomba.idbicos)) {
      await this.utilService.showAlert('Erro', 'O campo Bicos deve conter apenas números e vírgulas.');
      return false;
    }
    
    // Validação de bicos duplicados
    const bomba = this.bombaDataService.getBomba();
    const { isValid, mensagem } = await this.bombaService.validateBicos(this.newBomba.idbicos);
    if (!isValid && !bomba?.idbicos && !bomba?.idbomba && (bomba?.idbomba != undefined && bomba?.idbomba != this.newBomba.idbomba)) {
      await this.utilService.showAlert('Erro', mensagem);
      return false;
    }
    
    //Valida Bomba duplicado
    const bombaJaExiste = await this.bombaService.getBombaById(this.newBomba.idbomba);
    if (bombaJaExiste && bomba?.idbomba > 0) {
      await this.utilService.showAlert('Erro', `A Bomba ${bombaJaExiste.idbomba} já foi cadastrada.`);
      return false;
    }
    
    // Verificar se algum bico já está cadastrado em outra bomba
    if (!(await this.validaBicoJaCadastrado())) {
      return false;
    }

    // Verificação de duplicidade de bicos informados pelo usuario
    if (this.temBicosDuplicados(this.newBomba.idbicos)) {
      await this.utilService.showAlert('Erro', 'Há bicos duplicados no campo Bicos. Verifique.');
      return false;
    }

    return true;
  }
}
