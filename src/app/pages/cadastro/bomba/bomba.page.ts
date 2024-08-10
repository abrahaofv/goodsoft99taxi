// src/app/pages/cadastro/bomba/bomba.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BombaService } from '../../../services/bomba/bomba.service';
import { Bomba } from '../../../services/database.service';
import { BombaDataService } from '../../../services/bomba-data/bomba-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bomba',
  templateUrl: './bomba.page.html',
  styleUrls: ['./bomba.page.scss']
})
export class BombaPage implements OnInit {
  bombas: Bomba[] = [];

  constructor(
    private bombaService: BombaService,
    private alertController: AlertController,
    private bombaDataService: BombaDataService,
    private router: Router
  ) {}

  ngOnInit() {
    //this.loadBombas();
  }

  ionViewWillEnter() {
    // Este método é chamado sempre que a página está prestes a ser exibida
    // Garante que os combustíveis sejam carregados sempre que o usuário voltar para esta página
    this.loadBombas();
  }

  async loadBombas() {
    this.bombas = await this.bombaService.getAllBombas();
  }

  async deleteBomba(idbomba: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Deseja realmente excluir esta bomba?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          handler: async () => {
            await this.bombaService.deleteBomba(idbomba);
            this.loadBombas();
          }
        }
      ]
    });
    await alert.present();
  }

  editBomba(bomba: Bomba) {
    this.bombaDataService.setBomba(bomba);
    this.router.navigate(['/cadbomba']);
  }
}
