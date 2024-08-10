import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BombaService } from '../../../services/bomba/bomba.service';
import { CombustivelService } from '../../../services/combustivel/combustivel.service';
import { DescontoDataService } from '../../../services/desconto-data/desconto-data.service';
import { DescontosCombustiveis, Bomba, Combustivel } from '../../../services/database.service';
import { UtilService } from '../../../services/util/util.service';

@Component({
  selector: 'app-caddescontoscombustiveis',
  templateUrl: './caddescontoscombustiveis.page.html',
  styleUrls: ['./caddescontoscombustiveis.page.scss']
})
export class CaddescontoscombustiveisPage implements OnInit {
  bombas: Bomba[] = [];
  bicos: string[] = [];
  descontosCombustiveis: DescontosCombustiveis = {
    iddesconto: null,
    idcombustivel: 0,
    idbomba: 0,
    idbico: 0,
    nome: '',
    preco: 0,
    totallitros: null,
    totalprecocombustivel: 0,
    totaldescontocombustivel: 0,
    totaldescontorecebidocombustivel: 0,
  };
  index: number | null = null;

  constructor(
    private bombaService: BombaService,
    private combustivelService: CombustivelService,
    private descontoDataService: DescontoDataService,
    private alertController: AlertController,
    private router: Router,
    private utilService: UtilService,
  ) {}

  ngOnInit() {
    this.loadBombas();
    const currentData = this.descontoDataService.getCurrentDescontoCombustivel();
    if (currentData) {
      this.descontosCombustiveis = currentData.item;
      this.index = currentData.index;
      this.loadBicos(this.descontosCombustiveis.idbomba);
      this.loadCombustivel(this.descontosCombustiveis.idbomba, this.descontosCombustiveis.idbico);
    }
  }

  async loadBombas() {
    this.bombas = await this.bombaService.getAllBombas();
  }

  async loadBicos(idbomba: number) {
    this.bicos = await this.bombaService.getBicosByBomba(idbomba);
  }

  async loadCombustivel(idbomba: number, idbico: number) {
    const combustivel = await this.combustivelService.getCombustivelByBombaAndBico(idbomba, idbico);
    if (combustivel) {
      this.descontosCombustiveis.idcombustivel = combustivel.id;
      this.descontosCombustiveis.nome = combustivel.nome;
      this.descontosCombustiveis.preco = this.utilService.verificarEConverterPreco(combustivel.preco);
      this.calculateTotals();
    }
  }

  calculateTotals() {
    const preco = this.utilService.verificarEConverterPreco(this.descontosCombustiveis.preco);
    const totallitros = this.utilService.verificarEConverterPreco(this.descontosCombustiveis.totallitros);
    this.descontosCombustiveis.totalprecocombustivel = this.utilService.verificarEConverterPreco(preco * totallitros);
    this.descontosCombustiveis.totaldescontocombustivel = 0;
    this.descontosCombustiveis.totaldescontorecebidocombustivel = 0;
  }

  async saveProduto() {
    if (this.descontosCombustiveis.totallitros <= 0) {
      await this.utilService.showAlert('Erro', 'O total de litros deve ser maior que zero.');
      return;
    }

    this.calculateTotals();

    if (this.index !== null) {
      this.descontoDataService.updateDescontoCombustivel(this.index, this.descontosCombustiveis);
    } else {
      this.descontoDataService.addDescontoCombustivel(this.descontosCombustiveis);
    }

    this.router.navigate(['/caddesconto']);
  }

  async deleteProduto() {
    if (this.index !== null) {
      const descontosCombustiveis = this.descontoDataService.getDescontosCombustiveis();
      descontosCombustiveis.splice(this.index, 1);
    }
    this.router.navigate(['/caddesconto']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  voltar() {
    this.router.navigate(['/caddesconto']);
  }
}
