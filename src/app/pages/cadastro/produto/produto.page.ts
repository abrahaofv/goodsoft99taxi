// src\app\pages\cadastro\produto\produto.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CombustivelService } from '../../../services/combustivel/combustivel.service';
import { Combustivel } from '../../../services/database.service';
import { CombustivelDataService } from '../../../services/combustivel-data/combustivel-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  produtos: Combustivel[] = [];
  newProduto: Combustivel = { 
    id: null, 
    nome: '', 
    idbicos: '', 
    idbombas: '', 
    preco: 0.0, 
    tipoproduto: '',
    status: true,
    ehcombustivel: false,
    ncm: '',
    anp: '',
    codigobarras: ''};

  constructor(
    private combustivelService: CombustivelService,
    private alertController: AlertController,
    private combustivelDataService: CombustivelDataService,
    private router: Router
  ) {}

  ngOnInit() {
    //this.loadCombustiveis();
  }

  ionViewWillEnter() {
    // Este método é chamado sempre que a página está prestes a ser exibida
    // Garante que os combustíveis sejam carregados sempre que o usuário voltar para esta página
    this.loadProdutos();
  }

  async loadProdutos() {
    this.produtos = await this.combustivelService.getAllCombustiveisProduto();
    this.produtos.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async addProduto() {
    if (this.newProduto.nome && this.newProduto.preco) {
      const id = await this.combustivelService.addCombustivel(
        this.newProduto.id,
        this.newProduto.nome,
        this.newProduto.idbicos,
        this.newProduto.idbombas,
        this.newProduto.preco,
        this.newProduto.tipoproduto, 
        this.newProduto.status, 
        this.newProduto.ehcombustivel, 
        this.newProduto.ncm, 
        this.newProduto.anp, 
        this.newProduto.codigobarras
      );
      this.newProduto.id = id;
      this.newProduto = { 
        id: null, 
        nome: '', 
        idbicos: '', 
        idbombas: '', 
        preco: 0.0, 
        tipoproduto: '',
        status: true,
        ehcombustivel: false,
        ncm: '',
        anp: '',
        codigobarras: ''
      };
      this.loadProdutos();
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: `Produto ${id} - ${this.newProduto.nome} salvo com sucesso!`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async deleteProduto(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Deseja realmente excluir este produto?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          handler: async () => {
            await this.combustivelService.deleteCombustivel(id);
            this.loadProdutos();
          }
        }
      ]
    });
    await alert.present();
  }

  editProduto(produto: Combustivel) {
    this.combustivelDataService.setCombustivel(produto);
    this.router.navigate(['/cadproduto']);
  }

  retornaStatusString(status:boolean): string{
    if (status){
      return 'ATIVO';
    }else if(!status){
      return 'INATIVO';
    }else{
      return '';
    }
  }
}
